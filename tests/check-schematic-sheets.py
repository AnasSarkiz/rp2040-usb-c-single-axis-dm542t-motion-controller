"""Check real A4 dimensions, complete sheet assignment and unchanged pin nets."""
from pathlib import Path
import json

circuit = json.loads(Path('dist/index/circuit.json').read_text())
sheets = {e['schematic_sheet_id']: e for e in circuit if e['type'] == 'schematic_sheet'}
assert len(sheets) == 8
assert len({s['sheet_index'] for s in sheets.values()}) == len(sheets)
for sheet in sheets.values():
    assert sheet['sheet_size'] == 'a4'
    assert sheet['sheet_width'] == 297 and sheet['sheet_height'] == 210
components = {e['source_component_id']: e['name'] for e in circuit if e['type'] == 'source_component'}
assigned = [e for e in circuit if e['type'] == 'schematic_component']
assert len(assigned) == 96, '85 fitted components plus 11 test points must be shown'
assert all(e.get('schematic_sheet_id') in sheets for e in assigned)
assert not [e for e in circuit if 'outside_sheet' in e['type']]
notes = [e for e in circuit if e['type'] == 'schematic_text']
for number in range(1, 10):
    name = f'U{number}'
    chip = next(e for e in assigned if components[e['source_component_id']] == name)
    chip_notes = [e for e in notes if e.get('text', '').startswith(name + ' /')]
    assert len(chip_notes) == 1, name
    assert chip_notes[0]['schematic_sheet_id'] == chip['schematic_sheet_id'], name
ports = {e['source_port_id']: e for e in circuit if e['type'] == 'source_port'}
nets = {e['source_net_id']: e['name'] for e in circuit if e['type'] == 'source_net'}
actual = {}
for trace in circuit:
    if trace['type'] != 'source_trace':
        continue
    for port_id in trace['connected_source_port_ids']:
        port = ports[port_id]
        key = components[port['source_component_id']] + '.' + str(port['pin_number'])
        actual.setdefault(key, set()).update(nets[n] for n in trace.get('connected_source_net_ids', []))
actual = {key: sorted(names) for key, names in sorted(actual.items())}
expected = json.loads(Path('tests/expected-pin-nets.json').read_text())
assert actual == expected, 'Schematic reorganization changed electrical connectivity'
print(f'PASS: {len(sheets)} native A4 sheets, 96 components assigned, all IC notes on their sheet; {len(actual)} pin-net mappings unchanged')
