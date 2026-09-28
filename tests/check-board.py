"""Check emitted connectivity and sourcing; this does not replace PCB DRC."""
from collections import Counter
import argparse
parser=argparse.ArgumentParser()
parser.add_argument("--stage", choices=["placement","routed"], default="placement")
args=parser.parse_args()
import csv
import json
from pathlib import Path

circuit = json.loads(Path('dist/index/circuit.json').read_text())
components = {item['name']: item for item in circuit if item['type'] == 'source_component'}
ports = {item['source_port_id']: item for item in circuit if item['type'] == 'source_port'}
nets = {item['source_net_id']: item['name'] for item in circuit if item['type'] == 'source_net'}
component_names = {item['source_component_id']: name for name, item in components.items()}
connections = {}
for trace in circuit:
    if trace['type'] != 'source_trace':
        continue
    for port_id in trace['connected_source_port_ids']:
        port = ports[port_id]
        key = (component_names[port['source_component_id']], int(port['pin_number']))
        connections.setdefault(key, set()).update(nets[net] for net in trace.get('connected_source_net_ids', []))

def expect_pin(component, pin, net):
    assert connections.get((component, pin)) == {net}, (component, pin, connections.get((component, pin)))

for pin in [1, 10, 22, 33, 42, 43, 44, 48, 49]:
    expect_pin('U1', pin, 'V3V3')
for pin in [23, 45, 50]:
    expect_pin('U1', pin, 'V1V1')
for pin in [19, 57]:
    expect_pin('U1', pin, 'GND')
for pin, net in [(2,'STEP'),(3,'DIR'),(4,'ENABLE'),(5,'ARM'),(6,'LIMIT_MIN'),(7,'LIMIT_MAX'),(38,'VBUS_SENSE'),(46,'MCU_DM'),(47,'MCU_DP')]:
    expect_pin('U1', pin, net)
for name, net in [('J2','PUL_MINUS'),('J3','DIR_MINUS'),('J4','ENA_MINUS')]:
    expect_pin(name, 1, 'VDRV'); expect_pin(name, 2, net)
for name, net in [('J5','LIMIT_MIN_WIRE'),('J6','LIMIT_MAX_WIRE')]:
    expect_pin(name, 1, net); expect_pin(name, 2, 'GND')
for pin,net in [(1,'STEP_GATE'),(2,'STEP_RETURN'),(3,'PUL_MINUS')]: expect_pin('Q1',pin,net)
for pin,net in [(1,'ARM_GATE'),(2,'GND'),(3,'STEP_RETURN')]: expect_pin('Q2',pin,net)
for name in ['SW1','SW2']:
    assert connections[(name,1)] == connections[(name,2)]
    expect_pin(name,3,'GND'); expect_pin(name,4,'GND')
for pin,net in [(1,'VDRV'),(2,'BOOST_L2'),(3,'GND'),(4,'BOOST_L1'),(5,'DRIVER_VIN'),(6,'DRIVER_REG_ENABLE'),(7,'DRIVER_VIN'),(8,'DRIVER_VIN'),(9,'GND'),(10,'DRIVER_FB'),(11,'GND')]: expect_pin('U7',pin,net)
for pin,net in [(1,'V5'),(2,'GND'),(3,'DRIVER_POWER'),(4,'DRIVER_FAULT'),(5,'DRIVER_ILIM'),(6,'DRIVER_VIN')]: expect_pin('U8',pin,net)
for pin,net in [(1,'GND'),(2,'SUPERVISOR_RESET'),(3,'V3V3')]: expect_pin('U9',pin,net)
expect_pin('R8',1,'SUPERVISOR_RESET'); expect_pin('R8',2,'RUN')
expect_pin('U1',11,'DRIVER_FAULT'); expect_pin('R32',1,'DRIVER_ILIM'); expect_pin('R32',2,'GND')
expect_pin('U1',8,'DRIVER_POWER'); expect_pin('U1',9,'DRIVER_REG_ENABLE')
rows = list(csv.DictReader(Path('bom.csv').open()))
assert len(rows) == 85 and len({row['Designator'] for row in rows}) == 85
purchased = {name for name, component in components.items() if component.get('supplier_part_numbers')}
assert purchased == {row['Designator'] for row in rows}
for row in rows:
    assert components[row['Designator']]['supplier_part_numbers']['jlcpcb'] == [row['LCSC Part #']]
    assert components[row['Designator']]['manufacturer_part_number'] == row['Manufacturer Part Number']
mounts = [item for item in circuit if item['type']=='pcb_hole' and item.get('hole_diameter')==3.2]
assert len(mounts)==4, mounts
traces=[item for item in circuit if item['type']=='pcb_trace']
if args.stage=='placement':
    assert not traces, 'Placement review must remain unrouted'
else:
    assert traces, 'Routed validation requires actual copper'
    errors=[item for item in circuit if item['type'].endswith('_error')]
    assert not errors, Counter(error["type"] for error in errors)
assert len([item for item in circuit if item['type']=='pcb_keepout'])==4
print('PASS: RP2040 rails and I/O, output gating, connector polarity, switch pairs, 85 exact BOM mappings, four NPTH holes/keepouts; stage='+args.stage)
