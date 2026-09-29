# Resume A0 / 0.1.0-prototype.17

Read AGENTS.md, VERSIONING.md and VALIDATION.md. User requires component moves after routing errors and pushes of every saved version to both services.

Four-layer candidate, expanded via-spacing regression, and source-built core fix for internal-link net alias classification. Moved TP9 and C4/C8/C12/C13 before routing. Native routing and independent geometry still reject this candidate; source release only, not fabrication ready.

Latest routing: 57 native PCB errors; 10 shorts findings; 4 drill-to-pad violations; disconnected nets: [].

Four-layer 90x60x1 mm candidate, 85 parts. Follow native DRC, shorts, dimensional AND physical-connectivity audits; native success alone missed an open ADC net in prototype.3. No DRC changes or suppression. Source publishing is authorized; no prototype order or physical testing exists.

Expanded audit: four via-spacing violations, minimum different-net copper gap 0.0867456 mm and drill gap 0.131654 mm. Ground plane still cut by non-GND traces despite native unbroken flag. Core a0.2 fixes the independently reproduced ground-obstacle assignability bug, but not the remaining multilayer router failures. 23 core tests/typecheck/build pass. Current four-layer route is rejected. Stage 1 manufacturer stackup, stage 4 routing, stage 5 A4/snapshots, stage 6 fabrication remain incomplete. Do not order any old export. Read latest VALIDATION.md before continuing.

Prototype.15 changes build configuration only: native build.workerTimeoutMs=1800000 (30 minutes). Config validated against the installed CLI schema and worker call path. No new routing attempt or component movement; prototype.14 geometry evidence remains the latest. Hosted build completion remains unverified.

Prototype.16 adds the user-requested evaluation/FCC notice on bottom silkscreen. Review is limited to an unrouted build and bottom placement preview; no routing rerun, no component move, no fabrication package. Existing prototype.14 routing failures remain unresolved. 30-minute timeout retained.

Prototype.17 raises build.workerTimeoutMs from 1800000 to 3600000 (60 minutes), following the reported 30-minute hosted timeout. PCB sources, placement, routing and dependencies are unchanged. Hosted completion and any separate platform-wide deadline remain unverified.

Registry readback confirms prototype.16 failed with user_code_job_timeout after 30 minutes. The overall hosted deadline may still block a 60-minute worker; no supported project field for changing that platform deadline was found. Do not claim timeout resolved.
