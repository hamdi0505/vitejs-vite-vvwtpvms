import dayjs from "dayjs";

// Ostersonntag berechnen
function getEasterDate(year) {
  const f = Math.floor,
    G = year % 19,
    C = f(year / 100),
    H = (C - f(C / 4) - f((8 * C + 13) / 25) + 19 * G + 15) % 30,
    I = H - f(H / 28) * (1 - f(H / 28) * f(29 / (H + 1)) * f((21 - G) / 11)),
    J = (year + f(year / 4) + I + 2 - C + f(C / 4)) % 7,
    L = I - J,
    month = 3 + f((L + 40) / 44),
    day = L + 28 - 31 * f(month / 4);

  return dayjs(`${year}-${month}-${day}`);
}

function format(d) {
  return dayjs(d).format("YYYY-MM-DD");
}

// deutsche Feiertage
export function getGermanHolidays(year) {
  const easter = getEasterDate(year);

  return [
    { date: `${year}-01-01`, name: "Neujahr" },
    { date: format(easter.subtract(2, "day")), name: "Karfreitag" },
    { date: format(easter.add(1, "day")), name: "Ostermontag" },
    { date: `${year}-05-01`, name: "Tag der Arbeit" },
    { date: format(easter.add(39, "day")), name: "Christi Himmelfahrt" },
    { date: format(easter.add(50, "day")), name: "Pfingstmontag" },
    { date: `${year}-10-03`, name: "Tag der Deutschen Einheit" },
    { date: `${year}-12-25`, name: "1. Weihnachtstag" },
    { date: `${year}-12-26`, name: "2. Weihnachtstag" },
  ];
}