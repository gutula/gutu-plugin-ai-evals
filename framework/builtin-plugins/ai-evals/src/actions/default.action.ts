import { defineAction } from "@platform/schema";
import { z } from "zod";

import {
  captureEvalBaseline,
  configureEvalRollout,
  compareEvalRunScenario,
  recordOnlineEvalEvidence,
  promoteEvalRelease,
  runEvalDatasetScenario
} from "../services/main.service";

const subjectKinds = [
  "prompt-version",
  "agent-config",
  "workflow-version",
  "company-pack",
  "skill-version",
  "connector-version"
] as const;

export const runEvalDatasetAction = defineAction({
  id: "ai.evals.run",
  input: z.object({
    tenantId: z.string().min(2),
    datasetId: z.string().min(2),
    candidateLabel: z.string().min(2),
    subjectKind: z.enum(subjectKinds).optional(),
    subjectId: z.string().min(2).optional(),
    replayRunId: z.string().min(2).optional(),
    rolloutRing: z.enum(["shadow", "canary", "stable"]).optional(),
    executionKind: z.enum(["offline", "shadow", "canary", "online"]).optional()
  }),
  output: z.object({
    ok: z.literal(true),
    runId: z.string(),
    gateId: z.string(),
    gateStatus: z.enum(["pending", "passing", "blocked", "promoted", "superseded"]),
    passRate: z.number(),
    averageScore: z.number(),
    citationRate: z.number()
  }),
  permission: "ai.evals.run",
  idempotent: false,
  audit: true,
  ai: {
    purpose: "Execute an offline AI eval dataset against the current prompt, tool, routing, and company-pack configuration.",
    riskLevel: "moderate",
    approvalMode: "required",
    toolPolicies: ["tool.require_approval"],
    resultSummaryHint: "Return the run id, gate id, gate status, and top-level pass, score, and citation metrics.",
    replay: {
      deterministic: true,
      includeInputHash: true,
      includeOutputHash: true,
      note: "Eval runs are replayed against the same dataset and judge configuration."
    }
  },
  handler: ({ input }) => runEvalDatasetScenario(input)
});

export const compareEvalRunsAction = defineAction({
  id: "ai.evals.compare",
  input: z.object({
    tenantId: z.string().min(2),
    baselineId: z.string().min(2),
    candidateRunId: z.string().min(2)
  }),
  output: z.object({
    ok: z.literal(true),
    passed: z.boolean(),
    reasons: z.array(z.string()),
    gateId: z.string().nullable(),
    gateStatus: z.enum(["pending", "passing", "blocked", "promoted", "superseded"])
  }),
  permission: "ai.evals.read",
  idempotent: true,
  audit: false,
  ai: {
    purpose: "Compare a candidate eval run against a stored baseline and regression gate.",
    riskLevel: "low",
    approvalMode: "none",
    toolPolicies: ["tool.allow"],
    resultSummaryHint: "Return whether the regression gate passed, its status, and why.",
    replay: {
      deterministic: true,
      includeInputHash: true,
      includeOutputHash: true,
      note: "Comparisons are deterministic for the same baseline and candidate ids."
    }
  },
  handler: ({ input }) => compareEvalRunScenario(input)
});

export const captureEvalBaselineAction = defineAction({
  id: "ai.evals.capture-baseline",
  input: z.object({
    tenantId: z.string().min(2),
    actorId: z.string().min(2),
    runId: z.string().min(2),
    releaseChannel: z.string().min(2).optional()
  }),
  output: z.object({
    ok: z.literal(true),
    baselineId: z.string(),
    subjectId: z.string()
  }),
  permission: "ai.evals.capture-baseline",
  idempotent: true,
  audit: true,
  handler: ({ input }) => captureEvalBaseline(input)
});

export const promoteEvalReleaseAction = defineAction({
  id: "ai.evals.promote-release",
  input: z.object({
    tenantId: z.string().min(2),
    actorId: z.string().min(2),
    gateId: z.string().min(2),
    releaseChannel: z.string().min(2).optional()
  }),
  output: z.object({
    ok: z.literal(true),
    gateId: z.string(),
    gateStatus: z.enum(["pending", "passing", "blocked", "promoted", "superseded"]),
    baselineId: z.string()
  }),
  permission: "ai.evals.promote",
  idempotent: false,
  audit: true,
  handler: ({ input }) => promoteEvalRelease(input)
});

export const configureEvalRolloutAction = defineAction({
  id: "ai.evals.rollouts.configure",
  input: z.object({
    tenantId: z.string().min(2),
    actorId: z.string().min(2),
    gateId: z.string().min(2),
    ring: z.enum(["shadow", "canary", "stable"]),
    trafficPercent: z.number().int().min(0).max(100)
  }),
  output: z.object({
    ok: z.literal(true),
    rolloutId: z.string(),
    status: z.enum(["pending", "live", "rolled-back"])
  }),
  permission: "ai.evals.rollouts.write",
  idempotent: true,
  audit: true,
  handler: ({ input }) => configureEvalRollout(input)
});

export const recordOnlineEvalEvidenceAction = defineAction({
  id: "ai.evals.online-evidence.record",
  input: z.object({
    tenantId: z.string().min(2),
    actorId: z.string().min(2),
    subjectKind: z.enum(subjectKinds),
    subjectId: z.string().min(2),
    runId: z.string().min(2).optional(),
    gateId: z.string().min(2).optional(),
    signalType: z.enum(["quality", "cost", "latency", "safety"]),
    status: z.enum(["passing", "warning", "blocked"]),
    score: z.number().int().min(0).max(100),
    notes: z.string().min(2)
  }),
  output: z.object({
    ok: z.literal(true),
    evidenceId: z.string(),
    status: z.enum(["passing", "warning", "blocked"])
  }),
  permission: "ai.evals.online-evidence.write",
  idempotent: false,
  audit: true,
  handler: ({ input }) => recordOnlineEvalEvidence(input)
});

export const aiEvalActions = [
  runEvalDatasetAction,
  compareEvalRunsAction,
  captureEvalBaselineAction,
  promoteEvalReleaseAction,
  configureEvalRolloutAction,
  recordOnlineEvalEvidenceAction
] as const;
