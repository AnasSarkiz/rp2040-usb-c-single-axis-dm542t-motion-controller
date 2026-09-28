"""Regression for rotated SOIC pads encountered by the physical copper audit."""
from pathlib import Path
import math
import sys
import unittest
sys.path.insert(0, str(Path(__file__).resolve().parents[1] / 'scripts'))
from copper_geometry import geometry

class RotatedPillTest(unittest.TestCase):
    def test_rotated_pad_has_expected_bounds_and_copper_area(self):
        pad = geometry({'type': 'pcb_smtpad', 'shape': 'rotated_pill',
            'x': 3, 'y': 4, 'width': .6, 'height': 2.2, 'ccw_rotation': 90})
        for measured, expected in zip(pad.bounds, (1.9, 3.7, 4.1, 4.3)):
            self.assertAlmostEqual(measured, expected, places=8)
        self.assertAlmostEqual(pad.area, .6 * 1.6 + math.pi * .3 ** 2, places=4)
        self.assertAlmostEqual(pad.centroid.x, 3, places=8)
        self.assertAlmostEqual(pad.centroid.y, 4, places=8)

if __name__ == '__main__':
    unittest.main()
