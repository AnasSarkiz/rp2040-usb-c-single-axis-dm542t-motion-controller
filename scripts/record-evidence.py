"""Version source and checked artifacts without relying on a workspace Git repository."""
from datetime import datetime, timezone
from pathlib import Path
import hashlib
import json
import argparse
parser=argparse.ArgumentParser()
parser.add_argument("--version", required=True)
parser.add_argument("--routed", action="store_true")
args=parser.parse_args()

root=Path('.')
excluded={'.git','node_modules','dist','evidence','.venv','vendor','build','build-arm','__pycache__','.tscircuit'}
source_paths=[]
for path in root.rglob('*'):
    if not path.is_file() or any(part in excluded for part in path.parts):
        continue
    if path.name in {'test-motion','test-power'} or path.suffix in {'.html','.pyc'}:
        continue
    source_paths.append(path)

def digest(path):
    return {'path':path.as_posix(),'sha256':hashlib.sha256(path.read_bytes()).hexdigest(),'bytes':path.stat().st_size}

versions={}
for package in ['tscircuit','@tscircuit/cli','@tscircuit/core','typescript','@biomejs/biome','@types/node']:
    versions[package]=json.loads((root/'node_modules'/package/'package.json').read_text())['version']
manifest={'revision':'A0','source_version':args.version,'created_at':datetime.now(timezone.utc).isoformat(),'git_commit':None,'routing_enabled':args.routed,'dependencies':versions,'sources':[digest(path) for path in sorted(source_paths)]}
source_manifest=Path(f'evidence/source-manifest-{args.version}.json')
if source_manifest.exists(): raise FileExistsError(source_manifest)
source_manifest.write_text(json.dumps(manifest,indent=2)+'\n')
artifacts=[]
for directory in ['dist/index','evidence','firmware/build-arm']:
    for path in Path(directory).rglob('*'):
        if path.is_file() and (directory!='firmware/build-arm' or path.name.startswith('motion_controller.')) and not path.name.startswith('artifact-manifest'):
            artifacts.append(digest(path))
Path(f'evidence/artifact-manifest-{args.version}.json').write_text(json.dumps({'source_manifest_sha256':digest(source_manifest)['sha256'],'scope':'Artifact inventory includes historical, rejected and corrupted evidence. See VALIDATION.md for applicability; hashes do not imply validation success.','artifacts':artifacts},indent=2)+'\n')
print(f'Recorded {len(source_paths)} source/reference files and {len(artifacts)} evidence artifacts')
