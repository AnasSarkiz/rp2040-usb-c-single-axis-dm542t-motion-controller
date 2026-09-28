#ifndef MOTION_H
#define MOTION_H
#include <stdbool.h>
#include <stdint.h>

typedef enum { IDLE, MOVING, HOME_RELEASE, HOME_SEEK, HOME_BACKOFF, HOME_LATCH } MotionMode;
typedef struct { bool host, supply_ok, minimum, maximum; } MotionInputs;
typedef struct {
    MotionMode mode;
    MotionInputs inputs;
    bool enabled, homed, pulse;
    int direction;
    int64_t position;
    int32_t remaining;
    float speed, acceleration, velocity, phase;
    uint32_t enable_ticks, direction_ticks, phase_ticks, phase_steps, stable_ticks, host_ticks;
    const char *fault;
} Motion;
void motion_init(Motion *motion);
void motion_abort(Motion *motion, const char *reason);
const char *motion_command(Motion *motion, const char *line);
void motion_tick(Motion *motion, MotionInputs inputs);
#endif
