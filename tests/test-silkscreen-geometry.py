"""Regression tests for the restricted native legend Gerber reader."""
import importlib.util
from pathlib import Path
import tempfile
import unittest

spec = importlib.util.spec_from_file_location('legend_audit', Path(__file__).resolve().parents[1] / 'scripts/check-silkscreen.py')
audit = importlib.util.module_from_spec(spec)
spec.loader.exec_module(audit)


class LegendGeometryTest(unittest.TestCase):
    def test_draw_and_flash_use_physical_aperture_radius(self):
        with tempfile.TemporaryDirectory() as directory:
            path = Path(directory) / 'legend.gbr'
            path.write_text('%FSLAX46Y46*%\n%MOMM*%\n%ADD10C,0.150000*%\nG04 aperture END LIST*\nD10*\nX0000000Y0000000D02*\nX1000000Y0000000D01*\nD10*\nX3000000Y0000000D03*\nM02*\n')
            groups, widths = audit.read_legend(path)
            self.assertEqual(widths, [.15, .15])
            self.assertEqual(groups[0][0].bounds, (-.075, -.075, 1.075, .075))
            self.assertAlmostEqual(groups[1][0].bounds[0], 2.925)
            self.assertAlmostEqual(groups[0][0].distance(groups[1][0]), 1.85)

    def test_unsupported_polarity_is_rejected(self):
        with tempfile.TemporaryDirectory() as directory:
            path = Path(directory) / 'legend.gbr'
            path.write_text('%FSLAX46Y46*%\n%MOMM*%\nG04 aperture END LIST*\n%LPC*%\n')
            with self.assertRaisesRegex(AssertionError, 'Unsupported legend command'):
                audit.read_legend(path)


if __name__ == '__main__':
    unittest.main()
