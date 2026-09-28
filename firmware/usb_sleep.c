#include "usb_sleep.h"
#include "tusb.h"
#include "hardware/clocks.h"
#include "hardware/sync.h"
#include "hardware/structs/scb.h"

void usb_sleep_until_resume(void) {
    uint32_t original_sleep0 = clocks_hw->sleep_en0;
    uint32_t original_sleep1 = clocks_hw->sleep_en1;
    uint32_t original_scr = scb_hw->scr;
    // XOSC and USB PLL remain on so USB can detect host resume/reset.
    // set_sys_clock_48mhz() has already disabled the unused system PLL.
    clock_configure(clk_sys, CLOCKS_CLK_SYS_CTRL_SRC_VALUE_CLKSRC_CLK_SYS_AUX,
                    CLOCKS_CLK_SYS_CTRL_AUXSRC_VALUE_CLKSRC_PLL_USB,
                    48000000, 12000000);
    clocks_hw->sleep_en0 = 0;
    clocks_hw->sleep_en1 = CLOCKS_SLEEP_EN1_CLK_USB_USBCTRL_BITS |
                           CLOCKS_SLEEP_EN1_CLK_SYS_USBCTRL_BITS;
    hw_set_bits(&scb_hw->scr, M0PLUS_SCR_SLEEPDEEP_BITS);
    while (tud_suspended()) {
        tud_task_ext(0, false);
        // A pending interrupt wakes WFI even with PRIMASK set. Hold PRIMASK
        // between testing the queue and WFI so a just-arrived resume cannot
        // be consumed by the ISR before we go to sleep (lost-wakeup race).
        uint32_t irq = save_and_disable_interrupts();
        if (tud_suspended() && !tud_task_event_ready()) {
            __dsb();
            __wfi();
        }
        restore_interrupts(irq);
    }
    scb_hw->scr = original_scr;
    clocks_hw->sleep_en0 = original_sleep0;
    clocks_hw->sleep_en1 = original_sleep1;
    set_sys_clock_48mhz();
}
