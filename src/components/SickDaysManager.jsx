import { useEffect, useState } from "react";
import {
  getWorkers,
  getSickDays,
  addSickDay,
  deleteSickDay,
} from "../services/supabaseService";

export default function SickDaysManager() {
  const [workers, setWorkers] = useState([]);
  const [selectedWorker, setSelectedWorker] = useState("");
  const [sickDays, setSickDays] = useState([]);
  const [date, setDate] = useState("");
  const [visible, setVisible] = useState(false);

  useEffect(() => {
    loadWorkers();
  }, []);

  async function loadWorkers() {
    const data = await getWorkers();
    setWorkers(data);
  }

  async function loadSickDays(workerId) {
    const data = await getSickDays(workerId);
    setSickDays(data);
  }

  async function handleWorkerChange(id) {
    setSelectedWorker(id);
    loadSickDays(id);
  }

  async function addDay() {
    if (!date || !selectedWorker) return;

    await addSickDay(selectedWorker, date);
    loadSickDays(selectedWorker);
    setDate("");
  }

  async function removeDay(d) {
    await deleteSickDay(selectedWorker, d);
    loadSickDays(selectedWorker);
  }

  return (
    <div style={{ marginTop: 30 }}>
      <button
        onClick={() => setVisible(!visible)}
        style={{ padding: "8px 14px", fontWeight: "bold" }}
      >
        {visible ? "Kranktage ausblenden" : "Kranktage verwalten"}
      </button>

      {visible && (
        <div style={{ marginTop: 15 }}>
          <h3>Arbeiter wählen</h3>

          <select
            value={selectedWorker}
            onChange={(e) => handleWorkerChange(e.target.value)}
          >
            <option value="">-- wählen --</option>
            {workers.map((w) => (
              <option key={w.id} value={w.id}>
                {w.name}
              </option>
            ))}
          </select>

          {selectedWorker && (
            <>
              <h3 style={{ marginTop: 15 }}>Kranktag hinzufügen</h3>

              <input
                type="date"
                value={date}
                onChange={(e) => setDate(e.target.value)}
              />
              <button onClick={addDay} style={{ marginLeft: 10 }}>
                hinzufügen
              </button>

              <h3 style={{ marginTop: 20 }}>Gespeicherte Kranktage</h3>

              <ul>
                {sickDays.map((d) => (
                  <li key={d.date}>
                    {d.date}
                    <button
                      onClick={() => removeDay(d.date)}
                      style={{ marginLeft: 10 }}
                    >
                      löschen
                    </button>
                  </li>
                ))}
              </ul>
            </>
          )}
        </div>
      )}
    </div>
  );
}