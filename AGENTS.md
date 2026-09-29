# Board-specific version publishing

Continue only in this board directory. Follow the workspace validation gates.

The user explicitly requested both a tscircuit project and a GitHub repository and authorized pushing every meaningful saved version. After each version, follow VERSIONING.md: update source version, record validation status honestly, commit and tag, push GitHub, and publish the exact tag to tscircuit. Do not ask again for routine version pushes. Keep incomplete designs labeled prototypes and do not claim fabrication readiness while checks fail.

Never upload the whole development directory to tscircuit: the installed CLI does not honor .gitignore. Publish a reviewed Git archive from a task-local .tscircuit/publish directory. Keep private task input, credentials, caches, downloaded toolchains and corrupt output out of both repositories.

For routing failures, the user requires an actual component placement adjustment before each new routing attempt. Inspect error locations and move/rotate the relevant parts; rerun unrouted placement checks and inspect the placement before routing again. Continue until routing checks are clear or a demonstrated tooling blocker prevents progress. Do not relax manufacturing constraints or hide failures.

The user requests `tsci push index.circuit.tsx --include-dist` for publication. Include freshly generated, reviewed output matching the tagged source; exclude stale placement previews and historical debug output. Preserve failures explicitly when publishing a rejected prototype. Follow VERSIONING.md for source/output hashes and Git-archive publication.
