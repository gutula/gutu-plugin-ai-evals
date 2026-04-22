import { integer, pgTable, text, timestamp } from "drizzle-orm/pg-core";

export const evalDatasets = pgTable("ai_eval_datasets", {
  id: text("id").primaryKey(),
  tenantId: text("tenant_id").notNull(),
  label: text("label").notNull(),
  caseCount: integer("case_count").notNull(),
  minPassRate: integer("min_pass_rate").notNull(),
  minAverageScore: integer("min_average_score").notNull(),
  minCitationRate: integer("min_citation_rate").notNull(),
  updatedAt: timestamp("updated_at").notNull().defaultNow()
});

export const evalRuns = pgTable("ai_eval_runs", {
  id: text("id").primaryKey(),
  tenantId: text("tenant_id").notNull(),
  datasetId: text("dataset_id").notNull(),
  subjectKind: text("subject_kind").notNull(),
  subjectId: text("subject_id").notNull(),
  replayRunId: text("replay_run_id"),
  gateStatus: text("gate_status").notNull(),
  status: text("status").notNull(),
  passRate: integer("pass_rate").notNull(),
  averageScore: integer("average_score").notNull(),
  citationRate: integer("citation_rate").notNull(),
  completedAt: timestamp("completed_at").notNull().defaultNow()
});

export const evalBaselines = pgTable("ai_eval_baselines", {
  id: text("id").primaryKey(),
  tenantId: text("tenant_id").notNull(),
  datasetId: text("dataset_id").notNull(),
  subjectKind: text("subject_kind").notNull(),
  subjectId: text("subject_id").notNull(),
  lineageParentId: text("lineage_parent_id"),
  releaseChannel: text("release_channel").notNull(),
  capturedAt: timestamp("captured_at").notNull().defaultNow()
});

export const evalReleaseGates = pgTable("ai_eval_release_gates", {
  id: text("id").primaryKey(),
  tenantId: text("tenant_id").notNull(),
  datasetId: text("dataset_id").notNull(),
  baselineId: text("baseline_id").notNull(),
  candidateRunId: text("candidate_run_id").notNull(),
  subjectKind: text("subject_kind").notNull(),
  subjectId: text("subject_id").notNull(),
  status: text("status").notNull(),
  promotedAt: timestamp("promoted_at"),
  createdAt: timestamp("created_at").notNull().defaultNow()
});

export const evalRolloutRings = pgTable("ai_eval_rollout_rings", {
  id: text("id").primaryKey(),
  tenantId: text("tenant_id").notNull(),
  gateId: text("gate_id").notNull(),
  subjectKind: text("subject_kind").notNull(),
  subjectId: text("subject_id").notNull(),
  ring: text("ring").notNull(),
  trafficPercent: integer("traffic_percent").notNull(),
  status: text("status").notNull(),
  updatedAt: timestamp("updated_at").notNull().defaultNow()
});

export const evalOnlineEvidence = pgTable("ai_eval_online_evidence", {
  id: text("id").primaryKey(),
  tenantId: text("tenant_id").notNull(),
  subjectKind: text("subject_kind").notNull(),
  subjectId: text("subject_id").notNull(),
  runId: text("run_id"),
  gateId: text("gate_id"),
  signalType: text("signal_type").notNull(),
  status: text("status").notNull(),
  score: integer("score").notNull(),
  notes: text("notes").notNull(),
  recordedAt: timestamp("recorded_at").notNull().defaultNow()
});
