import { describe, expect, it } from "bun:test";
import { getTableColumns } from "drizzle-orm";

import {
  evalBaselines,
  evalDatasets,
  evalOnlineEvidence,
  evalReleaseGates,
  evalRolloutRings,
  evalRuns
} from "../../db/schema";

describe("ai-evals schema coverage", () => {
  it("captures eval datasets, runs, baselines, and release gates", () => {
    expect(Object.keys(getTableColumns(evalDatasets))).toEqual([
      "id",
      "tenantId",
      "label",
      "caseCount",
      "minPassRate",
      "minAverageScore",
      "minCitationRate",
      "updatedAt"
    ]);
    expect(Object.keys(getTableColumns(evalRuns))).toEqual([
      "id",
      "tenantId",
      "datasetId",
      "subjectKind",
      "subjectId",
      "replayRunId",
      "gateStatus",
      "status",
      "passRate",
      "averageScore",
      "citationRate",
      "completedAt"
    ]);
    expect(Object.keys(getTableColumns(evalBaselines))).toEqual([
      "id",
      "tenantId",
      "datasetId",
      "subjectKind",
      "subjectId",
      "lineageParentId",
      "releaseChannel",
      "capturedAt"
    ]);
    expect(Object.keys(getTableColumns(evalReleaseGates))).toEqual([
      "id",
      "tenantId",
      "datasetId",
      "baselineId",
      "candidateRunId",
      "subjectKind",
      "subjectId",
      "status",
      "promotedAt",
      "createdAt"
    ]);
    expect(Object.keys(getTableColumns(evalRolloutRings))).toEqual([
      "id",
      "tenantId",
      "gateId",
      "subjectKind",
      "subjectId",
      "ring",
      "trafficPercent",
      "status",
      "updatedAt"
    ]);
    expect(Object.keys(getTableColumns(evalOnlineEvidence))).toEqual([
      "id",
      "tenantId",
      "subjectKind",
      "subjectId",
      "runId",
      "gateId",
      "signalType",
      "status",
      "score",
      "notes",
      "recordedAt"
    ]);
  });
});
