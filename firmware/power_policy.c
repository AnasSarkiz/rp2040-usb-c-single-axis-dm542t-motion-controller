#include "power_policy.h"
void power_policy_update(PowerPolicy *power, PowerInputs inputs) {
    if (!inputs.mounted) {
        *power = (PowerPolicy){0};
        return;
    }
    if (power->ready && inputs.overcurrent) power->fault_latched = true;
    if (inputs.suspended || !inputs.supply_ok || power->fault_latched) {
        bool fault_latched = power->fault_latched;
        *power = (PowerPolicy){.fault_latched = fault_latched};
        return;
    }
    if (!power->switch_on) {
        power->switch_on = true;
        power->started_ms = inputs.milliseconds;
    }
    uint32_t elapsed_ms = inputs.milliseconds - power->started_ms;
    // Allow the current-limited input reservoir 20 ms to charge, then
    // another 20 ms for the converter before accepting ENABLE.
    power->regulator_on = elapsed_ms >= 20;
    power->ready = elapsed_ms >= 40;
    if (power->ready && inputs.overcurrent) {
        *power = (PowerPolicy){.fault_latched = true};
    }
}
