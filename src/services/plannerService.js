import dayjs from "dayjs";

function shuffle(array) {
  return array.sort(() => Math.random() - 0.5);
}

export function generatePlan({
  workers,
  closedDays,
  sickDays,
  weekdayLimits,
  month,
  year,
}) {
  const daysInMonth = dayjs(`${year}-${month}-01`).daysInMonth();

  let availableDays = [];

  for (let d = 1; d <= daysInMonth; d++) {
    const date = dayjs(`${year}-${month}-${d}`).format("YYYY-MM-DD");
    const weekday = dayjs(date).day();

    const isClosed = closedDays.includes(date);
    const maxWorkers = weekdayLimits[weekday] ?? 0;

    if (!isClosed && maxWorkers > 0) {
      availableDays.push({
        date,
        weekday,
        slots: maxWorkers,
      });
    }
  }

  availableDays = shuffle(availableDays);

  const workerNeeds = workers.map((w) => ({
    ...w,
    remaining: Math.ceil(w.monthly_hours / w.max_hours_per_day),
  }));

  const plan = [];

  for (const day of availableDays) {
    let slots = day.slots;
    const shuffledWorkers = shuffle([...workerNeeds]);

    for (const worker of shuffledWorkers) {
      if (slots === 0) break;
      if (worker.remaining <= 0) continue;

      const sick = sickDays.find(
        (s) => s.worker_id === worker.id && s.date === day.date
      );

      if (sick) continue;

      plan.push({
        date: day.date,
        worker: worker.name,
        workerId: worker.id,
      });

      worker.remaining--;
      slots--;
    }
  }

  return plan;
}