# A0 firmware — compiled, not tested on hardware

RP2040 GPIOs: 0 STEP, 1 DIR, 2 ENABLE, 3 ARM, 4 MIN, 5 MAX, 6 driver input switch, 7 driver converter enable, 8 active-low power fault, 25 status LED, 26 protected-5-V ADC. The 12 MHz crystal feeds a 48 MHz system clock. Flash boot uses SDK `boot2_w25q080`, whose source explicitly supports W25Q16JV. This board uses 2 MiB flash. No Pololu code is reused.

## Build

Tested: Raspberry Pi Pico SDK 2.2.0 (`a1438dff1d38bd9c65dbd693f0e5db4b9ae91779`), TinyUSB `86ad6e56c1700e85f1c5678607a762cfe3aa2f47`, Arm GNU 13.2.Rel1 for macOS arm64, CMake 3.31.6. SDK and TinyUSB licenses remain in `vendor/`. All dependencies are under this board directory. The global Homebrew compiler could not link because `nosys.specs` was missing; use the official Arm distribution.

From the board directory, with the pinned SDK at `firmware/vendor/pico-sdk`:

```sh
firmware/.venv/bin/cmake -S firmware -B firmware/build-arm -DCMAKE_BUILD_TYPE=Release -DPICO_TOOLCHAIN_PATH="$PWD/firmware/vendor/arm-gnu-toolchain-13.2.Rel1-darwin-arm64-arm-none-eabi"
firmware/.venv/bin/cmake --build firmware/build-arm -j 4
bun run test:firmware
```

A standard installation of the same CMake version can replace the local Python-venv executable. A full official Arm installation works; this checkout extracted baseline and Cortex-M0+ libraries only to fit disk space. `scripts/install-arm-toolchain.py` records the exact archive hash and omitted multilib directories in the local `evidence/toolchain-install.json`; the public validation record includes the original archive hash. No compiler or SDK internals were modified. Reconstruct the SDK with `git clone --branch 2.2.0 --depth 1 https://github.com/raspberrypi/pico-sdk firmware/vendor/pico-sdk`, then initialize its `lib/tinyusb` submodule. Retain the recorded commits when reproducing.

Outputs are `build-arm/motion_controller.elf`, `.bin`, and `.hex`. The ELF compiles with `-Wall -Wextra -Werror`; this is software build evidence only. The optional SDK picotool build is disabled, so no UF2 is emitted. With a separately installed official [picotool](https://github.com/raspberrypi/picotool), hold BOOTSEL while pressing RESET, release RESET, then release BOOTSEL. Use `picotool load firmware/build-arm/motion_controller.elf`, then `picotool reboot`. Disconnect the driver while first programming. SWCLK, SWDIO, RUN, 3V3 reference and GND test pads also support an external SWD probe; the probe must not power the board.

## Serial protocol

ASCII, one command per newline; CR is ignored. Open the CDC port with DTR asserted. Baud rate does not set motion timing. Maximum line length is 79 characters. Replies are `OK`, `ERR reason`, or a `STATUS` line. Negative numbers require an ASCII minus sign. Trailing arguments, whitespace, out-of-range values and numeric overflow are rejected.

| Command | Meaning |
|---|---|
| `SPEED 500` | Set 1–2000 steps/s while idle; default 500 |
| `ACCEL 1000` | Set 1–20000 steps/s² while idle; default 1000 |
| `ENABLE` | Release the powered driver's disable input; wait at least 200 ms before a move |
| `MOVE -100` | Relative move, −1,000,000 to +1,000,000 commanded steps |
| `HOME` | Home toward MIN; release if initially open, seek, back off, then latch slowly |
| `PING` | Reset the one-second host heartbeat timer; send at least every 200 ms |
| `STOP` / `DISABLE` | Immediate planner abort; disable and invalidate homing |
| `STATUS` | Position, enable, homed, numeric mode, limits, supply-valid and fault |

Mode values: 0 idle, 1 moving, 2 initial home release, 3 seek, 4 backoff, 5 slow latch. Positive moves use DIR=1 at the MCU; actual motor direction depends on wiring. Position counts requested pulses and is not encoder feedback. Homing establishes zero only after a stable latch. Each homing phase is bounded by 30 s and 20,000 steps. Seek/release/backoff are at most 300 steps/s; latch at most 100 steps/s. A switch must remain stable for 5 ms to complete a phase. Ordinary directional limits stop on the first sampled assertion. Moving away from a single asserted limit is permitted; two asserted limits fault.

A PIO program drives STEP high for ten 1 µs cycles and low for at least ten cycles. The planner runs every 100 µs, ramps its pulse rate, and adds a 2 ms direction guard. At the 2000 steps/s cap, normal rising edges are at least 500 µs apart. PIO FIFO backlog or timer intervals outside 90–150 µs abort motion. USB arrival timing never directly generates a pulse. These timing calculations are not oscilloscope measurements; interrupt execution time, MOSFET edges and loaded optocoupler current remain physical tests.

Disconnect, missing heartbeat, undervoltage, both limits, homing timeout and STOP disarm STEP. The 500 mA USB configuration keeps driver power off before enumeration; the input switch starts first, the converter after 20 ms, and readiness after 40 ms. V5 ADC threshold 2600 is nominally 4.19 V. The TPS3839 handles 3V3 brownout independently. A driver overcurrent fault latches its supply off until USB reset/unmount; suspend does not clear this latch.

Suspend aborts motion, turns driver power off, stops/clears PIO and the planner timer, disables ADC/watchdog and waits in deep sleep with USB clocks retained. System clock drops to 12 MHz, then restores to 48 MHz on resume. Old commands and pulses are cleared; re-enable explicitly. ENA loses optocoupler current while driver power is off, so holding torque can return. USB suspend current, reset pulse suppression and all loaded timing need physical measurement.

`bun run test:power` tests sequencing, undervoltage, suspend/resume, timer wrap and overload latching with sanitizers. `bun run test:firmware` tests parsing and motion. Cross-compilation and these tests do not establish hardware behavior.

## Host example

Install `pyserial==3.5` in a task-local virtual environment. With both normally-closed limits wired, axis clear, and the driver configured per the board README:

```sh
python firmware/host-example.py /dev/cu.usbmodemXXXX --steps 100
```

This explicitly moves the axis, polls status, sends heartbeat messages, and stops afterward. The example has not been run against physical hardware. Use a physical machine stop independent of USB software where the machinery requires one.
