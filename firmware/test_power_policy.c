#include "power_policy.h"
#include <assert.h>
#include <stdio.h>
#include <stdint.h>
int main(void) {
    PowerPolicy power = {0};
    PowerInputs inputs = {false,false,true,false,0};
    power_policy_update(&power, inputs);
    assert(!power.switch_on && !power.regulator_on && !power.ready);
    inputs.mounted=true;
    power_policy_update(&power, inputs);
    assert(power.switch_on && !power.regulator_on && !power.ready);
    inputs.milliseconds=19; power_policy_update(&power, inputs);
    assert(!power.regulator_on && !power.ready);
    inputs.milliseconds=20; power_policy_update(&power, inputs);
    assert(power.regulator_on && !power.ready);
    inputs.milliseconds=40; power_policy_update(&power, inputs);
    assert(power.ready);
    inputs.suspended=true; power_policy_update(&power, inputs);
    assert(!power.switch_on && !power.regulator_on && !power.ready);
    inputs.suspended=false; inputs.milliseconds=1000;
    power_policy_update(&power, inputs);
    assert(power.switch_on && !power.regulator_on && !power.ready);
    inputs.milliseconds=1040; power_policy_update(&power, inputs); assert(power.ready);
    inputs.supply_ok=false; power_policy_update(&power, inputs); assert(!power.switch_on && !power.ready);
    inputs.supply_ok=true; inputs.milliseconds=UINT32_MAX-10; power_policy_update(&power, inputs);
    inputs.milliseconds=29; power_policy_update(&power, inputs); assert(power.ready);
    inputs.mounted=false; power_policy_update(&power, inputs);
    assert(!power.switch_on && !power.regulator_on && !power.ready);
    inputs.mounted=true; inputs.milliseconds=100; power_policy_update(&power, inputs);
    inputs.milliseconds=140; inputs.overcurrent=true; power_policy_update(&power, inputs);
    assert(power.fault_latched && !power.ready && !power.switch_on && !power.regulator_on);
    inputs.overcurrent=false; inputs.milliseconds=300; power_policy_update(&power, inputs);
    assert(power.fault_latched && !power.switch_on);
    inputs.suspended=true; power_policy_update(&power, inputs);
    inputs.suspended=false; power_policy_update(&power, inputs);
    assert(power.fault_latched && !power.switch_on);
    inputs.mounted=false; power_policy_update(&power, inputs); assert(!power.fault_latched);
    inputs.mounted=true; power_policy_update(&power, inputs); assert(power.switch_on && !power.ready);
    inputs.milliseconds=340; power_policy_update(&power, inputs); assert(power.ready);
    inputs.overcurrent=true; power_policy_update(&power, inputs); assert(power.fault_latched && !power.ready);
    puts("PASS: overload latch through suspend until USB unmount,  pre-enumeration off, staged startup, suspend, resume restart, undervoltage, timer wrap, USB reset/unmount");
}
