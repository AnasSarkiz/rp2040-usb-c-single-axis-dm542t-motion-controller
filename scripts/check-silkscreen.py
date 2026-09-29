"""Measure actual native Gerber legend strokes against exposed board pads.

Supports the exporter’s absolute 4.6 mm, positive-polarity, circular-aperture
line/flash legend output. Rejects other drawing commands rather than guessing.
Board coordinates: mm, X right, Y up. No edits to manufacturing output.
"""
import hashlib
import json
import re
from pathlib import Path
from shapely.geometry import LineString, Point, box
from shapely.ops import unary_union
from copper_geometry import geometry


def read_legend(path):
    gerber = path.read_text()
    assert '%FSLAX46Y46*%' in gerber and '%MOMM*%' in gerber
    apertures = {int(number): float(diameter) for number, diameter in re.findall(r'%ADD(\d+)C,([\d.]+)\*%', gerber)}
    commands = gerber.split('G04 aperture END LIST*', 1)[1].splitlines()
    groups, strokes, widths = [], [], []
    position = None
    diameter = None
    for command in commands:
        command = command.strip()
        if not command or command.startswith('G04') or command in ['M02*', '%LPD*%', '%TD*%']:
            continue
        aperture = re.fullmatch(r'D(\d+)\*', command)
        if aperture:
            if strokes:
                groups.append((unary_union(strokes), diameter))
                strokes = []
            diameter = apertures[int(aperture[1])]
            widths.append(diameter)
            continue
        drawing = re.fullmatch(r'X(-?\d+)Y(-?\d+)D0([123])\*', command)
        assert drawing, f'Unsupported legend command: {command}'
        assert diameter is not None
        endpoint = (int(drawing[1]) / 1e6, int(drawing[2]) / 1e6)
        if drawing[3] == '1':
            assert position is not None
            strokes.append(LineString([position, endpoint]).buffer(diameter / 2, quad_segs=32))
        elif drawing[3] == '3':
            strokes.append(Point(endpoint).buffer(diameter / 2, quad_segs=32))
        position = endpoint
    if strokes:
        groups.append((unary_union(strokes), diameter))
    return groups, widths


if __name__ == '__main__':
    project = json.loads(Path('project.json').read_text())
    folder = Path('fabrication') / (project['hardware_revision'] + '-' + project['source_version'].removeprefix('0.1.0-'))
    assert folder.exists(), f'No fabrication export exists for current source: {folder}'
    circuit_path = Path('dist/index/circuit.json')
    circuit = json.loads(circuit_path.read_text())
    pads = [pad for pad in circuit if pad['type'] in ['pcb_smtpad', 'pcb_plated_hole'] and not pad.get('is_covered_with_solder_mask')]
    report = {'circuit_sha256': hashlib.sha256(circuit_path.read_bytes()).hexdigest(), 'layers': {}}
    for layer, filename in [('top', 'F_SilkScreen'), ('bottom', 'B_SilkScreen')]:
        groups, widths = read_legend(folder / 'exported' / f'{filename}.gbr')
        violations = []
        for index, (ink, diameter) in enumerate(groups):
            for pad in pads:
                if layer not in pad.get('layers', [pad.get('layer')]):
                    continue
                exposed = geometry(pad).buffer(pad.get('soldermask_margin', 0))
                clearance = ink.distance(exposed)
                if clearance < .15 - 1e-6:
                    violations.append({'ink_group': index, 'ink_bounds_mm': list(ink.bounds), 'pad': pad.get(pad['type'] + '_id'), 'clearance_mm': clearance})
            if not box(-44.8, -29.8, 44.8, 29.8).covers(ink):
                violations.append({'ink_group': index, 'ink_bounds_mm': list(ink.bounds), 'issue': 'ink_outside_outline_margin'})
        for index, (ink, diameter) in enumerate(groups):
            if abs(diameter - .162) >= 1e-6:
                continue
            for other_index, (other_ink, other_diameter) in enumerate(groups[index + 1:], index + 1):
                if abs(other_diameter - .162) < 1e-6 and ink.distance(other_ink) < .15 - 1e-6:
                    violations.append({'ink_group': index, 'other_ink_group': other_index, 'issue': 'printed_text_too_close'})
        text_heights = [ink.bounds[3] - ink.bounds[1] for ink, diameter in groups if abs(diameter - .162) < 1e-6]
        expected_text_count = sum(element['type'] == 'pcb_silkscreen_text' and element.get('layer') == layer for element in circuit)
        assert len(text_heights) == expected_text_count, 'Legend text count or font sizing changed; review required'
        report['layers'][layer] = {'minimum_stroke_mm': min(widths) if widths else None, 'minimum_text_height_mm': min(text_heights) if text_heights else None, 'violations': violations}
    (folder / 'silkscreen-review.json').write_text(json.dumps(report, indent=2) + '\n')
    for layer, result in report['layers'].items():
        print(layer, 'min stroke', result['minimum_stroke_mm'], 'violations', len(result['violations']))
    assert all(result['minimum_stroke_mm'] is None or result['minimum_stroke_mm'] >= .15 - 1e-6 for result in report['layers'].values())
    assert all(not result['violations'] for result in report['layers'].values()), 'See silkscreen-review.json'

    assert all(result['minimum_text_height_mm'] is None or result['minimum_text_height_mm'] >= 1 for result in report['layers'].values())
