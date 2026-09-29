"""Reconstruct source-built tscircuit fixes without modifying installed artifacts."""
import io
import json
from pathlib import Path
import shutil
import subprocess
import tarfile
import urllib.request

board = Path(__file__).resolve().parent.parent
destination = board / '.tscircuit/rebuild-toolchain'


def run(command, directory):
    subprocess.run(command, cwd=directory, check=True)


def prepare(package):
    name = package['repo'].rsplit('/', 1)[1]
    checkout = destination / name
    url = f"https://api.github.com/repos/tscircuit/{name}/tarball/{package['commit']}"
    archive_bytes = urllib.request.urlopen(url).read()
    with tarfile.open(fileobj=io.BytesIO(archive_bytes), mode='r:gz') as archive:
        root = archive.getmembers()[0].name
        archive.extractall(destination, filter='data')
        (destination / root).rename(checkout)
    run(['patch', '-p1', '--batch', '-i', str(board / package['patch'])], checkout)
    fixtures = board / 'tooling/regression-tests' / name / 'tests'
    shutil.copytree(fixtures, checkout / 'tests', dirs_exist_ok=True)
    metadata = json.loads((checkout / 'package.json').read_text())
    metadata['version'] = package['local_version']
    (checkout / 'package.json').write_text(json.dumps(metadata, indent=2) + '\n')
    subprocess.run(['bun', 'install', '--frozen-lockfile', '--network-concurrency', '4'], cwd=checkout, check=True, timeout=300)
    return checkout


if __name__ == '__main__':
    destination.mkdir(exist_ok=False)
    packages = destination / 'packages'
    packages.mkdir()
    store = destination / 'yalc-store'
    manifest = json.loads((board / 'tooling/manifest.json').read_text())
    by_name = {package['repo'].rsplit('/', 1)[1]: package for package in manifest['packages']}
    for name in ['props', 'alphabet', 'core', 'tscircuit-autorouter']:
        checkout = prepare(by_name[name])
        if name == 'props':
            for generator in ['generate-component-types', 'generate-manual-edits-docs', 'generate-readme-docs', 'generate-props-overview']:
                run(['bun', f'scripts/{generator}.ts'], checkout)
            run(['bun', 'run', 'typecheck'], checkout)
            run(['bun', 'test', 'tests/platedhole.test.ts', 'tests/platedhole-solder-paste-disabled.test.ts'], checkout)
        elif name == 'alphabet':
            run(['bun', 'run', 'generate-alphabet-outlines'], checkout)
        elif name == 'core':
            run(['bunx', 'yalc@1.0.0-pre.53', 'link', '@tscircuit/props', '--store-folder', str(store)], checkout)
            run(['bunx', '--no-install', 'tsc', '--noEmit'], checkout)
            run(['bun', 'test', 'tests/core-version.test.ts', 'tests/utils/autorouting/simple-route-json-trace-clearance.test.tsx', 'tests/utils/autorouting/simple-route-json-fixed-net-internal-connections.test.tsx', 'tests/utils/autorouting/simple-route-json-interconnect-obstacles.test.tsx', 'tests/utils/autorouting/simple-route-json-assignable-via.test.tsx', 'tests/utils/autorouting/simple-route-json-unbroken-copper-pour-obstacles.test.tsx', 'tests/repros/repro-duplicate-obstacle-connectivity-aliases.test.tsx', 'tests/components/primitive-components/plated-hole', 'tests/components/primitive-components/create-solderpaste', 'tests/components/primitive-components/smtpad-solder-paste'], checkout)
        elif name == 'tscircuit-autorouter':
            run(['bunx', '--no-install', 'tsc', '--noEmit'], checkout)
            run(['bun', 'test', 'tests/pipeline9-via-clearance-units.test.ts', 'tests/drc-via-board-rule.test.ts', 'tests/circuit-json-via-board-rule.test.ts', 'tests/drc-via-spacing.test.ts', 'tests/evaluate-relaxed-drc-board-clearance.test.ts', 'tests/via-span-reference-drc.test.ts', 'tests/via-through-hole-reference-drc.test.ts'], checkout)
        run(['bun', 'run', 'build'], checkout)
        if name == 'alphabet':
            run(['bun', 'test'], checkout)
        if name == 'props':
            run(['bunx', 'yalc@1.0.0-pre.53', 'publish', '--store-folder', str(store)], checkout)
        run(['bun', 'pm', 'pack', '--destination', str(packages)], checkout)
    print('Source builds and regression tests completed:', packages)
