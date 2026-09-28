# Physical bring-up checklist — revision A0

**Pending. No physical board exists or has been tested.** Only perform these checks after design and fabrication gates pass. Record board serial/revision, assembly substitutions, firmware hash, instruments, driver label/revision, motor, supply, DIP settings and ambient conditions for each result.

- Inspect assembly orientation, solder bridges, exposed-pad joints, USB shell anchors and mounting clearances.
- Check unpowered rail resistance and absence of USB backfeeding.
- Power from a current-limited USB source; measure VBUS, 3.3 V, 1.1 V, current and regulator temperature.
- Measure current before enumeration (<100 mA), after configuration (<500 mA), inrush, and USB suspend (<2.5 mA); verify suspend entry/resume and both current-limit startup stages.
- Measure VDRV at each loaded driver pair over USB voltage/cable/temperature corners: require 4.5–5 V, allocated ripple ≤50 mV peak-to-peak, each cable loop ≤1 Ω. Verify short/overload limiting and firmware latch; only USB unmount/reset clears it.
- Confirm normal USB enumeration, both USB-C orientations, reset, BOOTSEL flash recovery and SWD access.
- With the motor supply isolated, scope STEP/DIR/ENA across startup, reset, bootloader, firmware crash/watchdog and USB cable removal. Record pulse widths, edge rates, startup glitches and minimum voltage at driver terminals.
- Connect only the selected DM542T V4.0 with S2 at 5 V and correct motor current settings. Verify ENABLE polarity and its controller-power-loss behavior.
- Verify positive/negative relative movement, configured speed/acceleration, STOP, invalid commands and pulse-count position reports.
- Test each limit using closed contact, open contact, disconnected wire, contact bounce and attempted travel toward/away from the limit.
- Exercise homing from both sides of the switch, already-active input, stuck switch, broken wire, opposite-limit activation, travel bound and timeout.
- Test host closure, unplug, USB suspend, missing heartbeat and reconnect. Record stopping latency and require explicit re-enable.
- Run the intended load over its operating range; measure rail current, temperatures and signal timing. Determine tested limits from measurements rather than design targets.
- Archive scope captures, setup photos, firmware/build identity and pass/fail results. Keep unresolved findings visible in VALIDATION.md.
