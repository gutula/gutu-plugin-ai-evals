import { defineResource } from "@platform/schema";
import { z } from "zod";

import {
  evalBaselines,
  evalDatasets,
  evalOnlineEvidence,
  evalReleaseGates,
  evalRolloutRings,
  evalRuns
} from "../../db/schema";

const subjectKinds = [
  "prompt-version",
  "agent-config",
  "workflow-version",
  "company-pack",
  "skill-version",
  "connector-version"
] as const;

export const EvalDatasetResource = defineResource({
  id: "ai.eval-datasets",
  table: evalDatasets,
  contract: z.object({
    id: z.string().min(2),
    tenantId: z.string().min(2),
    label: z.string().min(2),
    caseCount: z.number().nonnegative(),
    minPassRate: z.number().int().min(0).max(100),
    minAverageScore: z.number().int().min(0).max(100),
    minCitationRate: z.number().int().min(0).max(100),
    updatedAt: z.string()
  }),
  fields: {
    label: { searchable: true, sortable: true, label: "Dataset" },
    caseCount: { sortable: true, filter: "number", label: "Cases" },
    minPassRate: { sortable: true, filter: "number", label: "Min pass" },
    minAverageScore: { sortable: true, filter: "number", label: "Min score" },
    minCitationRate: { sortable: true, filter: "number", label: "Min citations" },
    updatedAt: { sortable: true, label: "Updated" }
  },
  admin: {
    autoCrud: true,
    defaultColumns: ["label", "caseCount", "minPassRate", "minAverageScore", "updatedAt"]
  },
  portal: { enabled: false },
  ai: {
    curatedReadModel: true,
    purpose: "Eval datasets used to gate prompt, tool, workflow, and company-pack changes.",
    citationLabelField: "label",
    allowedFields: ["label", "caseCount", "minPassRate", "minAverageScore", "minCitationRate", "updatedAt"]
  }
});

export const EvalRunResource = defineResource({
  id: "ai.eval-runs",
  table: evalRuns,
  contract: z.object({
    id: z.string().min(2),
    tenantId: z.string().min(2),
    datasetId: z.string().min(2),
    subjectKind: z.enum(subjectKinds),
    subjectId: z.string().min(2),
    replayRunId: z.string().nullable(),
    gateStatus: z.enum(["pending", "passing", "blocked", "promoted", "superseded"]),
    status: z.enum(["completed", "failed"]),
    passRate: z.number(),
    averageScore: z.number(),
    citationRate: z.number(),
    completedAt: z.string()
  }),
  fields: {
    datasetId: { searchable: true, sortable: true, label: "Dataset" },
    subjectKind: { filter: "select", label: "Subject kind" },
    subjectId: { searchable: true, sortable: true, label: "Subject" },
    gateStatus: { filter: "select", label: "Gate" },
    passRate: { sortable: true, filter: "number", label: "Pass rate" },
    averageScore: { sortable: true, filter: "number", label: "Average score" },
    citationRate: { sortable: true, filter: "number", label: "Citation rate" },
    completedAt: { sortable: true, label: "Completed" }
  },
  admin: {
    autoCrud: true,
    defaultColumns: ["datasetId", "subjectKind", "subjectId", "gateStatus", "passRate", "completedAt"]
  },
  portal: { enabled: false },
  ai: {
    curatedReadModel: true,
    purpose: "Completed eval runs with regression-ready metrics and release-gate posture.",
    citationLabelField: "subjectId",
    allowedFields: [
      "datasetId",
      "subjectKind",
      "subjectId",
      "replayRunId",
      "gateStatus",
      "passRate",
      "averageScore",
      "citationRate",
      "completedAt"
    ]
  }
});

export const EvalBaselineResource = defineResource({
  id: "ai.eval-baselines",
  table: evalBaselines,
  contract: z.object({
    id: z.string().min(2),
    tenantId: z.string().min(2),
    datasetId: z.string().min(2),
    subjectKind: z.enum(subjectKinds),
    subjectId: z.string().min(2),
    lineageParentId: z.string().nullable(),
    releaseChannel: z.string().min(2),
    capturedAt: z.string()
  }),
  fields: {
    datasetId: { searchable: true, sortable: true, label: "Dataset" },
    subjectKind: { filter: "select", label: "Subject kind" },
    subjectId: { searchable: true, sortable: true, label: "Subject" },
    releaseChannel: { filter: "select", label: "Channel" },
    capturedAt: { sortable: true, label: "Captured" }
  },
  admin: {
    autoCrud: true,
    defaultColumns: ["datasetId", "subjectKind", "subjectId", "releaseChannel", "capturedAt"]
  },
  portal: { enabled: false },
  ai: {
    curatedReadModel: true,
    purpose: "Approved baselines with lineage for release gating and promotion.",
    citationLabelField: "subjectId",
    allowedFields: ["datasetId", "subjectKind", "subjectId", "lineageParentId", "releaseChannel", "capturedAt"]
  }
});

export const EvalReleaseGateResource = defineResource({
  id: "ai.eval-release-gates",
  table: evalReleaseGates,
  contract: z.object({
    id: z.string().min(2),
    tenantId: z.string().min(2),
    datasetId: z.string().min(2),
    baselineId: z.string().min(2),
    candidateRunId: z.string().min(2),
    subjectKind: z.enum(subjectKinds),
    subjectId: z.string().min(2),
    status: z.enum(["pending", "passing", "blocked", "promoted", "superseded"]),
    promotedAt: z.string().nullable(),
    createdAt: z.string()
  }),
  fields: {
    datasetId: { searchable: true, sortable: true, label: "Dataset" },
    subjectKind: { filter: "select", label: "Subject kind" },
    subjectId: { searchable: true, sortable: true, label: "Subject" },
    status: { filter: "select", label: "Status" },
    createdAt: { sortable: true, label: "Created" }
  },
  admin: {
    autoCrud: true,
    defaultColumns: ["datasetId", "subjectKind", "subjectId", "status", "createdAt"]
  },
  portal: { enabled: false },
  ai: {
    curatedReadModel: true,
    purpose: "Release-gate decisions used to block, pass, or promote governed AI changes.",
    citationLabelField: "subjectId",
    allowedFields: ["datasetId", "baselineId", "candidateRunId", "subjectKind", "subjectId", "status", "promotedAt", "createdAt"]
  }
});

export const EvalRolloutRingResource = defineResource({
  id: "ai.eval-rollout-rings",
  table: evalRolloutRings,
  contract: z.object({
    id: z.string().min(2),
    tenantId: z.string().min(2),
    gateId: z.string().min(2),
    subjectKind: z.enum(subjectKinds),
    subjectId: z.string().min(2),
    ring: z.enum(["shadow", "canary", "stable"]),
    trafficPercent: z.number().int().min(0).max(100),
    status: z.enum(["pending", "live", "rolled-back"]),
    updatedAt: z.string()
  }),
  fields: {
    subjectId: { searchable: true, sortable: true, label: "Subject" },
    ring: { filter: "select", label: "Ring" },
    trafficPercent: { sortable: true, filter: "number", label: "Traffic" },
    status: { filter: "select", label: "Status" },
    updatedAt: { sortable: true, label: "Updated" }
  },
  admin: {
    autoCrud: true,
    defaultColumns: ["subjectId", "ring", "trafficPercent", "status", "updatedAt"]
  },
  portal: { enabled: false },
  ai: {
    curatedReadModel: true,
    purpose: "Shadow, canary, and stable rollout posture for governed eval releases.",
    citationLabelField: "subjectId",
    allowedFields: ["gateId", "subjectKind", "subjectId", "ring", "trafficPercent", "status", "updatedAt"]
  }
});

export const EvalOnlineEvidenceResource = defineResource({
  id: "ai.eval-online-evidence",
  table: evalOnlineEvidence,
  contract: z.object({
    id: z.string().min(2),
    tenantId: z.string().min(2),
    subjectKind: z.enum(subjectKinds),
    subjectId: z.string().min(2),
    runId: z.string().nullable(),
    gateId: z.string().nullable(),
    signalType: z.enum(["quality", "cost", "latency", "safety"]),
    status: z.enum(["passing", "warning", "blocked"]),
    score: z.number().int().min(0).max(100),
    notes: z.string().min(2),
    recordedAt: z.string()
  }),
  fields: {
    subjectId: { searchable: true, sortable: true, label: "Subject" },
    signalType: { filter: "select", label: "Signal" },
    status: { filter: "select", label: "Status" },
    score: { sortable: true, filter: "number", label: "Score" },
    recordedAt: { sortable: true, label: "Recorded" }
  },
  admin: {
    autoCrud: true,
    defaultColumns: ["subjectId", "signalType", "status", "score", "recordedAt"]
  },
  portal: { enabled: false },
  ai: {
    curatedReadModel: true,
    purpose: "Online eval signals that back rollout rings with live quality, cost, latency, and safety evidence.",
    citationLabelField: "subjectId",
    allowedFields: ["subjectKind", "subjectId", "runId", "gateId", "signalType", "status", "score", "recordedAt"]
  }
});

export const aiEvalResources = [
  EvalDatasetResource,
  EvalRunResource,
  EvalBaselineResource,
  EvalReleaseGateResource,
  EvalRolloutRingResource,
  EvalOnlineEvidenceResource
] as const;
