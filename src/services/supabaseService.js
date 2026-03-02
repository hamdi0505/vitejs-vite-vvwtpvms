import { supabase } from "../lib/supabaseClient";

/* =========================
   WORKERS
========================= */

export async function getWorkers() {
  const { data, error } = await supabase.from("workers").select("*");
  if (error) throw error;
  return data;
}

export async function addWorker(name) {
  const { error } = await supabase.from("workers").insert({
    name,
    monthly_hours: 160,
    max_hours_per_day: 8,
  });
  if (error) throw error;
}

export async function updateWorker(id, hours, maxDay) {
  const { error } = await supabase
    .from("workers")
    .update({
      monthly_hours: hours,
      max_hours_per_day: maxDay,
    })
    .eq("id", id);

  if (error) throw error;
}

export async function deleteWorker(id) {
  const { error } = await supabase
    .from("workers")
    .delete()
    .eq("id", id);

  if (error) throw error;
}

/* =========================
   CLOSED DAYS (manuelle Änderungen)
========================= */

export async function getClosedOverrides(month, year) {
  const start = `${year}-${String(month).padStart(2, "0")}-01`;
  const end = `${year}-${String(month).padStart(2, "0")}-31`;

  const { data, error } = await supabase
    .from("closed_days")
    .select("*")
    .gte("date", start)
    .lte("date", end);

  if (error) throw error;
  return data;
}

export async function saveClosedDay(date, isClosed) {
  const { data } = await supabase
    .from("closed_days")
    .select("*")
    .eq("date", date)
    .maybeSingle();

  if (data) {
    await supabase
      .from("closed_days")
      .update({ is_closed: isClosed })
      .eq("date", date);
  } else {
    await supabase.from("closed_days").insert({
      date,
      is_closed: isClosed,
    });
  }
}

export async function deleteClosedOverride(date) {
  await supabase.from("closed_days").delete().eq("date", date);
}

/* =========================
   DEFAULT CLOSED WEEKDAYS
========================= */

export async function getDefaultClosedWeekdays() {
  const { data, error } = await supabase.from("settings").select("*");
  if (error) throw error;
  return data;
}

export async function saveDefaultClosedWeekday(weekday, closed) {
  const { data } = await supabase
    .from("settings")
    .select("*")
    .eq("weekday", weekday)
    .maybeSingle();

  if (data) {
    await supabase
      .from("settings")
      .update({ is_closed: closed })
      .eq("weekday", weekday);
  } else {
    await supabase
      .from("settings")
      .insert({ weekday, is_closed: closed });
  }
}

/* =========================
   SICK DAYS
========================= */

export async function getSickDays(workerId) {
  const { data, error } = await supabase
    .from("sick_days")
    .select("*")
    .eq("worker_id", workerId);

  if (error) throw error;
  return data;
}

export async function addSickDay(workerId, date) {
  const { error } = await supabase.from("sick_days").insert({
    worker_id: workerId,
    date,
  });
  if (error) throw error;
}

export async function deleteSickDay(workerId, date) {
  const { error } = await supabase
    .from("sick_days")
    .delete()
    .eq("worker_id", workerId)
    .eq("date", date);

  if (error) throw error;
}

/* =========================
   WEEKDAY LIMITS
========================= */

export async function getWeekdaySettings() {
  const { data, error } = await supabase.from("settings").select("*");
  if (error) throw error;
  return data;
}

/* =========================
   SCHEDULE
========================= */

export async function saveSchedule(month, year, entries) {
  const { data: old } = await supabase
    .from("schedules")
    .select("id")
    .eq("month", month)
    .eq("year", year)
    .maybeSingle();

  if (old) {
    await supabase
      .from("schedule_entries")
      .delete()
      .eq("schedule_id", old.id);

    await supabase.from("schedules").delete().eq("id", old.id);
  }

  const { data: schedule, error } = await supabase
    .from("schedules")
    .insert({ month, year })
    .select()
    .single();

  if (error) {
    console.error(error);
    return;
  }

  const rows = entries.map((e) => ({
    schedule_id: schedule.id,
    worker_id: e.workerId,
    date: e.date,
  }));

  const { error: insertError } = await supabase
    .from("schedule_entries")
    .insert(rows);

  if (insertError) console.error(insertError);
}

export async function loadSchedule(month, year) {
  const { data: schedule } = await supabase
    .from("schedules")
    .select("*")
    .eq("month", month)
    .eq("year", year)
    .maybeSingle();

  if (!schedule) return null;

  const { data } = await supabase
    .from("schedule_entries")
    .select("date, workers(name)")
    .eq("schedule_id", schedule.id);

  return data.map((e) => ({
    date: e.date,
    worker: e.workers?.name ?? "",
  }));
}
// speichern max arbeiter pro wochentag
export async function saveWeekdaySetting(weekday, maxWorkers) {
  const { data } = await supabase
    .from("settings")
    .select("*")
    .eq("weekday", weekday)
    .maybeSingle();

  if (data) {
    await supabase
      .from("settings")
      .update({ max_workers: maxWorkers })
      .eq("weekday", weekday);
  } else {
    await supabase
      .from("settings")
      .insert({ weekday, max_workers: maxWorkers });
  }
}