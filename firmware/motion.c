#include "motion.h"
#include <errno.h>
#include <limits.h>
#include <math.h>
#include <stdlib.h>
#include <string.h>

void motion_init(Motion *motion) {
    *motion = (Motion){.mode=IDLE,.speed=500,.acceleration=1000,.direction=1,.fault="none"};
}
void motion_abort(Motion *motion, const char *reason) {
    motion->mode=IDLE;
    motion->enabled=false;
    motion->homed=false;
    motion->pulse=false;
    motion->velocity=0;
    motion->phase=0;
    motion->remaining=0;
    motion->fault=reason;
}
static void enter_mode(Motion *motion, MotionMode mode) {
    motion->mode=mode;
    motion->velocity=0;
    motion->phase=0;
    motion->phase_ticks=0;
    motion->phase_steps=0;
    motion->stable_ticks=0;
    motion->direction_ticks=0;
}
static bool parse_integer(const char *text, long *number) {
    if (!*text || *text==' ' || *text=='\t') return false;
    const char *digits=text;
    if (*digits=='-' || *digits=='+') digits++;
    if (!*digits) return false;
    for (const char *cursor=digits; *cursor; cursor++) if (*cursor<'0' || *cursor>'9') return false;
    errno=0;
    char *end;
    *number=strtol(text,&end,10);
    return errno!=ERANGE && *end=='\0';
}
const char *motion_command(Motion *motion, const char *line) {
    if (!strcmp(line,"STOP") || !strcmp(line,"DISABLE")) {
        motion_abort(motion,"stopped"); return "OK";
    }
    if (!strcmp(line,"STATUS")) return "STATUS";
    if (!strcmp(line,"PING")) { motion->host_ticks=0; return "OK"; }
    if (!strcmp(line,"ENABLE")) {
        if (!motion->inputs.host || !motion->inputs.supply_ok) return "ERR power_or_host";
        if (motion->inputs.minimum && motion->inputs.maximum) return "ERR both_limits";
        if (motion->mode!=IDLE) return "ERR busy";
        motion->enabled=true; motion->enable_ticks=0; motion->host_ticks=0; motion->fault="none";
        return "OK";
    }
    if (!strcmp(line,"HOME")) {
        if (!motion->enabled || motion->enable_ticks<2000) return "ERR not_ready";
        if (motion->mode!=IDLE) return "ERR busy";
        if (motion->inputs.maximum) return "ERR maximum_limit";
        motion->homed=false;
        enter_mode(motion,motion->inputs.minimum ? HOME_RELEASE : HOME_SEEK);
        return "OK";
    }
    const char *argument=strchr(line,' ');
    if (!argument) return "ERR command";
    long number;
    if (!parse_integer(argument+1,&number)) return "ERR number";
    if (motion->mode!=IDLE) return "ERR busy";
    if (!strncmp(line,"SPEED ",6)) {
        if (number<1 || number>2000) return "ERR range";
        motion->speed=(float)number; return "OK";
    }
    if (!strncmp(line,"ACCEL ",6)) {
        if (number<1 || number>20000) return "ERR range";
        motion->acceleration=(float)number; return "OK";
    }
    if (!strncmp(line,"MOVE ",5)) {
        if (number < -1000000 || number > 1000000) return "ERR range";
        if (!motion->enabled || motion->enable_ticks<2000) return "ERR not_ready";
        if ((number<0 && motion->inputs.minimum) || (number>0 && motion->inputs.maximum)) return "ERR limit";
        if ((number>0 && motion->position>INT64_MAX-number) || (number<0 && motion->position<INT64_MIN-number)) return "ERR position_overflow";
        if (!number) return "OK";
        motion->remaining=(int32_t)labs(number);
        motion->direction=number>0 ? 1 : -1;
        enter_mode(motion,MOVING);
        return "OK";
    }
    return "ERR command";
}
static bool home_transition(Motion *motion) {
    bool seeking=motion->mode==HOME_SEEK || motion->mode==HOME_LATCH;
    bool reached=seeking ? motion->inputs.minimum : !motion->inputs.minimum;
    if (!reached) { motion->stable_ticks=0; return false; }
    motion->velocity=0; motion->phase=0;
    if (++motion->stable_ticks<50) return true;
    if (motion->mode==HOME_LATCH) {
        motion->position=0; motion->homed=true; enter_mode(motion,IDLE);
    } else if (motion->mode==HOME_SEEK) enter_mode(motion,HOME_BACKOFF);
    else if (motion->mode==HOME_RELEASE) enter_mode(motion,HOME_SEEK);
    else enter_mode(motion,HOME_LATCH);
    return true;
}
void motion_tick(Motion *motion, MotionInputs inputs) {
    motion->inputs=inputs;
    motion->pulse=false;
    if (!inputs.host || !inputs.supply_ok) {
        motion_abort(motion,!inputs.host ? "host_disconnected" : "supply_low"); return;
    }
    if (!motion->enabled) return;
    if (++motion->host_ticks>=10000) { motion_abort(motion,"heartbeat_timeout"); return; }
    if (inputs.minimum && inputs.maximum) { motion_abort(motion,"both_limits"); return; }
    if (motion->enable_ticks<2000) { motion->enable_ticks++; return; }
    if (motion->mode==IDLE) return;
    float target=motion->speed;
    if (motion->mode!=MOVING) {
        if (inputs.maximum) { motion_abort(motion,"maximum_limit"); return; }
        if (++motion->phase_ticks>300000 || motion->phase_steps>=20000) { motion_abort(motion,"home_timeout"); return; }
        if (home_transition(motion)) return;
        motion->direction=(motion->mode==HOME_SEEK || motion->mode==HOME_LATCH) ? -1 : 1;
        target=motion->mode==HOME_LATCH ? 100 : 300;
        if (target>motion->speed) target=motion->speed;
    } else if ((motion->direction<0 && inputs.minimum) || (motion->direction>0 && inputs.maximum)) {
        motion_abort(motion,"limit"); return;
    }
    // 2 ms direction guard exceeds the selected driver's 5 us setup minimum.
    if (motion->direction_ticks<20) { motion->direction_ticks++; return; }
    const float dv=motion->acceleration*0.0001f;
    if (motion->mode==MOVING) {
        float stopping=motion->velocity*motion->velocity/(2*motion->acceleration);
        if (motion->remaining<=stopping+1) target=fminf(target,sqrtf(2*motion->acceleration*motion->remaining));
    }
    if (motion->velocity<target) motion->velocity=fminf(target,motion->velocity+dv);
    else motion->velocity=fmaxf(target,motion->velocity-dv);
    motion->phase+=motion->velocity*0.0001f;
    if (motion->phase<1) return;
    motion->phase-=1;
    if ((motion->direction>0 && motion->position==INT64_MAX) || (motion->direction<0 && motion->position==INT64_MIN)) { motion_abort(motion,"position_overflow"); return; }
    motion->pulse=true;
    motion->position+=motion->direction;
    motion->phase_steps++;
    if (motion->mode==MOVING && --motion->remaining==0) {
        // Leave the final hardware pulse intact; no more pulses will be queued.
        enter_mode(motion,IDLE);
    }
}
