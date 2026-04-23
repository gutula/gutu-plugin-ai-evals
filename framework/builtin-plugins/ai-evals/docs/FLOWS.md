# AI Evals Flows

## Happy paths

- `ai.evals.run`: Governed action exported by this plugin.
- `ai.evals.compare`: Governed action exported by this plugin.
- `ai.evals.capture-baseline`: Governed action exported by this plugin.
- `ai.evals.promote-release`: Governed action exported by this plugin.
- `ai.evals.rollouts.configure`: Governed action exported by this plugin.
- `ai.evals.online-evidence.record`: Governed action exported by this plugin.

## Operational scenario matrix

- No operational scenario catalog is exported today.

## Action-level flows

### `ai.evals.run`

Governed action exported by this plugin.

Permission: `ai.evals.run`

Business purpose: Expose the plugin’s write boundary through a validated, auditable action contract.

Preconditions:

- Caller input must satisfy the action schema exported by the plugin.
- The caller must satisfy the declared permission and any host-level installation constraints.
- Integration should honor the action’s non-idempotent semantics.

Side effects:

- Mutates or validates state owned by `ai.eval-datasets`, `ai.eval-runs`, `ai.eval-baselines`, `ai.eval-release-gates`, `ai.eval-rollout-rings`, `ai.eval-online-evidence`.

Forbidden shortcuts:

- Do not bypass the action contract with undocumented service mutations in application code.
- Do not document extra hooks, retries, or lifecycle semantics unless they are explicitly exported here.


### `ai.evals.compare`

Governed action exported by this plugin.

Permission: `ai.evals.read`

Business purpose: Expose the plugin’s write boundary through a validated, auditable action contract.

Preconditions:

- Caller input must satisfy the action schema exported by the plugin.
- The caller must satisfy the declared permission and any host-level installation constraints.
- Integration should honor the action’s idempotent semantics.

Side effects:

- Mutates or validates state owned by `ai.eval-datasets`, `ai.eval-runs`, `ai.eval-baselines`, `ai.eval-release-gates`, `ai.eval-rollout-rings`, `ai.eval-online-evidence`.

Forbidden shortcuts:

- Do not bypass the action contract with undocumented service mutations in application code.
- Do not document extra hooks, retries, or lifecycle semantics unless they are explicitly exported here.


### `ai.evals.capture-baseline`

Governed action exported by this plugin.

Permission: `ai.evals.capture-baseline`

Business purpose: Expose the plugin’s write boundary through a validated, auditable action contract.

Preconditions:

- Caller input must satisfy the action schema exported by the plugin.
- The caller must satisfy the declared permission and any host-level installation constraints.
- Integration should honor the action’s idempotent semantics.

Side effects:

- Mutates or validates state owned by `ai.eval-datasets`, `ai.eval-runs`, `ai.eval-baselines`, `ai.eval-release-gates`, `ai.eval-rollout-rings`, `ai.eval-online-evidence`.

Forbidden shortcuts:

- Do not bypass the action contract with undocumented service mutations in application code.
- Do not document extra hooks, retries, or lifecycle semantics unless they are explicitly exported here.


### `ai.evals.promote-release`

Governed action exported by this plugin.

Permission: `ai.evals.promote`

Business purpose: Expose the plugin’s write boundary through a validated, auditable action contract.

Preconditions:

- Caller input must satisfy the action schema exported by the plugin.
- The caller must satisfy the declared permission and any host-level installation constraints.
- Integration should honor the action’s non-idempotent semantics.

Side effects:

- Mutates or validates state owned by `ai.eval-datasets`, `ai.eval-runs`, `ai.eval-baselines`, `ai.eval-release-gates`, `ai.eval-rollout-rings`, `ai.eval-online-evidence`.

Forbidden shortcuts:

- Do not bypass the action contract with undocumented service mutations in application code.
- Do not document extra hooks, retries, or lifecycle semantics unless they are explicitly exported here.


### `ai.evals.rollouts.configure`

Governed action exported by this plugin.

Permission: `ai.evals.rollouts.write`

Business purpose: Expose the plugin’s write boundary through a validated, auditable action contract.

Preconditions:

- Caller input must satisfy the action schema exported by the plugin.
- The caller must satisfy the declared permission and any host-level installation constraints.
- Integration should honor the action’s idempotent semantics.

Side effects:

- Mutates or validates state owned by `ai.eval-datasets`, `ai.eval-runs`, `ai.eval-baselines`, `ai.eval-release-gates`, `ai.eval-rollout-rings`, `ai.eval-online-evidence`.

Forbidden shortcuts:

- Do not bypass the action contract with undocumented service mutations in application code.
- Do not document extra hooks, retries, or lifecycle semantics unless they are explicitly exported here.


### `ai.evals.online-evidence.record`

Governed action exported by this plugin.

Permission: `ai.evals.online-evidence.write`

Business purpose: Expose the plugin’s write boundary through a validated, auditable action contract.

Preconditions:

- Caller input must satisfy the action schema exported by the plugin.
- The caller must satisfy the declared permission and any host-level installation constraints.
- Integration should honor the action’s non-idempotent semantics.

Side effects:

- Mutates or validates state owned by `ai.eval-datasets`, `ai.eval-runs`, `ai.eval-baselines`, `ai.eval-release-gates`, `ai.eval-rollout-rings`, `ai.eval-online-evidence`.

Forbidden shortcuts:

- Do not bypass the action contract with undocumented service mutations in application code.
- Do not document extra hooks, retries, or lifecycle semantics unless they are explicitly exported here.


## Cross-package interactions

- Direct dependencies: `ai-core`, `audit-core`, `jobs-core`
- Requested capabilities: `ui.register.admin`, `api.rest.mount`, `data.write.ai`, `jobs.execute.ai`
- Integration model: Actions+Resources+Jobs+UI
- ERPNext doctypes used as parity references: none declared
- Recovery ownership should stay with the host orchestration layer when the plugin does not explicitly export jobs, workflows, or lifecycle events.
