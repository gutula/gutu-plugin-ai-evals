import {
  BuilderCanvas,
  BuilderHost,
  BuilderInspector,
  BuilderPalette,
  createBuilderPanelLayout
} from "@platform/admin-builders";

import { listEvalOnlineEvidence, listEvalRolloutRings, listReleaseGates } from "../../services/main.service";

export function EvalBuilderPage() {
  const releaseGates = listReleaseGates().slice(0, 6);
  const rolloutRings = listEvalRolloutRings().slice(0, 6);
  const onlineEvidence = listEvalOnlineEvidence().slice(0, 6);

  return (
    <BuilderHost
      layout={createBuilderPanelLayout({
        left: "palette",
        center: "canvas",
        right: "inspector"
      })}
      palette={<BuilderPalette items={releaseGates.map((gate) => ({ id: gate.id, label: gate.subjectId }))} />}
      canvas={
        <BuilderCanvas title="Eval rollout rings">
          <div className="awb-form-card">
            <h3 className="awb-panel-title">Rollout strategy</h3>
            <div className="awb-table">
              {rolloutRings.map((ring) => (
                <div key={ring.id} className="awb-table-row">
                  <strong>{ring.subjectId}</strong>
                  <span>{ring.ring}</span>
                  <span>{ring.trafficPercent}%</span>
                </div>
              ))}
            </div>
          </div>
        </BuilderCanvas>
      }
      inspector={
        <BuilderInspector title="Online evidence">
          <div className="awb-form-card">
            <div className="awb-table">
              {onlineEvidence.map((evidence) => (
                <div key={evidence.id} className="awb-table-row">
                  <strong>{evidence.signalType}</strong>
                  <span>{evidence.status}</span>
                  <span>{evidence.score}</span>
                </div>
              ))}
            </div>
          </div>
        </BuilderInspector>
      }
    />
  );
}
