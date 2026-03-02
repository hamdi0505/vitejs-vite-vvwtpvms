import { useEffect, useState } from "react";
import dayjs from "dayjs";
import "dayjs/locale/de";
import { getGermanHolidays } from "../services/holidayService";
import {
  getClosedOverrides,
  saveClosedDay,
  deleteClosedOverride,
  getDefaultClosedWeekdays,
  saveDefaultClosedWeekday,
} from "../services/supabaseService";

dayjs.locale("de");

const weekdayNames = [
  "Sonntag",
  "Montag",
  "Dienstag",
  "Mittwoch",
  "Donnerstag",
  "Freitag",
  "Samstag",
];

export default function ClosedDaysTable({ month, year }) {
  const [days, setDays] = useState([]);
  const [visible, setVisible] = useState(false);
  const [closedWeekdays, setClosedWeekdays] = useState(Array(7).fill(false));
  const [hasHolidays, setHasHolidays] = useState(false);

  useEffect(() => {
    loadWeekdayDefaults();
  }, []);

  useEffect(() => {
    if (!month || !year) return;
    generateDays();
  }, [month, year, closedWeekdays]);

  async function loadWeekdayDefaults() {
    const data = await getDefaultClosedWeekdays();
    const arr = Array(7).fill(false);

    data.forEach((d) => {
      if (d.is_closed) arr[d.weekday] = true;
    });

    setClosedWeekdays(arr);
  }

  async function toggleWeekday(index) {
    const updated = [...closedWeekdays];
    updated[index] = !updated[index];
    setClosedWeekdays(updated);
    await saveDefaultClosedWeekday(index, updated[index]);
  }

  async function generateDays() {
    const holidays = getGermanHolidays(year);
    const daysInMonth = dayjs(`${year}-${month}-01`).daysInMonth();
    const overrides = await getClosedOverrides(month, year);

    // prüfen ob dieser Monat Feiertage hat
    const monthHasHoliday = holidays.some(
      (h) => dayjs(h.date).month() + 1 === month
    );
    setHasHolidays(monthHasHoliday);

    const result = [];

    for (let d = 1; d <= daysInMonth; d++) {
      const date = dayjs(`${year}-${month}-${d}`);
      const iso = date.format("YYYY-MM-DD");

      const holiday = holidays.find((h) => h.date === iso);

      const defaultClosed = closedWeekdays[date.day()];
      const override = overrides.find((o) => o.date === iso);

      result.push({
        date: iso,
        weekday: date.format("dddd"),
        holidayName: holiday ? holiday.name : "",
        closed: override ? override.is_closed : defaultClosed,
      });
    }

    setDays(result);
  }

  async function toggleClosed(index) {
    const updated = [...days];
    const day = updated[index];

    const newStatus = !day.closed;
    day.closed = newStatus;
    setDays(updated);

    if (newStatus === false) {
      await deleteClosedOverride(day.date);
    } else {
      await saveClosedDay(day.date, true);
    }
  }

  if (!month) return null;

  return (
    <div style={{ marginTop: 30 }}>
      <button
        onClick={() => setVisible(!visible)}
        style={{
          padding: "8px 14px",
          fontWeight: "bold",
          position: "relative",
        }}
      >
        {visible ? "Geschlossene Tage ausblenden" : "Geschlossene Tage anzeigen"}

        {hasHolidays && (
          <span
            title="Dieser Monat enthält Feiertage"
            style={{
              color: "orange",
              marginLeft: 8,
              fontWeight: "bold",
            }}
          >
            ⚠️
          </span>
        )}
      </button>

      {visible && (
        <>
          <div style={{ marginTop: 15 }}>
            <table border="1" cellPadding="6">
              <thead>
                <tr>
                  <th>Datum</th>
                  <th>Wochentag</th>
                  <th>Feiertag</th>
                  <th>Status</th>
                </tr>
              </thead>
              <tbody>
                {days.map((d, i) => (
                  <tr key={d.date}>
                    <td>{d.date}</td>
                    <td style={{ textTransform: "capitalize" }}>
                      {d.weekday}
                    </td>
                    <td>{d.holidayName}</td>
                    <td>
                      <button onClick={() => toggleClosed(i)}>
                        {d.closed ? "Geschlossen" : "Offen"}
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>

          <div style={{ marginTop: 20 }}>
            <h3>Automatisch geschlossene Wochentage</h3>

            {weekdayNames.map((name, i) => (
              <label key={i} style={{ display: "block" }}>
                <input
                  type="checkbox"
                  checked={closedWeekdays[i]}
                  onChange={() => toggleWeekday(i)}
                />
                {" "}{name}
              </label>
            ))}
          </div>
        </>
      )}
    </div>
  );
}