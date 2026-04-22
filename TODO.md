# AI Evals TODO

**Maturity Tier:** `Hardened`

## Shipped Now

- Exports 4 governed actions: `ai.evals.run`, `ai.evals.compare`, `ai.evals.capture-baseline`, `ai.evals.promote-release`.
- Owns 4 resource contracts: `ai.eval-datasets`, `ai.eval-runs`, `ai.eval-baselines`, `ai.eval-release-gates`.
- Adds richer admin workspace contributions on top of the base UI surface with replay-linked release-gate visibility.
- Defines a durable data schema contract even though no explicit SQL helper module is exported.
- Exports dedicated integration and migration verification lanes for company-pack release gates, replay-linked evidence, and schema coverage.

## Current Gaps

- Cross-repo workspace bootstrap is still required before the package can run end-to-end verification lanes in isolation.
- The repo validates schema shape and governed release-gate behavior, but it still does not emit first-party SQL migration files from this package.
- Judge provenance and dataset lineage are still intentionally thin while the hardened gate model settles.

## Recommended Next

- Add emitted SQL migration assets and rollback helpers alongside the current schema-verification lane.
- Broaden the integration matrix beyond the current company-pack release gate and replay-linked promotion flow.
- Wire the current evaluation evidence into more release and rollout control points.
- Add richer judge provenance and dataset lineage as the eval corpus grows.
- Promote important downstream reactions into explicit commands, jobs, or workflow steps instead of relying on implicit coupling.

## Later / Optional

- Domain-specific judge packs and cross-environment benchmark promotion.
- More connector breadth, richer evaluation libraries, and domain-specific copilots after the hardened governance contracts settle.
