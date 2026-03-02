import { useEffect, useState } from "react";
import { generatePlan } from "../services/plannerService";
import {
  getWorkers,
  getClosedOverrides,
  getWeekdaySettings,
  loadSchedule,
  saveSchedule,
} from "../services/supabaseService";

export default function PlanGenerator({ month, year }) {
  const [plan, setPlan] = useState([]);

  useEffect(() => {
    if (month && year) loadExistingPlan();
  }, [month, year]);

  async function loadExistingPlan() {
    const existing = await loadSchedule(month, year);
    if (existing) setPlan(existing);
  }

  async function createPlan() {
    const workers = await getWorkers();
    const closed = await getClosedOverrides(month, year);
    const weekdaySettings = await getWeekdaySettings();

    const closedDays = closed.map((d) => d.date);

    const weekdayLimits = {};
    weekdaySettings.forEach((s) => {
      weekdayLimits[s.weekday] = s.max_workers ?? 0;
    });

    const result = generatePlan({
      workers,
      closedDays,
      sickDays: [],
      weekdayLimits,
      month,
      year,
    });

    await saveSchedule(month, year, result);

    setPlan(result); // 👈 sofort anzeigen
  }

  return (
    <div style={{ marginTop: 30 }}>
      <button
        onClick={createPlan}
        style={{ padding: "10px 16px", fontWeight: "bold" }}
      >
        Plan erstellen
      </button>

      {plan.length > 0 && (
        <>
          <h2 style={{ marginTop: 20 }}>Dienstplan</h2>

          <table border="1" cellPadding="6">
            <thead>
              <tr>
                <th>Datum</th>
                <th>Arbeiter</th>
              </tr>
            </thead>
            <tbody>
              {plan.map((p, i) => (
                <tr key={i}>
                  <td>{p.date}</td>
                  <td>{p.worker}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </>
      )}
    </div>
  );
}