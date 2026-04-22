# AI Evals

<p align="center">
  <img src="./docs/assets/gutu-mascot.png" alt="Gutu mascot" width="220" />
</p>

Eval datasets, judges, regression baselines, and release-grade AI review.

![Maturity: Hardened](https://img.shields.io/badge/Maturity-Hardened-2563eb) ![Verification: Build+Typecheck+Lint+Test+Contracts](https://img.shields.io/badge/Verification-Build%2BTypecheck%2BLint%2BTest%2BContracts-6b7280) ![DB: postgres+sqlite](https://img.shields.io/badge/DB-postgres%2Bsqlite-2563eb) ![Integration Model: Actions+Resources+UI](https://img.shields.io/badge/Integration%20Model-Actions%2BResources%2BUI-2563eb)

## Part Of The Gutu Stack

| Aspect | Value |
| --- | --- |
| Repo kind | First-party plugin |
| Domain group | AI Systems |
| Primary focus | eval datasets, release gating, baseline regression review |
| Best when | You need a governed domain boundary with explicit contracts and independent release cadence. |
| Composes through | Actions+Resources+Jobs+UI |

- Gutu keeps plugins as independent repos with manifest-governed boundaries, compatibility channels, and verification lanes instead of hiding everything behind one giant mutable codebase.
- This plugin is meant to compose through explicit actions, resources, jobs, workflows, and runtime envelopes, not through undocumented hook chains.

## What It Does Now

Owns evaluation datasets, judges, regression baselines, and the release-review evidence used to keep AI changes honest.

- Exports 4 governed actions: `ai.evals.run`, `ai.evals.compare`, `ai.evals.capture-baseline`, `ai.evals.promote-release`.
- Owns 4 resource contracts: `ai.eval-datasets`, `ai.eval-runs`, `ai.eval-baselines`, `ai.eval-release-gates`.
- Adds richer admin workspace contributions with replay-linked release-gate visibility.
- Defines a durable data schema contract even though no explicit SQL helper module is exported.

## Maturity

**Maturity Tier:** `Hardened`

This tier is justified because unit, contract, integration, and migration coverage now exist, and the plugin exports governed baseline lineage and release-gate promotion contracts.

## Verified Capability Summary

- Group: **AI Systems**
- Verification surface: **Build+Typecheck+Lint+Test+Contracts+Integration+Migrations**
- Tests discovered: **5** total files across unit, contract, integration, and migration lanes
- Integration model: **Actions+Resources+UI**
- Database support: **postgres + sqlite**

## Dependency And Compatibility Summary

| Field | Value |
| --- | --- |
| Package | `@plugins/ai-evals` |
| Manifest ID | `ai-evals` |
| Repo | [gutu-plugin-ai-evals](https://github.com/gutula/gutu-plugin-ai-evals) |
| Depends On | `ai-core`, `audit-core`, `jobs-core` |
| Requested Capabilities | `ui.register.admin`, `api.rest.mount`, `data.write.ai`, `jobs.execute.ai` |
| Provided Capabilities | `ai.evals`, `ai.release-gates` |
| Runtime | bun>=1.3.12 |
| Database | postgres, sqlite |
| Integration Model | Actions+Resources+UI |

## Capability Matrix

| Surface | Count | Details |
| --- | --- | --- |
| Actions | 4 | `ai.evals.run`, `ai.evals.compare`, `ai.evals.capture-baseline`, `ai.evals.promote-release` |
| Resources | 4 | `ai.eval-datasets`, `ai.eval-runs`, `ai.eval-baselines`, `ai.eval-release-gates` |
| Jobs | 0 | No job catalog exported |
| Workflows | 0 | No workflow catalog exported |
| UI | Present | base UI surface, admin contributions, regression widgets |

## Quick Start For Integrators

Use this repo inside a **compatible Gutu workspace** or the **ecosystem certification workspace** so its `workspace:*` dependencies resolve honestly.

```bash
# from a compatible workspace that already includes this plugin's dependency graph
bun install
bun run build
bun run test
bun run docs:check
```

```ts
import { manifest, runEvalDatasetAction, EvalDatasetResource, adminContributions, uiSurface } from "@plugins/ai-evals";

console.log(manifest.id);
console.log(runEvalDatasetAction.id);
console.log(EvalDatasetResource.id);
```

Use the root repo scripts for day-to-day work **after the workspace is bootstrapped**, or run the nested package directly from `framework/builtin-plugins/ai-evals` if you need lower-level control.

## Current Test Coverage

- Root verification scripts: `bun run build`, `bun run typecheck`, `bun run lint`, `bun run test`, `bun run test:contracts`, `bun run test:integration`, `bun run test:migrations`, `bun run test:unit`, `bun run docs:check`
- Unit files: 2
- Contracts files: 1
- Integration files: 1
- Migrations files: 1

## Known Boundaries And Non-Goals

- Not an everything-and-the-kitchen-sink provider abstraction layer.
- Not a substitute for explicit approval, budgeting, and audit governance in the surrounding platform.
- Cross-plugin composition should use Gutu command, event, job, and workflow primitives. This repo should not be documented as exposing a generic WordPress-style hook system unless one is explicitly exported.

## Recommended Next Milestones

- Add emitted SQL migration assets and rollback helpers alongside the current schema-verification lane.
- Broaden the integration matrix beyond the current company-pack release gate and replay-linked promotion flow.
- Wire the current evaluation evidence into more release and rollout control points.
- Add richer judge provenance and dataset lineage as the eval corpus grows.
- Promote important downstream reactions into explicit commands, jobs, or workflow steps instead of relying on implicit coupling.

## More Docs

See [DEVELOPER.md](./DEVELOPER.md), [TODO.md](./TODO.md), [SECURITY.md](./SECURITY.md), [CONTRIBUTING.md](./CONTRIBUTING.md). The internal domain sources used to build those docs live under:

- `plugins/gutu-plugin-ai-evals/framework/builtin-plugins/ai-evals/docs/AGENT_CONTEXT.md`
- `plugins/gutu-plugin-ai-evals/framework/builtin-plugins/ai-evals/docs/BUSINESS_RULES.md`
- `plugins/gutu-plugin-ai-evals/framework/builtin-plugins/ai-evals/docs/EDGE_CASES.md`
- `plugins/gutu-plugin-ai-evals/framework/builtin-plugins/ai-evals/docs/FLOWS.md`
- `plugins/gutu-plugin-ai-evals/framework/builtin-plugins/ai-evals/docs/GLOSSARY.md`
- `plugins/gutu-plugin-ai-evals/framework/builtin-plugins/ai-evals/docs/MANDATORY_STEPS.md`
