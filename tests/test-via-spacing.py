"""Regression: electrically unshorted vias can still violate copper clearance."""
from pathlib import Path
import sys
import unittest
sys.path.insert(0, str(Path(__file__).resolve().parents[1] / 'scripts'))
from via_spacing import audit_via_spacing


def via(overrides):
    return {'pcb_via_id': 'a', 'x': 0, 'y': 0, 'hole_diameter': .3,
            'outer_diameter': .6, 'layers': ['top', 'bottom'],
            'subcircuit_connectivity_map_key': 'net1', **overrides}


class ViaSpacingTest(unittest.TestCase):
    def test_prototype_13_run_swclk_violation(self):
        first = via({'x': -.2510218390529332, 'y': .06694559568074468})
        second = via({'pcb_via_id': 'b', 'x': .35903843286990855,
                      'y': .41020419298229555, 'subcircuit_connectivity_map_key': 'net2'})
        result = audit_via_spacing([first, second], {'drill_gap_mm': .25, 'copper_gap_mm': .15})
        self.assertEqual(result['violations'][0]['failed_rules'], ['different_net_copper_to_copper'])
        self.assertAlmostEqual(result['minimum_different_net_copper_pair']['copper_gap_mm'], .1)

    def test_same_net_does_not_exempt_drill_spacing(self):
        result = audit_via_spacing([via({}), via({'x': .50})], {'drill_gap_mm': .25, 'copper_gap_mm': .15})
        self.assertEqual(result['violations'][0]['failed_rules'], ['drill_to_drill'])

    def test_boundary_and_unequal_diameters(self):
        result = audit_via_spacing([via({}), via({'x': .85, 'outer_diameter': .8,
            'subcircuit_connectivity_map_key': 'net2'})], {'drill_gap_mm': .25, 'copper_gap_mm': .15})
        self.assertEqual(result['violations'], [])
        self.assertAlmostEqual(result['minimum_different_net_copper_pair']['copper_gap_mm'], .15)

    def test_missing_net_is_not_a_same_net_exemption(self):
        result = audit_via_spacing([via({'subcircuit_connectivity_map_key': None}),
            via({'x': .7, 'subcircuit_connectivity_map_key': None})], {'drill_gap_mm': .25, 'copper_gap_mm': .15})
        self.assertEqual(len(result['violations']), 1)

    def test_disjoint_layers(self):
        result = audit_via_spacing([via({'layers': ['top']}), via({'layers': ['bottom']})],
            {'drill_gap_mm': .25, 'copper_gap_mm': .15})
        self.assertEqual(result['pair_count'], 0)


if __name__ == '__main__':
    unittest.main()
