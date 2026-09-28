#ifndef POWER_POLICY_H
#define POWER_POLICY_H
#include <stdbool.h>
#include <stdint.h>
typedef struct {
    bool mounted, suspended, supply_ok, overcurrent;
    uint32_t milliseconds;
} PowerInputs;
typedef struct {
    bool switch_on, regulator_on, ready, fault_latched;
    uint32_t started_ms;
} PowerPolicy;
void power_policy_update(PowerPolicy *power, PowerInputs inputs);
#endif
