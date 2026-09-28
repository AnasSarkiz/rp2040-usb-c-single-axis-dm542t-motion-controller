"""Prototype exercise: explicit --steps authorizes movement. Requires pyserial==3.5."""
import argparse
import time
import serial

parser = argparse.ArgumentParser(description=__doc__)
parser.add_argument("port", help="USB serial device, e.g. /dev/cu.usbmodem...")
parser.add_argument("--steps", type=int, required=True)
args = parser.parse_args()
if not -1000000 <= args.steps <= 1000000:
    parser.error("steps must be between -1000000 and 1000000")
with serial.Serial(args.port, 115200, timeout=1, write_timeout=1) as port:
    port.dtr = True
    time.sleep(0.3)
    port.reset_input_buffer()

    def command(line):
        port.write((line + "\n").encode("ascii"))
        reply = port.readline().decode("ascii").strip()
        if not reply or reply.startswith("ERR"):
            raise RuntimeError(f"{line}: {reply or 'no reply'}")
        return reply

    try:
        print(command("STATUS"))
        command("SPEED 500")
        command("ACCEL 1000")
        command("ENABLE")
        time.sleep(0.25)
        command(f"MOVE {args.steps}")
        deadline = time.monotonic() + abs(args.steps) / 500 + 10
        while True:
            command("PING")
            status = command("STATUS")
            print(status)
            fields = dict(field.split("=", 1) for field in status.split()[1:])
            if fields["fault"] != "none":
                raise RuntimeError(status)
            if fields["mode"] == "0":
                break
            if time.monotonic() > deadline:
                raise RuntimeError("Move did not complete before host timeout")
            time.sleep(0.2)
    finally:
        print(command("STOP"))
