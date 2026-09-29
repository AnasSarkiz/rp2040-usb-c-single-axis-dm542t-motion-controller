"""Exact circular via clearances, including same-net drill separation."""
from itertools import combinations
from math import hypot


def audit_via_spacing(vias, rules):
    pairs = []
    violations = []
    for first, second in combinations(vias, 2):
        # Non-overlapping layer spans cannot collide; this board uses through vias.
        if not set(first['layers']).intersection(second['layers']):
            continue
        center_distance = hypot(first['x'] - second['x'], first['y'] - second['y'])
        drill_gap = center_distance - (first['hole_diameter'] + second['hole_diameter']) / 2
        copper_gap = center_distance - (first['outer_diameter'] + second['outer_diameter']) / 2
        first_net = first.get('subcircuit_connectivity_map_key')
        second_net = second.get('subcircuit_connectivity_map_key')
        same_net = bool(first_net) and first_net == second_net
        pair = {
            'first_via': first['pcb_via_id'], 'second_via': second['pcb_via_id'],
            'first_xy_mm': [first['x'], first['y']], 'second_xy_mm': [second['x'], second['y']],
            'first_net': first_net, 'second_net': second_net, 'same_net': same_net,
            'drill_gap_mm': drill_gap, 'copper_gap_mm': copper_gap,
        }
        pairs.append(pair)
        failed_rules = []
        if drill_gap < rules['drill_gap_mm'] - 1e-6:
            failed_rules.append('drill_to_drill')
        if not same_net and copper_gap < rules['copper_gap_mm'] - 1e-6:
            failed_rules.append('different_net_copper_to_copper')
        if failed_rules:
            violations.append({**pair, 'failed_rules': failed_rules})
    different_net_pairs = [pair for pair in pairs if not pair['same_net']]
    return {
        'rules': rules, 'pair_count': len(pairs),
        'minimum_drill_pair': min(pairs, key=lambda pair: pair['drill_gap_mm']) if pairs else None,
        'minimum_different_net_copper_pair': min(different_net_pairs, key=lambda pair: pair['copper_gap_mm']) if different_net_pairs else None,
        'violations': violations,
    }
