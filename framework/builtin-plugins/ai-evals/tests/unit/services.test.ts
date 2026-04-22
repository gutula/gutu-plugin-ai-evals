import { afterEach, beforeEach, describe, expect, it } from "bun:test";
import { mkdtempSync, rmSync } from "node:fs";
import { tmpdir } from "node:os";
import { join } from "node:path";

import {
  baselineFixture,
  captureEvalBaseline,
  configureEvalRollout,
  promoteEvalRelease,
  datasetFixture,
  getCurrentEvalSummary,
  listEvalOnlineEvidence,
  listEvalRolloutRings,
  listEvalRuns,
  listReleaseGates,
  recordOnlineEvalEvidence,
  runEvalDatasetScenario,
  compareEvalRunScenario
} from "../../src/services/main.service";

describe("ai-evals services", () => {
  let stateDir = "";
  const previousStateDir = process.env.GUTU_STATE_DIR;

  beforeEach(() => {
    stateDir = mkdtempSync(join(tmpdir(), "gutu-ai-evals-state-"));
    process.env.GUTU_STATE_DIR = stateDir;
  });

  afterEach(() => {
    rmSync(stateDir, { recursive: true, force: true });
    if (previousStateDir === undefined) {
      delete process.env.GUTU_STATE_DIR;
      return;
    }
    process.env.GUTU_STATE_DIR = previousStateDir;
  });

  it("persists new candidate eval runs and makes them the latest summary", () => {
    const run = runEvalDatasetScenario({
      tenantId: "tenant-platform",
      datasetId: datasetFixture.id,
      candidateLabel: "nightly",
      subjectKind: "company-pack",
      subjectId: "company-builder-core@0.1.0"
    });

    expect(run.runId).toContain("nightly");
    expect(run.gateId).toContain("eval-gate:");
    expect(listEvalRuns()[0]?.id).toBe(run.runId);
    expect(listReleaseGates()[0]?.id).toBe(run.gateId);
    expect(getCurrentEvalSummary().candidate.id).toBe(run.runId);
  });

  it("compares persisted runs against stored baselines", () => {
    const run = runEvalDatasetScenario({
      tenantId: "tenant-platform",
      datasetId: datasetFixture.id,
      candidateLabel: "release-candidate"
    });

    const comparison = compareEvalRunScenario({
      tenantId: "tenant-platform",
      baselineId: baselineFixture.id,
      candidateRunId: run.runId
    });

    expect(comparison.ok).toBe(true);
    expect(comparison.passed).toBe(true);
    expect(comparison.reasons).toEqual([]);
  });

  it("captures successor baselines and promotes passing release gates", () => {
    const run = runEvalDatasetScenario({
      tenantId: "tenant-platform",
      datasetId: datasetFixture.id,
      candidateLabel: "release-promotion",
      subjectKind: "company-pack",
      subjectId: "company-builder-core@0.1.0"
    });
    const baseline = captureEvalBaseline({
      tenantId: "tenant-platform",
      actorId: "actor-admin",
      runId: run.runId,
      releaseChannel: "next"
    });
    const promoted = promoteEvalRelease({
      tenantId: "tenant-platform",
      actorId: "actor-admin",
      gateId: run.gateId,
      releaseChannel: "stable"
    });

    expect(baseline.baselineId).toContain("eval-baseline:");
    expect(promoted.gateStatus).toBe("promoted");
    expect(promoted.baselineId).toContain("eval-baseline:");
    expect(baselineFixture.subjectKind).toBe("prompt-version");
  });

  it("configures rollout rings and persists online evidence for promoted subjects", () => {
    const run = runEvalDatasetScenario({
      tenantId: "tenant-platform",
      datasetId: datasetFixture.id,
      candidateLabel: "shadow-skill",
      subjectKind: "skill-version",
      subjectId: "skill:finance-approval@v1",
      rolloutRing: "shadow",
      executionKind: "shadow"
    });
    const rollout = configureEvalRollout({
      tenantId: "tenant-platform",
      actorId: "actor-admin",
      gateId: run.gateId,
      ring: "canary",
      trafficPercent: 10
    });
    const evidence = recordOnlineEvalEvidence({
      tenantId: "tenant-platform",
      actorId: "actor-admin",
      subjectKind: "skill-version",
      subjectId: "skill:finance-approval@v1",
      runId: run.runId,
      gateId: run.gateId,
      signalType: "quality",
      status: "passing",
      score: 93,
      notes: "Canary traffic stayed within the latency and quality budget."
    });

    expect(rollout.status).toBe("live");
    expect(evidence.status).toBe("passing");
    expect(listEvalRolloutRings().find((entry) => entry.gateId === run.gateId)?.trafficPercent).toBe(10);
    expect(listEvalOnlineEvidence().find((entry) => entry.id === evidence.evidenceId)?.score).toBe(93);
  });
});
