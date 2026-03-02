import { useState } from "react";
import WorkerTable from "./components/WorkerTable";
import MonthSelector from "./components/MonthSelector";
import ClosedDaysTable from "./components/ClosedDaysTable";
import SickDaysManager from "./components/SickDaysManager";
import WeekdaySettings from "./components/WeekdaySettings";
import PlanGenerator from "./components/PlanGenerator";

export default function App() {
  const [selectedMonth, setSelectedMonth] = useState(null);

  function handleMonthChange(month, year) {
    setSelectedMonth({ month, year });
  }

  return (
    <div style={{ padding: 20, fontFamily: "Arial" }}>
      <h1>Monatsplan</h1>

      <MonthSelector onChange={handleMonthChange} />

      {selectedMonth && (
        <>
          <p>
            Ausgewählt: {selectedMonth.month}/{selectedMonth.year}
          </p>

          <ClosedDaysTable
            month={selectedMonth.month}
            year={selectedMonth.year}
          />

          <PlanGenerator
            month={selectedMonth.month}
            year={selectedMonth.year}
          />
        </>
      )}

      <WorkerTable />
      <SickDaysManager />
      <WeekdaySettings />
    </div>
  );
}