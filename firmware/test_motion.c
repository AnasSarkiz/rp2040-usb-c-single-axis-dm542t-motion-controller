#include "motion.h"
#include <assert.h>
#include <stdio.h>
#include <string.h>
static MotionInputs inputs={true,true,false,false};
static void ticks(Motion *motion, unsigned count) {
    for (unsigned i=0;i<count;i++) {
        if (i%1000==0) assert(!strcmp(motion_command(motion,"PING"),"OK"));
        motion_tick(motion,inputs);
    }
}
static void ready(Motion *motion) {
    inputs=(MotionInputs){true,true,false,false};
    motion_init(motion); motion_tick(motion,inputs);
    assert(!strcmp(motion_command(motion,"ENABLE"),"OK"));
    assert(!strcmp(motion_command(motion,"MOVE 1"),"ERR not_ready"));
    ticks(motion,2000);
}
static void finish(Motion *motion) {
    for (unsigned i=0;i<1000000 && motion->mode!=IDLE;i++) ticks(motion,1);
    assert(motion->mode==IDLE);
}
int main(void) {
    Motion motion; ready(&motion);
    const char *invalid[]={"MOVE","MOVE ","MOVE 1x","MOVE 1 2","MOVE 99999999999999999999999999","MOVE 1000001","SPEED 0","SPEED 2001","ACCEL -1","ENABLE X","HOME now"};
    for (unsigned i=0;i<sizeof(invalid)/sizeof(invalid[0]);i++) assert(strncmp(motion_command(&motion,invalid[i]),"ERR",3)==0);
    assert(!strcmp(motion_command(&motion,"MOVE 100"),"OK"));
    assert(!strcmp(motion_command(&motion,"MOVE 1"),"ERR busy"));
    ticks(&motion,20); assert(!motion.pulse);
    finish(&motion); assert(motion.position==100 && motion.enabled);
    assert(!strcmp(motion_command(&motion,"MOVE -37"),"OK"));
    finish(&motion); assert(motion.position==63);
    assert(!strcmp(motion_command(&motion,"MOVE 100"),"OK"));
    ticks(&motion,100); motion_command(&motion,"STOP");
    int64_t stopped=motion.position; ticks(&motion,10000);
    assert(motion.position==stopped && !motion.enabled && !motion.homed);
    ready(&motion); motion_command(&motion,"MOVE 1000"); ticks(&motion,3000);
    inputs.maximum=true; ticks(&motion,1);
    assert(!motion.enabled && !motion.pulse && !strcmp(motion.fault,"limit"));
    ready(&motion); inputs.host=false; ticks(&motion,1); assert(!motion.enabled);
    ready(&motion); inputs.supply_ok=false; ticks(&motion,1); assert(!motion.enabled);
    ready(&motion); inputs.minimum=inputs.maximum=true; ticks(&motion,1); assert(!motion.enabled);
    ready(&motion); for(unsigned i=0;i<10000;i++) motion_tick(&motion,inputs);
    assert(!motion.enabled && !strcmp(motion.fault,"heartbeat_timeout"));
    ready(&motion); inputs.minimum=true; ticks(&motion,1);
    assert(!strcmp(motion_command(&motion,"MOVE -1"),"ERR limit"));
    assert(!strcmp(motion_command(&motion,"MOVE 1"),"OK")); finish(&motion); assert(motion.position==1);
    ready(&motion); motion_command(&motion,"HOME"); ticks(&motion,3000); assert(motion.position<0);
    inputs.minimum=true; ticks(&motion,49); assert(motion.mode==HOME_SEEK);
    inputs.minimum=false; ticks(&motion,1); inputs.minimum=true; ticks(&motion,50);
    assert(motion.mode==HOME_BACKOFF); ticks(&motion,3000);
    inputs.minimum=false; ticks(&motion,50); assert(motion.mode==HOME_LATCH);
    ticks(&motion,3000); inputs.minimum=true; ticks(&motion,50);
    assert(motion.mode==IDLE && motion.homed && motion.position==0);
    ready(&motion); inputs.minimum=true; ticks(&motion,1); motion_command(&motion,"HOME");
    assert(motion.mode==HOME_RELEASE); ticks(&motion,3000); assert(motion.position>0);
    inputs.minimum=false; ticks(&motion,50); assert(motion.mode==HOME_SEEK);
    ready(&motion); motion_command(&motion,"HOME"); ticks(&motion,300100);
    assert(!motion.enabled && !strcmp(motion.fault,"home_timeout"));
    ready(&motion); motion.position=INT64_MAX; assert(!strcmp(motion_command(&motion,"MOVE 1"),"ERR position_overflow"));
    puts("PASS: parser, signed moves, readiness, direction guard, stop, limits, disconnect, voltage, heartbeat, homing debounce/release/latch/timeout, overflow");
}
