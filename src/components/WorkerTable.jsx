import { useEffect, useState } from "react";
import {
  getWorkers,
  addWorker,
  updateWorker,
  deleteWorker,
} from "../services/supabaseService";

export default function WorkerTable() {
  const [workers, setWorkers] = useState([]);
  const [name, setName] = useState("");
  const [editingId, setEditingId] = useState(null);
  const [editHours, setEditHours] = useState("");
  const [editMaxDay, setEditMaxDay] = useState("");
  const [visible, setVisible] = useState(false);

  async function loadWorkers() {
    const data = await getWorkers();
    setWorkers(data);
  }

  async function handleAdd() {
    if (!name) return;
    await addWorker(name);
    setName("");
    loadWorkers();
  }

  function startEdit(w) {
    setEditingId(w.id);
    setEditHours(w.monthly_hours);
    setEditMaxDay(w.max_hours_per_day);
  }

  async function saveEdit(id) {
    await updateWorker(id, editHours, editMaxDay);
    setEditingId(null);
    loadWorkers();
  }

  async function handleDelete(id) {
    if (!confirm("Arbeiter löschen?")) return;
    await deleteWorker(id);
    loadWorkers();
  }

  useEffect(() => {
    loadWorkers();
  }, []);

  return (
    <div style={{ marginTop: 30 }}>
      <button
        onClick={() => setVisible(!visible)}
        style={{
          padding: "8px 14px",
          cursor: "pointer",
          fontWeight: "bold",
        }}
      >
        {visible ? "Arbeiter ausblenden" : "Arbeiter anzeigen"}
      </button>

      {visible && (
        <div style={{ marginTop: 15 }}>
          <h3>Arbeiter hinzufügen</h3>

          <input
            placeholder="Name"
            value={name}
            onChange={(e) => setName(e.target.value)}
            style={{ marginRight: 10 }}
          />
          <button onClick={handleAdd}>Hinzufügen</button>

          <table border="1" cellPadding="6" style={{ marginTop: 15 }}>
            <thead>
              <tr>
                <th>Name</th>
                <th>Monatsstunden</th>
                <th>Max/Tag</th>
                <th>Aktionen</th>
              </tr>
            </thead>
            <tbody>
              {workers.map((w) => (
                <tr key={w.id}>
                  <td>{w.name}</td>

                  <td>
                    {editingId === w.id ? (
                      <input
                        type="number"
                        value={editHours}
                        onChange={(e) => setEditHours(e.target.value)}
                      />
                    ) : (
                      w.monthly_hours
                    )}
                  </td>

                  <td>
                    {editingId === w.id ? (
                      <input
                        type="number"
                        value={editMaxDay}
                        onChange={(e) => setEditMaxDay(e.target.value)}
                      />
                    ) : (
                      w.max_hours_per_day
                    )}
                  </td>

                  <td>
                    {editingId === w.id ? (
                      <>
                        <button onClick={() => saveEdit(w.id)}>
                          Speichern
                        </button>
                        <button onClick={() => setEditingId(null)}>
                          Abbrechen
                        </button>
                      </>
                    ) : (
                      <>
                        <button onClick={() => startEdit(w)}>
                          Bearbeiten
                        </button>
                        <button onClick={() => handleDelete(w.id)}>
                          Löschen
                        </button>
                      </>
                    )}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
    </div>
  );
}