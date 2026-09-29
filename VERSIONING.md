# Version history and publishing

The user authorized creating both repositories and pushing every meaningful saved version on 2026-09-29. Use the configured AnasSarkiz accounts. Hardware revision A0 is separate from the source package version.

## First source release

`0.1.0-prototype.1` is the first complete source snapshot published to both services. Git tag: `v0.1.0-prototype.1`. Routing is unresolved and no hardware has been built or tested. This is not an approved fabrication package.

Earlier A0 draft/placement manifests and rejected routing candidates remain historical evidence. Full original source snapshots for those states were not saved, so they cannot honestly be recreated as past Git commits or tscircuit versions. Their original hashes and validation limitations remain in the local investigation archive. Only the concise validation record is exported publicly.

## Every subsequent version

1. Make the board changes inside this task directory. Increment `package.json` version and `project.json` source_version; retain the exact product title. Use increasing `0.1.0-prototype.N` versions until an appropriate milestone changes the base version.
2. Revalidate affected stages and record results in VALIDATION.md. Unresolved failures stay visible. Save evidence without overwriting historical records.
3. Review the diff and included files for credentials, private inputs, generated junk and third-party redistribution. Commit the complete source and record an annotated Git tag `v<package-version>`. Never force-update a published tag.
4. Before committing, generate a fresh routed `dist/index/` from the release sources; archive older output outside dist and inspect the result. Include only reviewed native circuit JSON and rendered PCB/schematic files, plus a build-status record and source/output hashes. For a rejected prototype, disclose all errors in dist/README.md and validation records; including dist does not imply a successful build or fabrication approval. Stage the reviewed dist files explicitly because dist is normally ignored. Never reuse a previous version’s dist after source changes.
5. Push the commit and tag to GitHub. Export that exact tag with `git archive` to a fresh task-local `.tscircuit/publish/<version>/` directory.
6. From the export, use the installed canonical `tsci push index.circuit.tsx --include-dist` (individual file upload; compressed upload exceeded the registry request limit for prototype.12). Do not upload the working directory: this CLI version does not honor .gitignore and would include local toolchains. Git archive contains only reviewed tracked files. Keep version unchanged during upload; if the remote version exists, inspect it before assigning another version.
7. Verify both remotes contain the version and matching authored source. Record the publication receipt locally. Registry processing or successful upload does not mean board DRC passed.

Dependencies and tools are reconstructed using the locked package manifest and firmware guide. Public Git history and registry version history preserve each published snapshot. Raw evidence/logs and reference downloads remain local; public-validation.json carries the check outcomes and artifact hashes. Do not force-push, rewrite history or publish credentials. Ordering remains unauthorized.
