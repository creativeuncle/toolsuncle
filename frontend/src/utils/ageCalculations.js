export function parseDateLocal(str) {
  if (!str) return null;
  const [y, m, d] = str.split("-").map(Number);
  if (!y || !m || !d) return null;
  return new Date(y, m - 1, d);
}

export function combineDateTime(dateStr, timeStr) {
  const date = parseDateLocal(dateStr);
  if (!date) return null;
  if (timeStr) {
    const [h, min] = timeStr.split(":").map(Number);
    date.setHours(h || 0, min || 0, 0, 0);
  } else {
    date.setHours(0, 0, 0, 0);
  }
  return date;
}

export function isLeapYear(year) {
  return (year % 4 === 0 && year % 100 !== 0) || year % 400 === 0;
}

export function daysInMonth(year, monthIndex) {
  return new Date(year, monthIndex + 1, 0).getDate();
}

export function diffYMD(from, to) {
  if (to < from) return { years: 0, months: 0, days: 0 };
  let years = to.getFullYear() - from.getFullYear();
  let months = to.getMonth() - from.getMonth();
  let days = to.getDate() - from.getDate();

  if (days < 0) {
    months -= 1;
    const prevMonth = to.getMonth() === 0 ? 11 : to.getMonth() - 1;
    const prevYear = to.getMonth() === 0 ? to.getFullYear() - 1 : to.getFullYear();
    days += daysInMonth(prevYear, prevMonth);
  }
  if (months < 0) {
    years -= 1;
    months += 12;
  }
  return { years, months, days };
}

export function msBreakdown(totalMs) {
  const totalSeconds = Math.floor(totalMs / 1000);
  const days = Math.floor(totalSeconds / 86400);
  const hours = Math.floor((totalSeconds % 86400) / 3600);
  const minutes = Math.floor((totalSeconds % 3600) / 60);
  const seconds = totalSeconds % 60;
  return { days, hours, minutes, seconds };
}

export function compactNumber(n) {
  const abs = Math.abs(n);
  if (abs >= 1e9) return `${(n / 1e9).toFixed(1)}B`;
  if (abs >= 1e6) return `${(n / 1e6).toFixed(1)}M`;
  if (abs >= 1e3) return `${(n / 1e3).toFixed(1)}K`;
  return Math.round(n).toLocaleString();
}

const ZODIAC_SIGNS = [
  { sign: "Capricorn", symbol: "♑", element: "Earth", trait: "Disciplined, responsible, ambitious", from: [12, 22], to: [1, 19] },
  { sign: "Aquarius", symbol: "♒", element: "Air", trait: "Independent, original, humanitarian", from: [1, 20], to: [2, 18] },
  { sign: "Pisces", symbol: "♓", element: "Water", trait: "Compassionate, artistic, intuitive", from: [2, 19], to: [3, 20] },
  { sign: "Aries", symbol: "♈", element: "Fire", trait: "Courageous, energetic, confident", from: [3, 21], to: [4, 19] },
  { sign: "Taurus", symbol: "♉", element: "Earth", trait: "Reliable, patient, devoted", from: [4, 20], to: [5, 20] },
  { sign: "Gemini", symbol: "♊", element: "Air", trait: "Curious, adaptable, witty", from: [5, 21], to: [6, 20] },
  { sign: "Cancer", symbol: "♋", element: "Water", trait: "Nurturing, intuitive, protective", from: [6, 21], to: [7, 22] },
  { sign: "Leo", symbol: "♌", element: "Fire", trait: "Confident, generous, warm-hearted", from: [7, 23], to: [8, 22] },
  { sign: "Virgo", symbol: "♍", element: "Earth", trait: "Analytical, practical, hardworking", from: [8, 23], to: [9, 22] },
  { sign: "Libra", symbol: "♎", element: "Air", trait: "Diplomatic, fair-minded, social", from: [9, 23], to: [10, 22] },
  { sign: "Scorpio", symbol: "♏", element: "Water", trait: "Passionate, resourceful, brave", from: [10, 23], to: [11, 21] },
  { sign: "Sagittarius", symbol: "♐", element: "Fire", trait: "Adventurous, optimistic, honest", from: [11, 22], to: [12, 21] },
];

export function getZodiac(month, day) {
  const found = ZODIAC_SIGNS.find(({ from, to }) => {
    if (from[0] === to[0]) return month === from[0] && day >= from[1] && day <= to[1];
    if (month === from[0]) return day >= from[1];
    if (month === to[0]) return day <= to[1];
    return false;
  });
  return found || ZODIAC_SIGNS[0];
}

const CHINESE_ZODIAC = [
  { animal: "Rat", emoji: "🐀" },
  { animal: "Ox", emoji: "🐂" },
  { animal: "Tiger", emoji: "🐅" },
  { animal: "Rabbit", emoji: "🐇" },
  { animal: "Dragon", emoji: "🐉" },
  { animal: "Snake", emoji: "🐍" },
  { animal: "Horse", emoji: "🐎" },
  { animal: "Goat", emoji: "🐐" },
  { animal: "Monkey", emoji: "🐒" },
  { animal: "Rooster", emoji: "🐓" },
  { animal: "Dog", emoji: "🐕" },
  { animal: "Pig", emoji: "🐖" },
];

export function getChineseZodiac(year) {
  const index = ((year - 1900) % 12 + 12) % 12;
  return CHINESE_ZODIAC[index];
}

const BIRTHSTONES = [
  "Garnet", "Amethyst", "Aquamarine", "Diamond", "Emerald", "Pearl",
  "Ruby", "Peridot", "Sapphire", "Opal", "Topaz", "Turquoise",
];
export function getBirthstone(monthIndex) {
  return BIRTHSTONES[monthIndex];
}

const BIRTH_FLOWERS = [
  "Carnation", "Violet", "Daffodil", "Daisy", "Lily of the Valley", "Rose",
  "Larkspur", "Gladiolus", "Aster", "Marigold", "Chrysanthemum", "Narcissus",
];
export function getBirthFlower(monthIndex) {
  return BIRTH_FLOWERS[monthIndex];
}

export function getSeason(monthIndex) {
  if ([11, 0, 1].includes(monthIndex)) return { name: "Winter", emoji: "❄️" };
  if ([2, 3, 4].includes(monthIndex)) return { name: "Spring", emoji: "🌱" };
  if ([5, 6, 7].includes(monthIndex)) return { name: "Summer", emoji: "☀️" };
  return { name: "Autumn", emoji: "🍂" };
}

export function getGeneration(year) {
  if (year >= 2013) return "Generation Alpha";
  if (year >= 1997) return "Generation Z";
  if (year >= 1981) return "Millennials";
  if (year >= 1965) return "Generation X";
  if (year >= 1946) return "Baby Boomers";
  if (year >= 1928) return "Silent Generation";
  return "Greatest Generation";
}

const NURSERY_RHYMES = [
  "Sunday's child is bonny and blithe, and good and gay",
  "Monday's child is fair of face",
  "Tuesday's child is full of grace",
  "Wednesday's child is full of woe",
  "Thursday's child has far to go",
  "Friday's child is loving and giving",
  "Saturday's child works hard for a living",
];
export function getNurseryRhyme(dayOfWeek) {
  return NURSERY_RHYMES[dayOfWeek];
}

const WEEKDAYS = ["Sunday", "Monday", "Tuesday", "Wednesday", "Thursday", "Friday", "Saturday"];
export function getWeekdayName(dayOfWeek) {
  return WEEKDAYS[dayOfWeek];
}

export function dogYears(ageYears) {
  if (ageYears <= 1) return ageYears * 15;
  if (ageYears <= 2) return 15 + (ageYears - 1) * 9;
  return 24 + (ageYears - 2) * 5;
}

export function catYears(ageYears) {
  if (ageYears <= 1) return ageYears * 15;
  if (ageYears <= 2) return 15 + (ageYears - 1) * 9;
  return 24 + (ageYears - 2) * 4;
}

export function koreanAge(birthYear, targetYear) {
  return targetYear - birthYear + 1;
}

export function getNextBirthday(birth, target) {
  const thisYear = new Date(target.getFullYear(), birth.getMonth(), birth.getDate());
  if (thisYear >= target) return thisYear;
  return new Date(target.getFullYear() + 1, birth.getMonth(), birth.getDate());
}

export function getLastBirthday(birth, target) {
  const thisYear = new Date(target.getFullYear(), birth.getMonth(), birth.getDate());
  if (thisYear <= target) return thisYear;
  return new Date(target.getFullYear() - 1, birth.getMonth(), birth.getDate());
}

export function getHalfBirthday(birth, target) {
  const lastBday = getLastBirthday(birth, target);
  const half = new Date(lastBday);
  half.setMonth(half.getMonth() + 6);
  if (half < target) half.setFullYear(half.getFullYear() + 1);
  return half;
}

export const PLANETS = [
  { name: "Mercury", emoji: "☿️", orbitalDays: 87.97 },
  { name: "Venus", emoji: "♀️", orbitalDays: 224.7 },
  { name: "Earth", emoji: "🌍", orbitalDays: 365.25 },
  { name: "Mars", emoji: "♂️", orbitalDays: 686.98 },
  { name: "Jupiter", emoji: "♃", orbitalDays: 4332.59 },
  { name: "Saturn", emoji: "♄", orbitalDays: 10759.22 },
  { name: "Uranus", emoji: "⛢", orbitalDays: 30688.5 },
  { name: "Neptune", emoji: "♆", orbitalDays: 60182 },
];

export const LEGAL_MILESTONES = [
  { age: 5, label: "Aadhaar Enrollment" },
  { age: 10, label: "Bank Account" },
  { age: 14, label: "End of Child Labor" },
  { age: 16, label: "2-Wheeler License" },
  { age: 18, label: "Voting / 4-Wheeler / Marriage (M)" },
  { age: 21, label: "Marriage (F in some states)" },
  { age: 25, label: "Drinking (some states)" },
  { age: 58, label: "State Govt Retirement" },
  { age: 60, label: "Central Govt Retirement" },
  { age: 65, label: "Judiciary Retirement" },
];

export const LIFE_MILESTONES = [
  { label: "1,000 Days", unit: "days", value: 1000 },
  { label: "5,000 Days", unit: "days", value: 5000 },
  { label: "10,000 Days", unit: "days", value: 10000 },
  { label: "20,000 Days", unit: "days", value: 20000 },
  { label: "1 Billion Seconds", unit: "seconds", value: 1_000_000_000 },
  { label: "30,000 Days", unit: "days", value: 30000 },
];

export const GOVT_EXAMS = [
  { name: "SSC CGL", org: "SSC", category: "SSC", minAge: 18, maxAge: 32, relax: { obc: 3, scst: 5, pwd: 10, exsm: 5 } },
  { name: "SSC CHSL", org: "SSC", category: "SSC", minAge: 18, maxAge: 27, relax: { obc: 3, scst: 5, pwd: 10, exsm: 5 } },
  { name: "SSC MTS", org: "SSC", category: "SSC", minAge: 18, maxAge: 25, relax: { obc: 3, scst: 5, pwd: 10, exsm: 5 } },
  { name: "UPSC CSE", org: "UPSC", category: "UPSC", minAge: 21, maxAge: 32, relax: { obc: 3, scst: 5, pwd: 10, exsm: 5 } },
  { name: "UPSC CDS", org: "UPSC", category: "UPSC", minAge: 19, maxAge: 25 },
  { name: "IBPS PO", org: "Banking", category: "Banking", minAge: 20, maxAge: 30, relax: { obc: 3, scst: 5, pwd: 10, exsm: 5 } },
  { name: "IBPS Clerk", org: "Banking", category: "Banking", minAge: 20, maxAge: 28, relax: { obc: 3, scst: 5, pwd: 10, exsm: 5 } },
  { name: "SBI PO", org: "Banking", category: "Banking", minAge: 21, maxAge: 30, relax: { obc: 3, scst: 5, pwd: 10, exsm: 5 } },
  { name: "SBI Clerk", org: "Banking", category: "Banking", minAge: 20, maxAge: 28, relax: { obc: 3, scst: 5, pwd: 10, exsm: 5 } },
  { name: "RBI Grade B", org: "Banking", category: "Banking", minAge: 21, maxAge: 30, relax: { obc: 3, scst: 5, pwd: 10, exsm: 5 } },
  { name: "Railway RRB NTPC", org: "Railway", category: "Railway", minAge: 18, maxAge: 33, relax: { obc: 3, scst: 5, pwd: 10, exsm: 5 } },
  { name: "Railway RRB Group D", org: "Railway", category: "Railway", minAge: 18, maxAge: 33, relax: { obc: 3, scst: 5, pwd: 10, exsm: 5 } },
  { name: "Indian Army GD", org: "Defence", category: "Defence", minAge: 17, maxAge: 23 },
  { name: "NDA", org: "Defence", category: "Defence", minAge: 16, maxAge: 19 },
  { name: "CDS", org: "Defence", category: "Defence", minAge: 19, maxAge: 25 },
  { name: "TNPSC Group 1", org: "State", category: "State", minAge: 21, maxAge: 32, relax: { obc: 2, scst: 5, pwd: 10, exsm: 5 } },
  { name: "UPPSC PCS", org: "State", category: "State", minAge: 21, maxAge: 40, relax: { obc: 3, scst: 5, pwd: 15, exsm: 5 } },
];

export function examEligibility(age, exam) {
  if (age < exam.minAge) return { status: "not-eligible" };
  if (age <= exam.maxAge) return { status: "eligible" };
  if (!exam.relax) return { status: "not-eligible" };

  const pwdMax = exam.maxAge + (exam.relax.pwd || 0);
  const otherMax = Math.max(exam.relax.obc || 0, exam.relax.scst || 0, exam.relax.exsm || 0) + exam.maxAge;

  if (age <= otherMax) return { status: "obc-scst" };
  if (age <= pwdMax) return { status: "pwd-only" };
  return { status: "not-eligible" };
}
