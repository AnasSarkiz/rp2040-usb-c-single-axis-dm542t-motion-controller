"""Worst-case DC allocation for the specified indoor 0..50 C prototype.
Ripple, cable resistance and MCU draw below are design budgets to measure,
not simulated or measured results. Datasheet links are in DESIGN-REVIEW.md.
"""
import json
from pathlib import Path
resistor_fraction = .001 + 25e-6 * 25
ratio_low = 8.5 * (1-resistor_fraction)/(1+resistor_fraction)
ratio_high = 8.5 * (1+resistor_fraction)/(1-resistor_fraction)
# TPS63030 forced PWM FB limits, plus line and load regulation budgets.
rail_low = .495*(1+ratio_low)-.01*4.75
rail_high = .505*(1+ratio_high)+.01*4.75
ripple_peak_v = .025
cable_loop_ohms = 1
sink_drop_v = .016 * 2 * .048
connector_low = rail_low-ripple_peak_v-sink_drop_v
at_driver_low = connector_low-.016*cable_loop_ohms
at_driver_high = rail_high+ripple_peak_v
assert at_driver_low > 4.5 and at_driver_high < 5.0
# Capacitance including all downstream non-switched capacitance is conservative:
# C1/C2/C4/C5/C26 = 5 uF; C3 = 2.2 uF; C6..14=.9 uF;
# C17..19=.3 uF, C25=.1 uF. Switched C21..24 do not load attachment.
attach_capacitance_uf = (5+2.2+.9+.3+.1)*1.1
assert attach_capacitance_uf < 10
# Reserve 75 mA for MCU + flash, 5 mA other. Regulator efficiency budget 70%.
driver_input_ma = (48+.5)*4.75/(4.1*.70)
running_ma = 80+driver_input_ma
assert running_ma < 200
assert 80 < 100
# TI SLVS841F section 9.5.1, kOhms; include 1% resistor tolerance.
limit_min_ma=25230/(101**1.016)
limit_max_ma=22980/(99**.94)
assert limit_min_ma > driver_input_ma
assert limit_max_ma+80 < 500
result = {
 'driver_branch_current_limit_ma':[limit_min_ma,limit_max_ma],
 'configured_total_limit_budget_ma':limit_max_ma+80,
 'status':'calculated_design_budgets_not_measurements',
 'temperature_c':[0,50],
 'driver_rail_dc_v':[rail_low,rail_high],
 'allocated_ripple_peak_v':ripple_peak_v,
 'maximum_signal_cable_loop_ohms':cable_loop_ohms,
 'driver_loaded_voltage_budget_v':[at_driver_low,at_driver_high],
 'attachment_capacitance_upper_uf':attach_capacitance_uf,
 'unconfigured_current_budget_ma':80,
 'running_current_budget_ma':running_ma,
 'usb_configuration_request_ma':500,
 'suspend_limit_ma':2.5,
 'suspend_requires_measurement':True,
 'startup_peak_requires_measurement':True,
}
Path('evidence/power-budget.json').write_text(json.dumps(result,indent=2)+'\n')
print(json.dumps(result,indent=2))
