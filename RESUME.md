# Resume A0 / source 0.1.0-prototype.1

Read VALIDATION.md, DESIGN-REVIEW.md and VERSIONING.md. Disk space recovered on 2026-09-29. User now explicitly requires a GitHub repository, tscircuit project and a push to both for every meaningful saved version. Projects are created under AnasSarkiz; use the package repository/homepage URLs. GitHub app linkage at tscircuit was denied for this repository; direct CLI publishing remains the workflow.

Current sources are two-layer, 85 components, native routing enabled, 4.03 mm circular keepouts, bottom GND pour. No four-layer trial has run. Requirements, schematic/BOM and unrouted placement passed; routed geometry remains blocked. Fresh valid circuit JSON and preview regenerated for prototype.1: 199 native errors, 26 shorts findings, 16 independent drill/pad violations. Source/firmware tests pass. Preserve rejected candidates and do not issue Gerbers or fabrication-ready claims.

See routing investigation in VALIDATION.md. Candidate 1 had only two native via/drill errors plus two independently found U5 same-net drill-to-pad overlaps; later explicit-route and phase experiments worsened results. Correct phase assignment uses net routingPhaseIndex, not net-name selectors in phase connections. No tool internals or DRC thresholds were bypassed.

Evaluate four layers if necessary (brief permits it), review exact manufacturer's stackup and all inner copper, and revalidate. Do not upload local toolchains or private inputs. Each subsequent source version must be committed, tagged and pushed to both services per VERSIONING.md. No physical hardware or prototype order exists.
