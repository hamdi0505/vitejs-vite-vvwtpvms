import { supabase } from "../lib/supabaseClient";

// ---------- WORKERS ----------

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
  const { error } = await supabase.from("workers").delete().eq("id", id);
  if (error) throw error;
}

// ---------- CLOSED DAYS ----------

// Monat korrekt formatieren
function formatMonth(month) {
  return String(month).padStart(2, "0");
}

// Anzahl Tage im Monat berechnen
function getDaysInMonth(month, year) {
  return new Date(year, month, 0).getDate();
}

// lade gespeicherte Änderungen
export async function getClosedOverrides(month, year) {
  const m = formatMonth(month);
  const lastDay = getDaysInMonth(month, year);

  const start = `${year}-${m}-01`;
  const end = `${year}-${m}-${lastDay}`;

  const { data, error } = await supabase
    .from("closed_days")
    .select("*")
    .gte("date", start)
    .lte("date", end);

  if (error) throw error;
  return data;
}

// speichern oder aktualisieren
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

// löschen wenn wieder Standardzustand
export async function deleteClosedOverride(date) {
  await supabase.from("closed_days").delete().eq("date", date);
}