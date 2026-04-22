import {
  defineAdminNav,
  defineBuilder,
  defineCommand,
  definePage,
  defineReport,
  defineSearchProvider,
  defineWidget,
  type AdminContributionRegistry
} from "@platform/admin-contracts";

import { AiEvalsAdminPage } from "./admin/main.page";
import { EvalBuilderPage } from "./admin/eval-builder.page";
import { EvalRegressionWidget } from "./admin/regression.widget";

export const adminContributions: Pick<
  AdminContributionRegistry,
  "workspaces" | "nav" | "pages" | "widgets" | "reports" | "commands" | "searchProviders" | "builders"
> = {
  workspaces: [],
  nav: [
    defineAdminNav({
      workspace: "ai",
      group: "quality",
      items: [
        {
          id: "ai.evals",
          label: "Eval Runs",
          icon: "beaker",
          to: "/admin/ai/evals",
          permission: "ai.evals.read"
        }
      ]
    }),
    defineAdminNav({
      workspace: "tools",
      group: "builders",
      items: [
        {
          id: "tools.eval-builder",
          label: "Eval Builder",
          icon: "flask-conical",
          to: "/admin/tools/eval-builder",
          permission: "ai.evals.rollouts.write"
        }
      ]
    })
  ],
  pages: [
    definePage({
      id: "ai.evals.page",
      kind: "report",
      route: "/admin/ai/evals",
      label: "Eval Runs",
      workspace: "ai",
      group: "quality",
      permission: "ai.evals.read",
      component: AiEvalsAdminPage
    }),
    definePage({
      id: "ai.eval.builder.page",
      kind: "builder",
      route: "/admin/tools/eval-builder",
      label: "Eval Builder",
      workspace: "tools",
      group: "builders",
      permission: "ai.evals.rollouts.write",
      component: EvalBuilderPage,
      builderId: "eval-builder"
    })
  ],
  builders: [
    defineBuilder({
      id: "eval-builder",
      label: "Eval Builder",
      host: "admin",
      route: "/admin/tools/eval-builder",
      permission: "ai.evals.rollouts.write",
      mode: "embedded"
    })
  ],
  widgets: [
    defineWidget({
      id: "ai.eval-regressions",
      kind: "status",
      shell: "admin",
      slot: "dashboard.ai",
      permission: "ai.evals.read",
      title: "Eval Gate",
      component: EvalRegressionWidget,
      drillTo: "/admin/ai/evals"
    })
  ],
  reports: [
    defineReport({
      id: "ai.eval-regressions.report",
      kind: "audit",
      route: "/admin/reports/ai-regressions",
      label: "AI Eval Regressions",
      permission: "ai.reports.read",
      query: "ai.evals.regressions",
      filters: [
        { key: "datasetId", type: "text" },
        { key: "completedAt", type: "date-range" }
      ],
      export: ["csv", "json", "pdf"]
    })
  ],
  commands: [
    defineCommand({
      id: "ai.open.evals",
      label: "Open AI Eval Runs",
      permission: "ai.evals.read",
      href: "/admin/ai/evals",
      keywords: ["evals", "judge", "regression"]
    }),
    defineCommand({
      id: "ai.open.eval-builder",
      label: "Open Eval Builder",
      permission: "ai.evals.rollouts.write",
      href: "/admin/tools/eval-builder",
      keywords: ["eval", "builder", "canary"]
    })
  ],
  searchProviders: [
    defineSearchProvider({
      id: "ai-evals.search",
      scopes: ["evals"],
      permission: "ai.evals.read",
      search(query, ctx) {
        const items = [
          {
            id: "ai-evals-search:runs",
            label: "Eval Runs",
            href: "/admin/ai/evals",
            kind: "page" as const,
            description: "Golden datasets, judges, baselines, and regression gates.",
            permission: "ai.evals.read"
          },
          {
            id: "ai-evals-search:report",
            label: "AI Eval Regressions",
            href: "/admin/reports/ai-regressions",
            kind: "report" as const,
            description: "Regression deltas and release-gate decisions.",
            permission: "ai.reports.read"
          }
        ];

        return items.filter(
          (item) =>
            (!item.permission || ctx.permissions.has(item.permission)) &&
            `${item.label} ${item.description}`.toLowerCase().includes(query.toLowerCase())
        );
      }
    })
  ]
};
