import { definePolicy } from "@platform/permissions";

export const aiPolicy = definePolicy({
  id: "ai-evals.default",
  rules: [
    {
      permission: "ai.evals.read",
      allowIf: ["role:admin", "role:operator", "role:support"]
    },
    {
      permission: "ai.evals.run",
      allowIf: ["role:admin"],
      requireReason: true,
      audit: true
    },
    {
      permission: "ai.evals.capture-baseline",
      allowIf: ["role:admin"],
      requireReason: true,
      audit: true
    },
    {
      permission: "ai.evals.promote",
      allowIf: ["role:admin"],
      requireReason: true,
      audit: true
    },
    {
      permission: "ai.evals.rollouts.write",
      allowIf: ["role:admin", "role:operator"],
      requireReason: true,
      audit: true
    },
    {
      permission: "ai.evals.online-evidence.write",
      allowIf: ["role:admin", "role:operator"],
      requireReason: true,
      audit: true
    },
    {
      permission: "ai.reports.read",
      allowIf: ["role:admin", "role:operator", "role:support"]
    }
  ]
});
