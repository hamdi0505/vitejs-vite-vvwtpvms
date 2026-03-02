import { useEffect, useState } from "react";
import {
  getWeekdaySettings,
  saveWeekdaySetting,
} from "../services/supabaseService";

const weekdays = [
  "Sonntag",
  "Montag",
  "Dienstag",
  "Mittwoch",
  "Donnerstag",
  "Freitag",
  "Samstag",
];

export default function WeekdaySettings() {
  const [values, setValues] = useState(Array(7).fill(0));
  const [visible, setVisible] = useState(false);

  useEffect(() => {
    loadSettings();
  }, []);

  async function loadSettings() {
    const data = await getWeekdaySettings();
    if (!data) return;

    const arr = Array(7).fill(0);

    data.forEach((d) => {
      arr[d.weekday] = d.max_workers;
    });

    setValues(arr);
  }

  function handleChange(index, value) {
    const updated = [...values];
    updated[index] = value;
    setValues(updated);
  }

  async function save(index) {
    await saveWeekdaySetting(index, values[index]);
  }

  return (
    <div style={{ marginTop: 30 }}>
      <button
        onClick={() => setVisible(!visible)}
        style={{ padding: "8px 14px", fontWeight: "bold" }}
      >
        {visible
          ? "Wochentageinstellungen ausblenden"
          : "Max. Arbeiter pro Wochentag"}
      </button>

      {visible && (
        <table border="1" cellPadding="6" style={{ marginTop: 15 }}>
          <thead>
            <tr>
              <th>Wochentag</th>
              <th>Max Arbeiter</th>
              <th>Speichern</th>
            </tr>
          </thead>
          <tbody>
            {weekdays.map((day, i) => (
              <tr key={i}>
                <td>{day}</td>
                <td>
                  <input
                    type="number"
                    min="0"
                    value={values[i]}
                    onChange={(e) =>
                      handleChange(i, Number(e.target.value))
                    }
                    style={{ width: 60 }}
                  />
                </td>
                <td>
                  <button onClick={() => save(i)}>Speichern</button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      )}
    </div>
  );
}