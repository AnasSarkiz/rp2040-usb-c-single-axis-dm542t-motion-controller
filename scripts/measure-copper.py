"""Independent dimensions and ordinary drill-to-pad audit of emitted copper.
Complements (does not replace) native connectivity/shorts/clearance checks.
No same-net exception is made for drill-to-SMD/test-pad clearance.
"""
from pathlib import Path
import hashlib
import json
import math
from collections import Counter, defaultdict
from shapely.geometry import Point, Polygon, LineString, box
from shapely.ops import unary_union
from copper_geometry import geometry

path=Path('dist/index/circuit.json')
circuit=json.loads(path.read_text())


pads=[(p,geometry(p)) for p in circuit if p['type']=='pcb_smtpad']
drills=[(p,geometry(p,True)) for p in circuit if p['type'] in ['pcb_hole','pcb_plated_hole','pcb_via']]
violations=[]
minimum_drill_to_pad=None
for drill,dshape in drills:
    for pad,pshape in pads:
        distance=dshape.distance(pshape)
        result={'drill':drill.get(drill['type']+'_id'),'pad':pad['pcb_smtpad_id'],'clearance_mm':distance}
        if minimum_drill_to_pad is None or distance<minimum_drill_to_pad['clearance_mm']: minimum_drill_to_pad=result
        if distance<.15-1e-6: violations.append(result)
traces=[p for p in circuit if p['type']=='pcb_trace']
assert traces, 'No routed traces; this is not a routed measurement'
widths=[]
lengths=defaultdict(float)
for trace in traces:
    route=trace['route']
    for point in route:
        if point['route_type']=='wire': widths.append(point['width'])
    for a,b in zip(route,route[1:]):
        if a['route_type']=='wire' and b['route_type']=='wire' and a['layer']==b['layer']:
            lengths[trace.get('source_trace_id',trace['pcb_trace_id'])]+=math.hypot(a['x']-b['x'],a['y']-b['y'])
vias=[p for p in circuit if p['type']=='pcb_via']
# Report by logical net and inspect actual pour/hardware/edge geometry.
source_traces={e['source_trace_id']:e for e in circuit if e['type']=='source_trace'}
nets={e['source_net_id']:e['name'] for e in circuit if e['type']=='source_net'}
net_by_key={e.get('subcircuit_connectivity_map_key'):e['name'] for e in circuit if e['type']=='source_net'}
net_dimensions={}
copper=[g for _,g in pads]
for trace in traces:
    source=source_traces.get(trace.get('source_trace_id'),{})
    net=net_by_key.get(source.get('subcircuit_connectivity_map_key'),trace['pcb_trace_id'])
    report=net_dimensions.setdefault(net,{'minimum_width_mm':100,'maximum_width_mm':0,'total_track_length_mm':0})
    for a,b in zip(trace['route'],trace['route'][1:]):
        if a['route_type']=='wire':
            report['minimum_width_mm']=min(report['minimum_width_mm'],a['width'])
            report['maximum_width_mm']=max(report['maximum_width_mm'],a['width'])
        if a['route_type']=='wire' and b['route_type']=='wire' and a['layer']==b['layer']:
            line=LineString([(a['x'],a['y']),(b['x'],b['y'])])
            report['total_track_length_mm']+=line.length
            copper.append(line.buffer(max(a['width'],b['width'])/2,quad_segs=64))
for via in vias: copper.append(geometry(via))
for plated in circuit:
    if plated['type']=='pcb_plated_hole': copper.append(geometry(plated))
for pour in circuit:
    if pour['type']=='pcb_copper_pour':
        assert pour['shape']=='brep', pour
        brep=pour['brep_shape']
        copper.append(Polygon([(p['x'],p['y']) for p in brep['outer_ring']['vertices']],
            [[(p['x'],p['y']) for p in ring['vertices']] for ring in brep['inner_rings']]))
all_copper=unary_union(copper)
board=next(p for p in circuit if p['type']=='pcb_board')
cx,cy=board['center']['x'],board['center']['y']
outline=box(cx-board['width']/2,cy-board['height']/2,cx+board['width']/2,cy+board['height']/2)
edge_clearance=outline.boundary.distance(all_copper)
mount_clearances=[Point(h['x'],h['y']).distance(all_copper) for h in circuit if h['type']=='pcb_hole' and h['hole_diameter']==3.2]
# IPC-2221 external-trace empirical estimate: k=.048, area in mil^2.
# Use 30 um copper as a conservative 1 oz allocation; this is not measurement.
area_mil2=(min(widths)/.0254)*(.030/.0254)
capacity_10c_a=.048*(10**.44)*(area_mil2**.725)
result={'circuit_sha256':hashlib.sha256(path.read_bytes()).hexdigest(),
 'measurement_scope':'trace dimensions, via dimensions, all ordinary drill-to-SMD/test-pad clearances; native DRC handles remaining rules',
 'copper_edge_clearance_mm':edge_clearance,
 'copper_distance_from_mount_centers_mm':mount_clearances,
 'narrowest_trace_estimated_capacity_at_10c_rise_a':capacity_10c_a,
 'net_dimensions':net_dimensions,
 'trace_count':len(traces),'wire_widths_mm':dict(Counter(round(w,6) for w in widths)),
 'minimum_trace_width_mm':min(widths),
 'via_count':len(vias),'via_dimensions_mm':sorted(set((v['hole_diameter'],v['outer_diameter']) for v in vias)),
 'minimum_drill_to_smd_pad':minimum_drill_to_pad,
 'drill_to_pad_violations':violations,
 'trace_lengths_by_source_trace_id_mm':dict(lengths)}
Path('evidence/copper-measurements.json').write_text(json.dumps(result,indent=2)+'\n')
print(json.dumps({k:v for k,v in result.items() if k not in ['trace_lengths_by_source_trace_id_mm','drill_to_pad_violations','net_dimensions']},indent=2))
print('Drill-to-pad violations:',len(violations))
assert min(widths)>=.15-1e-6
assert all(v['hole_diameter']>=.3-1e-6 and v['outer_diameter']>=.6-1e-6 for v in vias)
assert not violations, 'Ordinary drill-to-pad clearance violations; see evidence/copper-measurements.json'

assert outline.covers(all_copper), 'Copper outside board'
assert edge_clearance >= .5-1e-5
assert min(mount_clearances)>=4-1e-5, 'Copper intrudes on the 4 mm mounting hardware envelope'
