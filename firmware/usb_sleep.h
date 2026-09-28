#ifndef USB_SLEEP_H
#define USB_SLEEP_H
// Called with the pulse engine, ADC and application timers stopped.
// Returns after the host resumes or resets USB; motion must remain disarmed.
void usb_sleep_until_resume(void);
#endif
