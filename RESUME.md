# Resume A0 / 0.1.0-prototype.3

Continue routing placement iteration. User requires component moves after failures and pushes of every saved version to both services. Read AGENTS.md and VERSIONING.md.

Two-layer 90x60x1 mm board, 85 parts. MCU/crystal/caps rotated 90 degrees; U5/U9/R8/C25 relocated in .2, testpoints relocated in .3. Stage-3 placement passes. .3 native route build and shorts pass (zero native errors), dimensional audit passes, but new physical-connectivity audit fails VBUS_SENSE: bottom-layer route ends at top-side U1 ADC pad without a via. 56 other nets are physically connected. Do not declare routing clear until the new audit passes. Move R24/R25/C19 toward the ADC pin and retry with unchanged DRC rules.

Raw evidence, snapshots, toolchains and private inputs remain local. Source publishing is explicitly authorized; order/physical testing has not happened.
