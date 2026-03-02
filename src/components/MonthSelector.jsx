import { useState } from "react";

export default function MonthSelector({ onChange }) {
  const now = new Date();

  const [month, setMonth] = useState(now.getMonth() + 1);
  const [year, setYear] = useState(now.getFullYear());

  function update(m, y) {
    setMonth(m);
    setYear(y);
    onChange(m, y);
  }

  return (
    <div style={{ marginBottom: 20 }}>
      <h2>Monat wählen</h2>

      <select
        value={month}
        onChange={(e) => update(Number(e.target.value), year)}
      >
        {[...Array(12)].map((_, i) => (
          <option key={i} value={i + 1}>
            {i + 1}
          </option>
        ))}
      </select>

      <input
        type="number"
        value={year}
        onChange={(e) => update(month, Number(e.target.value))}
        style={{ marginLeft: 10, width: 80 }}
      />
    </div>
  );
}