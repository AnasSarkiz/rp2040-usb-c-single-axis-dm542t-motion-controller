"""Reject unintended stencil paste on bare probes and hand-soldered terminals."""
import csv
import hashlib
import json
from pathlib import Path

circuit_path = Path('dist/index/circuit.json')
circuit = json.loads(circuit_path.read_text())
source_names = {p['source_component_id']: p['name'] for p in circuit if p['type'] == 'source_component'}
component_names = {p['pcb_component_id']: source_names[p['source_component_id']] for p in circuit if p['type'] == 'pcb_component'}
paste = [p for p in circuit if p['type'] == 'pcb_solder_paste']
probes = [p for p in circuit if p['type'] == 'pcb_smtpad' and component_names[p['pcb_component_id']].startswith('TP')]
terminals = [p for p in circuit if p['type'] == 'pcb_plated_hole' and component_names.get(p.get('pcb_component_id')) in ['J2', 'J3', 'J4', 'J5', 'J6']]
def matching_paste(pad):
    return [p['pcb_solder_paste_id'] for p in paste if abs(p['x'] - pad['x']) < 1e-6 and abs(p['y'] - pad['y']) < 1e-6]
violations = [{'component': component_names[pad['pcb_component_id']], 'x_mm': pad['x'], 'y_mm': pad['y'], 'paste_ids': matching_paste(pad)} for pad in probes + terminals if matching_paste(pad)]
folder = Path('fabrication/A0-prototype.12')
placements = list(csv.DictReader((folder / 'exported/pick_and_place.csv').open()))
bom = list(csv.DictReader(Path('bom.csv').open()))
assert len(placements) == 85
assert {p['Designator'] for p in placements} == {p['Designator'] for p in bom}
assert all(p['Layer'] == 'top' for p in placements)
report = {'circuit_sha256': hashlib.sha256(circuit_path.read_bytes()).hexdigest(), 'fitted_placements': len(placements), 'status': 'blocked' if violations else 'requires_assembler_review', 'unwanted_paste': violations, 'assembler_review': 'not_performed', 'physical_testing': 'not_performed'}
(folder / 'review.json').write_text(json.dumps(report, indent=2) + '\n')
print('CPL: 85 fitted parts; top side; exact BOM designator match.')
print('Unwanted paste at', len(violations), 'probe/terminal pad positions.')
assert not violations, 'Stencil export is not approved; see fabrication/A0-prototype.12/review.json'
