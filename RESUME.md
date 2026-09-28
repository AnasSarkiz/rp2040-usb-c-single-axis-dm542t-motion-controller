# Resume A0 / 0.1.0-prototype.6

Read AGENTS.md, VERSIONING.md and VALIDATION.md. User requires component moves after routing errors and pushes of every saved version to both services.

Moved C13, C19 and the crystal network and introduced an explicit ADC trace. Review found pcbPath waypoint coordinates are relative to the rotated source component; the initial board-coordinate waypoint was wrong, so this routing is rejected and corrected in the next revision.

Latest routing: 290 native PCB errors; 16 shorts findings; 0 drill-to-pad violations; disconnected nets: ['VDRV', 'BOOST_L2', 'GND', 'BOOST_L1', 'DRIVER_VIN', 'DRIVER_REG_ENABLE', 'DRIVER_FB', 'V5', 'DRIVER_POWER', 'DRIVER_FAULT', 'DRIVER_ILIM', 'SUPERVISOR_RESET', 'V3V3', 'V1V1', 'XIN', 'XOUT', 'SWCLK', 'SWDIO', 'RUN', 'MCU_DM', 'MCU_DP', 'QSPI_D3', 'QSPI_CLK', 'QSPI_D0', 'QSPI_D2', 'QSPI_D1', 'QSPI_CS', 'STEP', 'DIR', 'ENABLE', 'ARM', 'LIMIT_MIN', 'LIMIT_MAX', 'STATUS', 'VBUS_SENSE', 'USB_DP', 'USB_DM', 'VBUS', 'FUSED_VBUS', 'LIMIT_MIN_WIRE', 'LIMIT_MAX_WIRE', 'CC1', 'CC2', 'XTAL_OUT', 'BOOT_SW', 'LED_PWR', 'LED_STATUS', 'STEP_GATE', 'PUL_MINUS', 'STEP_RETURN', 'ARM_GATE', 'DIR_GATE', 'DIR_MINUS', 'DISABLE_GATE', 'ENA_MINUS', 'ENABLE_GATE', 'DRIVER_FB_SERIES'].

Two-layer 90x60x1 mm board, 85 parts. Follow native DRC, shorts, dimensional AND physical-connectivity audits; native success alone missed an open ADC net in prototype.3. No DRC changes or suppression. Source publishing is authorized; no prototype order or physical testing exists.
