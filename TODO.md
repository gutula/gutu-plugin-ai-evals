# AI Evals TODO

**Maturity Tier:** `Hardened`

## Shipped Now

- Exports 6 governed actions: `ai.evals.run`, `ai.evals.compare`, `ai.evals.capture-baseline`, `ai.evals.promote-release`, `ai.evals.rollouts.configure`, `ai.evals.online-evidence.record`.
- Owns 6 resource contracts: `ai.eval-datasets`, `ai.eval-runs`, `ai.eval-baselines`, `ai.eval-release-gates`, `ai.eval-rollout-rings`, `ai.eval-online-evidence`.
- Adds richer admin workspace contributions on top of the base UI surface.
- Defines a durable data schema contract even though no explicit SQL helper module is exported.

## Current Gaps

- No standalone plugin-owned event, job, or workflow catalog is exported yet; compose it through actions, resources, and the surrounding Gutu runtime.
- The repo does not yet export a domain parity catalog with owned entities, reports, settings surfaces, and exception queues.

## Recommended Next

- Wire the current evaluation evidence into more release and rollout control points.
- Add richer judge provenance and dataset lineage as the eval corpus grows.
- Add deeper provider, persistence, or evaluation integrations only where the shipped control-plane contracts already prove stable.
- Expand operator diagnostics and release gating where the current lifecycle already exposes strong evidence paths.
- Promote important downstream reactions into explicit commands, jobs, or workflow steps instead of relying on implicit coupling.

## Later / Optional

- Domain-specific judge packs and cross-environment benchmark promotion.
- More connector breadth, richer evaluation libraries, and domain-specific copilots after the baseline contracts settle.
