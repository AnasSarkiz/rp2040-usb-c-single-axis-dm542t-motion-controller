# Resume A0 / 0.1.0-prototype.15

Read AGENTS.md, VERSIONING.md and VALIDATION.md. User requires component moves after routing errors and pushes of every saved version to both services.

Four-layer candidate, expanded via-spacing regression, and source-built core fix for internal-link net alias classification. Moved TP9 and C4/C8/C12/C13 before routing. Native routing and independent geometry still reject this candidate; source release only, not fabrication ready.

Latest routing: 57 native PCB errors; 10 shorts findings; 4 drill-to-pad violations; disconnected nets: [].

Four-layer 90x60x1 mm candidate, 85 parts. Follow native DRC, shorts, dimensional AND physical-connectivity audits; native success alone missed an open ADC net in prototype.3. No DRC changes or suppression. Source publishing is authorized; no prototype order or physical testing exists.

Expanded audit: four via-spacing violations, minimum different-net copper gap 0.0867456 mm and drill gap 0.131654 mm. Ground plane still cut by non-GND traces despite native unbroken flag. Core a0.2 fixes the independently reproduced ground-obstacle assignability bug, but not the remaining multilayer router failures. 23 core tests/typecheck/build pass. Current four-layer route is rejected. Stage 1 manufacturer stackup, stage 4 routing, stage 5 A4/snapshots, stage 6 fabrication remain incomplete. Do not order any old export. Read latest VALIDATION.md before continuing.

Prototype.15 changes build configuration only: native build.workerTimeoutMs=1800000 (30 minutes). Config validated against the installed CLI schema and worker call path. No new routing attempt or component movement; prototype.14 geometry evidence remains the latest. Hosted build completion remains unverified.
