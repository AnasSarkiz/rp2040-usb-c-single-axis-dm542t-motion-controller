"""Extract official Arm 13.2.Rel1 for Cortex-M0+; omit unrelated multilib targets only."""
from pathlib import Path
import hashlib
import json
import shutil
import tarfile

archive_path = Path("firmware/vendor/arm-toolchain.tar.xz")
with tarfile.open(archive_path) as archive:
    members = []
    omitted = []
    for entry in archive.getmembers():
        relative = entry.name.split("/", 1)[-1]
        # RP2040 uses only thumb/v6-m/nofp. Keep binaries, headers, licenses,
        # docs, baseline libraries and the complete v6-m multilib directories.
        skip = False
        for prefix in ("arm-none-eabi/lib/thumb/", "lib/gcc/arm-none-eabi/13.2.1/thumb/"):
            if relative.startswith(prefix) and not relative[len(prefix):].startswith("v6-m"):
                skip = True
        if relative.startswith("arm-none-eabi/lib/arm/"):
            skip = True
        (omitted if skip else members).append(entry)
    size = sum(entry.size for entry in members)
    if size + 50_000_000 > shutil.disk_usage(".").free:
        raise SystemExit(f"Need {size + 50_000_000} bytes free for the RP2040 toolchain")
    archive.extractall("firmware/vendor", members=members, filter="data")
    Path("evidence/toolchain-install.json").write_text(json.dumps({
        "source": "https://developer.arm.com/-/media/Files/downloads/gnu/13.2.Rel1/binrel/arm-gnu-toolchain-13.2.Rel1-darwin-arm64-arm-none-eabi.tar.xz",
        "archive_sha256": hashlib.sha256(archive_path.read_bytes()).hexdigest(),
        "extracted_bytes": size,
        "multilib_targets": "baseline and thumb/v6-m/nofp; unrelated multilib targets omitted to fit available storage",
        "omitted_members": [entry.name for entry in omitted],
    }, indent=2) + "\n")
    print(f"Installed official compiler and RP2040 runtime ({size} bytes)")
