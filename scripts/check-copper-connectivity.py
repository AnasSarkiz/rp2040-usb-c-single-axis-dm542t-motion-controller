"""Verify every source-net port belongs to one physical copper component.
Native netlist success alone does not establish layer-correct electrical contact.
Requires Shapely 2.1.2; run after the routed build and native shorts check.
"""
import hashlib
import json
from collections import defaultdict
from pathlib import Path
from shapely.geometry import Point, LineString, Polygon
from shapely.ops import unary_union
from shapely.strtree import STRtree
from copper_geometry import geometry

circuit_path = Path('dist/index/circuit.json')
circuit = json.loads(circuit_path.read_text())
layer_shapes = defaultdict(list)
for part in circuit:
    if part['type'] == 'pcb_smtpad':
        layer_shapes[part['layer']].append(geometry(part))
    elif part['type'] in ['pcb_via', 'pcb_plated_hole']:
        for layer in part['layers']:
            layer_shapes[layer].append(geometry(part))
    elif part['type'] == 'pcb_trace':
        for start, end in zip(part['route'], part['route'][1:]):
            if start['route_type'] == end['route_type'] == 'wire' and start['layer'] == end['layer']:
                layer_shapes[start['layer']].append(LineString([(start['x'], start['y']), (end['x'], end['y'])]).buffer(min(start['width'], end['width']) / 2, quad_segs=32))
    elif part['type'] == 'pcb_copper_pour':
        brep = part['brep_shape']
        layer_shapes[part['layer']].append(Polygon([(v['x'], v['y']) for v in brep['outer_ring']['vertices']], [[(v['x'], v['y']) for v in ring['vertices']] for ring in brep['inner_rings']]))

islands = {}
trees = {}
parents = {}
for layer, shapes in layer_shapes.items():
    copper = unary_union(shapes).buffer(1e-7)
    islands[layer] = list(copper.geoms) if hasattr(copper, 'geoms') else [copper]
    trees[layer] = STRtree(islands[layer])
    for index in range(len(islands[layer])):
        parents[layer, index] = (layer, index)

def root(key):
    while parents[key] != key:
        parents[key] = parents[parents[key]]
        key = parents[key]
    return key

def nodes_at(part, layers):
    point = Point(part['x'], part['y'])
    return [(layer, int(index)) for layer in layers for index in trees[layer].query(point, predicate='intersects')]

for part in circuit:
    if part['type'] in ['pcb_via', 'pcb_plated_hole']:
        nodes = nodes_at(part, part['layers'])
        assert nodes, part
        for node in nodes[1:]:
            parents[root(node)] = root(nodes[0])

ports = {part['source_port_id']: part for part in circuit if part['type'] == 'pcb_port'}
net_ports = defaultdict(set)
for part in circuit:
    if part['type'] == 'source_trace':
        for net in part['connected_source_net_ids']:
            net_ports[net].update(part['connected_source_port_ids'])
net_names = {part['source_net_id']: part['name'] for part in circuit if part['type'] == 'source_net'}
report = {}
failures = []
for net, pins in net_ports.items():
    groups = set()
    missing = []
    for pin in pins:
        if pin not in ports:
            missing.append(pin)
            continue
        part = ports[pin]
        nodes = nodes_at(part, part['layers'])
        if not nodes:
            missing.append(pin)
        groups.update(root(node) for node in nodes)
    report[net_names[net]] = {'required_ports': len(pins), 'physical_clusters': len(groups), 'missing_ports': missing}
    if len(groups) != 1 or missing:
        failures.append(net_names[net])

Path('evidence/routed-connectivity.json').write_text(json.dumps({
    'circuit_sha256': hashlib.sha256(circuit_path.read_bytes()).hexdigest(),
    'method': 'Union physical pad, trace and pour copper per layer; join layers only at plated holes/vias. Conservative minimum endpoint width for tapered segments; geometric join tolerance 0.0000001 mm. Shorts require the separate native raster/gerber check.',
    'nets': report,
    'failed_nets': failures,
}, indent=2) + '\n')
print('Physical connectivity:', len(report), 'nets;', sum(entry['required_ports'] for entry in report.values()), 'ports; failed nets:', failures)
assert not failures, 'Disconnected physical copper; see evidence/routed-connectivity.json'
