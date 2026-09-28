#include <inttypes.h>
#include <stdio.h>
#include <string.h>
#include "pico/stdlib.h"
#include "hardware/adc.h"
#include "hardware/clocks.h"
#include "hardware/pio.h"
#include "hardware/sync.h"
#include "hardware/watchdog.h"
#include "motion.h"
#include "step.pio.h"
#include "tusb.h"
#include "usb_sleep.h"
#include "power_policy.h"

#define STEP_PIN 0
#define DIR_PIN 1
#define ENABLE_PIN 2
#define ARM_PIN 3
#define MIN_PIN 4
#define MAX_PIN 5
#define LED_PIN 25
#define SENSE_PIN 26
#define DRIVER_POWER_PIN 6
#define DRIVER_REG_ENABLE_PIN 7
#define DRIVER_FAULT_PIN 8
static PowerPolicy power;
static Motion motion;
static volatile bool host_connected;
static volatile bool supply_ok;
static PIO step_pio=pio0;
static uint step_sm;
static uint64_t previous_tick;
static void usb_abort(const char *reason) {
    uint32_t irq=save_and_disable_interrupts();
    gpio_put(ARM_PIN,0);
    motion_abort(&motion,reason);
    host_connected=false;
    gpio_put(ENABLE_PIN,0);
    restore_interrupts(irq);
}
void tud_suspend_cb(bool remote_wakeup_enabled) {
    (void)remote_wakeup_enabled;
    usb_abort("usb_suspend");
    gpio_put(DRIVER_REG_ENABLE_PIN,0);
    gpio_put(DRIVER_POWER_PIN,0);
    power=(PowerPolicy){.fault_latched=power.fault_latched};
}
void tud_umount_cb(void) {
    usb_abort("usb_reset");
    gpio_put(DRIVER_REG_ENABLE_PIN,0);
    gpio_put(DRIVER_POWER_PIN,0);
    power=(PowerPolicy){0};
}
void tud_cdc_line_state_cb(uint8_t interface, bool dtr, bool rts) {
    (void)rts;
    if (interface==0 && !dtr) usb_abort("serial_closed");
}
static bool tick(struct repeating_timer *timer) {
    (void)timer;
    uint64_t now=time_us_64();
    if (previous_tick && (now-previous_tick<90 || now-previous_tick>150)) motion_abort(&motion,"timer_overrun");
    previous_tick=now;
    // FIFO must be empty before another pulse is counted/queued.
    if (!pio_sm_is_tx_fifo_empty(step_pio,step_sm)) motion_abort(&motion,"pulse_engine_busy");
    motion_tick(&motion,(MotionInputs){host_connected,supply_ok,gpio_get(MIN_PIN),gpio_get(MAX_PIN)});
    if (motion.enabled && motion.enable_ticks>=2000) gpio_put(DIR_PIN,motion.direction>0);
    gpio_put(ENABLE_PIN,motion.enabled);
    gpio_put(ARM_PIN,motion.enabled);
    gpio_put(LED_PIN,motion.enabled);
    if (motion.pulse) pio_sm_put(step_pio,step_sm,0);
    return true;
}
static void print_status(Motion snapshot) {
    printf("STATUS position=%" PRId64 " enabled=%d homed=%d mode=%d min=%d max=%d supply_ok=%d fault=%s\n",snapshot.position,snapshot.enabled,snapshot.homed,snapshot.mode,snapshot.inputs.minimum,snapshot.inputs.maximum,snapshot.inputs.supply_ok,snapshot.fault);
}
int main(void) {
    for (uint pin=0;pin<=3;pin++) { gpio_init(pin); gpio_put(pin,0); gpio_set_dir(pin,GPIO_OUT); }
    gpio_init(DRIVER_POWER_PIN); gpio_put(DRIVER_POWER_PIN,0); gpio_set_dir(DRIVER_POWER_PIN,GPIO_OUT);
    gpio_init(DRIVER_REG_ENABLE_PIN); gpio_put(DRIVER_REG_ENABLE_PIN,0); gpio_set_dir(DRIVER_REG_ENABLE_PIN,GPIO_OUT);
    gpio_init(DRIVER_FAULT_PIN); gpio_set_dir(DRIVER_FAULT_PIN,GPIO_IN);
    gpio_init(LED_PIN); gpio_set_dir(LED_PIN,GPIO_OUT);
    gpio_init(MIN_PIN); gpio_set_dir(MIN_PIN,GPIO_IN); gpio_set_input_hysteresis_enabled(MIN_PIN,true);
    gpio_init(MAX_PIN); gpio_set_dir(MAX_PIN,GPIO_IN); gpio_set_input_hysteresis_enabled(MAX_PIN,true);
    set_sys_clock_48mhz();
    stdio_init_all();
    adc_init(); adc_gpio_init(SENSE_PIN); adc_select_input(0);
    motion_init(&motion);
    step_sm=pio_claim_unused_sm(step_pio,true);
    uint offset=pio_add_program(step_pio,&step_pulse_program);
    pio_sm_config config=step_pulse_program_get_default_config(offset);
    sm_config_set_set_pins(&config,STEP_PIN,1);
    sm_config_set_clkdiv(&config,48.0f); // 48 MHz / 48: exactly 1 us per PIO cycle.
    pio_gpio_init(step_pio,STEP_PIN);
    pio_sm_set_consecutive_pindirs(step_pio,step_sm,STEP_PIN,1,true);
    pio_sm_init(step_pio,step_sm,offset,&config);
    pio_sm_set_pins_with_mask(step_pio,step_sm,0,1u<<STEP_PIN);
    pio_sm_set_enabled(step_pio,step_sm,true);
    struct repeating_timer timer;
    if (!add_repeating_timer_us(-100,tick,NULL,&timer)) panic("motion timer unavailable");
    watchdog_enable(250,true);
    char line[80]; size_t length=0; bool overflow=false;
    while (true) {
        tud_task_ext(0,false);
        if (tud_suspended()) {
            uint32_t irq=save_and_disable_interrupts();
            // Break the series STEP path before stopping or clearing PIO.
            gpio_put(ARM_PIN,0);
            motion_abort(&motion,"usb_suspend");
            host_connected=false;
            supply_ok=false;
            cancel_repeating_timer(&timer);
            pio_sm_set_enabled(step_pio,step_sm,false);
            pio_sm_clear_fifos(step_pio,step_sm);
            pio_sm_restart(step_pio,step_sm);
            pio_sm_set_pins_with_mask(step_pio,step_sm,0,1u<<STEP_PIN);
            gpio_put(DIR_PIN,0);
            gpio_put(LED_PIN,0);
            // Remove the optocoupler supply. No driver current is taken from
            // USB in suspend. ENA release can restore holding torque.
            gpio_put(ENABLE_PIN,0);
            gpio_put(DRIVER_REG_ENABLE_PIN,0);
            gpio_put(DRIVER_POWER_PIN,0);
            power=(PowerPolicy){.fault_latched=power.fault_latched};
            watchdog_disable();
            adc_run(false);
            adc_hw->cs &= ~ADC_CS_EN_BITS;
            restore_interrupts(irq);
            length=0; overflow=false;
            usb_sleep_until_resume();
            tud_cdc_read_flush();
            gpio_put(ENABLE_PIN,0);
            adc_init(); adc_select_input(0);
            // Reinitialize PC as well as FIFO: no pre-suspend pulse survives.
            pio_sm_init(step_pio,step_sm,offset,&config);
            pio_sm_set_pins_with_mask(step_pio,step_sm,0,1u<<STEP_PIN);
            pio_sm_set_enabled(step_pio,step_sm,true);
            previous_tick=0;
            if (!add_repeating_timer_us(-100,tick,NULL,&timer)) panic("motion timer unavailable");
            watchdog_enable(250,true);
            continue;
        }
        watchdog_update();
        host_connected=stdio_usb_connected();
        // The buck-boost regulates VDRV; this ADC monitors its upstream V5.
        // This is a coarse cable/supply fault threshold, not a voltage reference.
        bool upstream_ok=adc_read()>=2600; // approximately 4.19 V nominal.
        power_policy_update(&power,(PowerInputs){tud_mounted(),false,upstream_ok,!gpio_get(DRIVER_FAULT_PIN),to_ms_since_boot(get_absolute_time())});
        if (power.fault_latched) usb_abort("driver_overcurrent");
        // On shutdown remove regulator enable before its input supply.
        if (!power.regulator_on) gpio_put(DRIVER_REG_ENABLE_PIN,0);
        gpio_put(DRIVER_POWER_PIN,power.switch_on);
        if (power.regulator_on) gpio_put(DRIVER_REG_ENABLE_PIN,1);
        supply_ok=power.ready;
        if (!host_connected) { length=0; overflow=false; }
        int ch=getchar_timeout_us(0);
        if (ch==PICO_ERROR_TIMEOUT) { tight_loop_contents(); continue; }
        if (ch=='\r') continue;
        if (ch=='\n') {
            uint32_t irq=save_and_disable_interrupts();
            const char *reply;
            if (overflow) { motion_abort(&motion,"line_overflow"); reply="ERR line_too_long"; }
            else { line[length]='\0'; reply=motion_command(&motion,line); }
            Motion snapshot=motion;
            restore_interrupts(irq);
            if (!strcmp(reply,"STATUS")) print_status(snapshot); else puts(reply);
            length=0; overflow=false;
        } else if (ch<32 || ch>126 || length>=sizeof(line)-1) overflow=true;
        else if (!overflow) line[length++]=(char)ch;
    }
}
