import { afterEach, beforeEach, describe, expect, it } from "bun:test";
import { mkdtempSync, readFileSync, rmSync, writeFileSync } from "node:fs";
import { tmpdir } from "node:os";
import { join } from "node:path";

import { resolveStateFile } from "@platform/ai-runtime";
import {
  captureEvalBaseline,
  companyPackBaselineFixture,
  compareEvalRunScenario,
  datasetFixture,
  listEvalRuns,
  listReleaseGates,
  promoteEvalRelease,
  runEvalDatasetScenario
} from "../../src/services/main.service";

describe("ai-evals integration", () => {
  let stateDir = "";
  const previousStateDir = process.env.GUTU_STATE_DIR;

  beforeEach(() => {
    stateDir = mkdtempSync(join(tmpdir(), "gutu-ai-evals-integration-"));
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

  it("runs company-pack release gates from replay-linked eval to promoted release", () => {
    const run = runEvalDatasetScenario({
      tenantId: "tenant-platform",
      datasetId: datasetFixture.id,
      candidateLabel: "company-pack-integration",
      subjectKind: "company-pack",
      subjectId: "company-builder-core@0.1.0",
      replayRunId: "run:integration:company-builder"
    });
    const comparison = compareEvalRunScenario({
      tenantId: "tenant-platform",
      baselineId: companyPackBaselineFixture.id,
      candidateRunId: run.runId
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
    const governedRun = listEvalRuns().find((entry) => entry.id === run.runId);
    const gate = listReleaseGates().find((entry) => entry.id === run.gateId);

    expect(comparison.gateStatus).toBe("passing");
    expect(baseline.baselineId).toContain("eval-baseline:");
    expect(promoted.gateStatus).toBe("promoted");
    expect(governedRun?.replayRunId).toBe("run:integration:company-builder");
    expect(gate?.status).toBe("promoted");
  });

  it("refuses to promote blocked gates and leaves their status unchanged", () => {
    const run = runEvalDatasetScenario({
      tenantId: "tenant-platform",
      datasetId: datasetFixture.id,
      candidateLabel: "blocked-company-pack",
      subjectKind: "company-pack",
      subjectId: "company-builder-core@0.1.0",
      replayRunId: "run:integration:blocked-company-builder"
    });

    const statePath = resolveStateFile("ai-evals.json");
    const evalState = JSON.parse(readFileSync(statePath, "utf8")) as {
      releaseGates: Array<Record<string, unknown>>;
    };
    evalState.releaseGates = evalState.releaseGates.map((gate) =>
      gate.id === run.gateId ? { ...gate, status: "blocked" } : gate
    );
    writeFileSync(statePath, `${JSON.stringify(evalState, null, 2)}\n`, "utf8");

    expect(() =>
      promoteEvalRelease({
        tenantId: "tenant-platform",
        actorId: "actor-admin",
        gateId: run.gateId,
        releaseChannel: "stable"
      })
    ).toThrow(/is not promotable/);
    expect(listReleaseGates().find((entry) => entry.id === run.gateId)?.status).toBe("blocked");
  });

  it("supersedes older passing gates when a newer candidate is promoted", () => {
    const first = runEvalDatasetScenario({
      tenantId: "tenant-platform",
      datasetId: datasetFixture.id,
      candidateLabel: "company-pack-superseded-a",
      subjectKind: "company-pack",
      subjectId: "company-builder-core@0.1.0"
    });
    const second = runEvalDatasetScenario({
      tenantId: "tenant-platform",
      datasetId: datasetFixture.id,
      candidateLabel: "company-pack-superseded-b",
      subjectKind: "company-pack",
      subjectId: "company-builder-core@0.1.0"
    });

    promoteEvalRelease({
      tenantId: "tenant-platform",
      actorId: "actor-admin",
      gateId: second.gateId,
      releaseChannel: "stable"
    });

    expect(listReleaseGates().find((entry) => entry.id === first.gateId)?.status).toBe("superseded");
    expect(listReleaseGates().find((entry) => entry.id === second.gateId)?.status).toBe("promoted");
  });
});
