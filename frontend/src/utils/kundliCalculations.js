import * as Astronomy from "astronomy-engine";

export const RASHIS = [
  "Aries", "Taurus", "Gemini", "Cancer", "Leo", "Virgo",
  "Libra", "Scorpio", "Sagittarius", "Capricorn", "Aquarius", "Pisces",
];

export const RASHI_LORDS = [
  "Mars", "Venus", "Mercury", "Moon", "Sun", "Mercury",
  "Venus", "Mars", "Jupiter", "Saturn", "Saturn", "Jupiter",
];

const RASHI_TATVA = [
  "Fire", "Earth", "Air", "Water", "Fire", "Earth",
  "Air", "Water", "Fire", "Earth", "Air", "Water",
];

const RASHI_VARNA = {
  Fire: "Kshatriya", Earth: "Vaishya", Air: "Shoodra", Water: "Brahmin",
};

const RASHI_PAYA = [
  "Copper", "Silver", "Gold", "Silver", "Copper", "Gold",
  "Silver", "Copper", "Gold", "Silver", "Copper", "Gold",
];

const RASHI_VASHYA = [
  "Chatushpada", "Chatushpada", "Maanav", "Jalachar", "Vanachar", "Maanav",
  "Maanav", "Keet", "Chatushpada (half)", "Chatushpada", "Maanav", "Jalachar",
];

export const NAKSHATRAS = [
  "Ashwini", "Bharani", "Krittika", "Rohini", "Mrigashira", "Ardra",
  "Punarvasu", "Pushya", "Ashlesha", "Magha", "Purva Phalguni", "Uttara Phalguni",
  "Hasta", "Chitra", "Swati", "Vishakha", "Anuradha", "Jyeshtha",
  "Mula", "Purva Ashadha", "Uttara Ashadha", "Shravana", "Dhanishta", "Shatabhisha",
  "Purva Bhadrapada", "Uttara Bhadrapada", "Revati",
];

const NAKSHATRA_LORD_CYCLE = ["Ketu", "Venus", "Sun", "Moon", "Mars", "Rahu", "Jupiter", "Saturn", "Mercury"];

const NAKSHATRA_YONI = [
  "Horse", "Elephant", "Sheep", "Serpent", "Serpent", "Dog",
  "Cat", "Sheep", "Cat", "Rat", "Rat", "Cow",
  "Buffalo", "Tiger", "Buffalo", "Tiger", "Deer", "Deer",
  "Dog", "Monkey", "Mongoose", "Monkey", "Lion", "Horse",
  "Lion", "Cow", "Elephant",
];

const NAKSHATRA_GAN = [
  "Dev", "Manushya", "Rakshasa", "Manushya", "Rakshasa", "Manushya",
  "Dev", "Dev", "Rakshasa", "Rakshasa", "Manushya", "Manushya",
  "Dev", "Rakshasa", "Dev", "Rakshasa", "Dev", "Rakshasa",
  "Rakshasa", "Manushya", "Manushya", "Dev", "Rakshasa", "Rakshasa",
  "Manushya", "Manushya", "Dev",
];

const NAKSHATRA_NADI = [
  "Aadi", "Madhya", "Antya", "Antya", "Madhya", "Aadi",
  "Aadi", "Madhya", "Antya", "Antya", "Madhya", "Aadi",
  "Aadi", "Madhya", "Antya", "Antya", "Madhya", "Aadi",
  "Aadi", "Madhya", "Antya", "Antya", "Madhya", "Aadi",
  "Aadi", "Madhya", "Antya",
];

const NAKSHATRA_STARTING_SOUND = [
  "Chu, Che, Cho, La", "Li, Lu, Le, Lo", "A, I, U, E", "O, Va, Vi, Vu",
  "Ve, Vo, Ka, Ki", "Ku, Gha, Chha, Ke", "Ke, Ko, Ha, Hi", "Hu, He, Ho, Da",
  "Di, Du, De, Do", "Ma, Mi, Mu, Me", "Mo, Ta, Ti, Tu", "Te, To, Pa, Pi",
  "Pu, Sha, Na, Tha", "Pe, Po, Ra, Ri", "Ru, Re, Ro, Ta", "Ti, Tu, Te, To",
  "Na, Ni, Nu, Ne", "No, Ya, Yi, Yu", "Ye, Yo, Bha, Bhi", "Bhu, Dha, Pha, Dha",
  "Bhe, Bho, Ja, Ji", "Ju, Je, Jo, Kha", "Ga, Gi, Gu, Ge", "Go, Sa, Si, Su",
  "Se, So, Da, Di", "Du, Tha, Jha, Da", "De, Do, Cha, Chi",
];

export const TITHI_NAMES = [
  "Pratipada", "Dwitiya", "Tritiya", "Chaturthi", "Panchami", "Shashthi",
  "Saptami", "Ashtami", "Navami", "Dashami", "Ekadashi", "Dwadashi",
  "Trayodashi", "Chaturdashi", "Purnima",
];

export const YOGA_NAMES = [
  "Vishkambha", "Preeti", "Ayushman", "Saubhagya", "Shobhana", "Atiganda",
  "Sukarma", "Dhriti", "Shoola", "Ganda", "Vriddhi", "Dhruva",
  "Vyaghata", "Harshana", "Vajra", "Siddhi", "Vyatipata", "Variyana",
  "Parigha", "Shiva", "Siddha", "Sadhya", "Shubha", "Shukla",
  "Brahma", "Indra", "Vaidhriti",
];

export const KARAN_NAMES = [
  "Bava", "Baalava", "Kaulav", "Taitila", "Gara", "Vanij", "Vishti",
];

export const DASHA_YEARS = {
  Ketu: 7, Venus: 20, Sun: 6, Moon: 10, Mars: 7,
  Rahu: 18, Jupiter: 16, Saturn: 19, Mercury: 17,
};
const DASHA_SEQUENCE = ["Ketu", "Venus", "Sun", "Moon", "Mars", "Rahu", "Jupiter", "Saturn", "Mercury"];

const NUMEROLOGY = {
  1: { color: "Orange, Gold", day: "Sunday", god: "Surya", metal: "Gold", stone: "Ruby", mantra: "Om Suryaya Namah", friendly: "2,3,9", neutral: "5,6", evil: "4,7,8" },
  2: { color: "White, Cream", day: "Monday", god: "Chandra", metal: "Silver", stone: "Pearl, Moonstone", mantra: "Om Chandraya Namah", friendly: "1,3,7", neutral: "5,6", evil: "4,8,9" },
  3: { color: "Yellow", day: "Thursday", god: "Brihaspati", metal: "Gold", stone: "Yellow Sapphire", mantra: "Om Gurave Namah", friendly: "1,9,5", neutral: "2,7", evil: "4,6,8" },
  4: { color: "Grey, Blue", day: "Sunday", god: "Rahu", metal: "Iron", stone: "Hessonite", mantra: "Om Rahave Namah", friendly: "1,2,7", neutral: "3,5,6", evil: "8,9" },
  5: { color: "Green", day: "Wednesday", god: "Budha", metal: "Bronze", stone: "Emerald", mantra: "Om Budhaya Namah", friendly: "1,2,3,4,6,9", neutral: "7,8", evil: "" },
  6: { color: "Blue, White", day: "Friday", god: "Shukra", metal: "Silver", stone: "Diamond, Opal", mantra: "Om Shum Shukray Namah", friendly: "4,3,9", neutral: "2,5,7", evil: "1,8" },
  7: { color: "Grey, Green", day: "Monday", god: "Ketu", metal: "Bronze", stone: "Cat's Eye", mantra: "Om Ketave Namah", friendly: "1,2,5", neutral: "4,6,9", evil: "3,8" },
  8: { color: "Black, Dark Blue", day: "Saturday", god: "Shani", metal: "Iron", stone: "Blue Sapphire", mantra: "Om Shanaischaraya Namah", friendly: "4,5", neutral: "3,7,9", evil: "1,2,6" },
  9: { color: "Red", day: "Tuesday", god: "Mangal", metal: "Copper", stone: "Red Coral", mantra: "Om Angarkaya Namah", friendly: "1,3,6", neutral: "2,7,8", evil: "4,5" },
};

export function ayanamsa(date) {
  const jd = date.getTime() / 86400000 + 2440587.5;
  const T = (jd - 2451545.0) / 36525;
  const yearsFromJ2000 = T * 100;
  return 23.85 + yearsFromJ2000 * 0.013969;
}

export function normalizeDeg(deg) {
  return ((deg % 360) + 360) % 360;
}

export function tropicalLongitude(body, date) {
  if (body === "Moon") return Astronomy.EclipticGeoMoon(date).lon;
  const vec = Astronomy.GeoVector(Astronomy.Body[body], date, false);
  return Astronomy.Ecliptic(vec).elon;
}

export function meanLunarNode(date) {
  const jd = date.getTime() / 86400000 + 2440587.5;
  const T = (jd - 2451545.0) / 36525;
  const omega = 125.0445479 - 1934.1362891 * T + 0.0020754 * T * T + (T ** 3) / 467441 - (T ** 4) / 60616000;
  return normalizeDeg(omega);
}

export function getPlanetTropical(date) {
  const rahu = meanLunarNode(date);
  return {
    Sun: tropicalLongitude("Sun", date),
    Moon: tropicalLongitude("Moon", date),
    Mars: tropicalLongitude("Mars", date),
    Mercury: tropicalLongitude("Mercury", date),
    Jupiter: tropicalLongitude("Jupiter", date),
    Venus: tropicalLongitude("Venus", date),
    Saturn: tropicalLongitude("Saturn", date),
    Uranus: tropicalLongitude("Uranus", date),
    Neptune: tropicalLongitude("Neptune", date),
    Pluto: tropicalLongitude("Pluto", date),
    Rahu: rahu,
    Ketu: normalizeDeg(rahu + 180),
  };
}

export function isRetrograde(planet, date) {
  if (planet === "Rahu" || planet === "Ketu") return true;
  if (planet === "Sun" || planet === "Moon") return false;
  const before = tropicalLongitude(planet, new Date(date.getTime() - 86400000));
  const after = tropicalLongitude(planet, new Date(date.getTime() + 86400000));
  let delta = after - before;
  if (delta > 180) delta -= 360;
  if (delta < -180) delta += 360;
  return delta < 0;
}

export function rashiIndex(siderealLon) {
  return Math.floor(normalizeDeg(siderealLon) / 30);
}

export function nakshatraIndex(siderealLon) {
  return Math.floor(normalizeDeg(siderealLon) / (360 / 27));
}

export function padaOf(siderealLon) {
  const span = 360 / 27;
  const withinNakshatra = normalizeDeg(siderealLon) % span;
  return Math.floor(withinNakshatra / (span / 4)) + 1;
}

export function nakshatraLord(nIndex) {
  return NAKSHATRA_LORD_CYCLE[nIndex % 9];
}

export function ascendantSidereal(date, lat, lon) {
  const gastHours = Astronomy.SiderealTime(date);
  const ramc = normalizeDeg(gastHours * 15 + lon);
  const jd = date.getTime() / 86400000 + 2440587.5;
  const T = (jd - 2451545.0) / 36525;
  const eps = 23.4392911 - 0.0130042 * T;
  const rad = Math.PI / 180;
  const y = -Math.cos(ramc * rad);
  const x = Math.sin(eps * rad) * Math.tan(lat * rad) + Math.cos(eps * rad) * Math.sin(ramc * rad);
  let tropicalAsc = Math.atan2(y, x) / rad;
  // Empirically validated: the raw formula above yields the Descendant; add 180 to
  // get the true Ascendant (verified against a known reference chart).
  tropicalAsc = normalizeDeg(tropicalAsc + 180);
  return normalizeDeg(tropicalAsc - ayanamsa(date));
}

export function planetDetails(siderealLon) {
  const rIdx = rashiIndex(siderealLon);
  const nIdx = nakshatraIndex(siderealLon);
  return {
    sign: RASHIS[rIdx],
    signLord: RASHI_LORDS[rIdx],
    degreeInSign: normalizeDeg(siderealLon) % 30,
    nakshatra: NAKSHATRAS[nIdx],
    nakshatraLord: nakshatraLord(nIdx),
    pada: padaOf(siderealLon),
  };
}

export function houseFromAscendant(planetRashiIdx, ascRashiIdx) {
  return ((planetRashiIdx - ascRashiIdx + 12) % 12) + 1;
}

export function tithiOf(sunSidereal, moonSidereal) {
  let diff = normalizeDeg(moonSidereal - sunSidereal);
  const tithiNum = Math.floor(diff / 12);
  const paksha = tithiNum < 15 ? "Shukla" : "Krishna";
  const nameIdx = tithiNum % 15;
  const name = nameIdx === 14 ? (paksha === "Shukla" ? "Purnima" : "Amavasya") : TITHI_NAMES[nameIdx];
  return `${paksha} ${name}`;
}

export function yogaOf(sunSidereal, moonSidereal) {
  const sum = normalizeDeg(sunSidereal + moonSidereal);
  const idx = Math.floor(sum / (360 / 27));
  return YOGA_NAMES[idx];
}

export function karanOf(sunSidereal, moonSidereal) {
  const diff = normalizeDeg(moonSidereal - sunSidereal);
  const karanNum = Math.floor(diff / 6);
  if (karanNum === 0) return "Kimstughna";
  if (karanNum >= 57) return "Naga";
  if (karanNum === 58) return "Chatushpada";
  return KARAN_NAMES[(karanNum - 1) % 7];
}

export function moonSignAttributes(moonSiderealLon) {
  const rIdx = rashiIndex(moonSiderealLon);
  const nIdx = nakshatraIndex(moonSiderealLon);
  const tatva = RASHI_TATVA[rIdx];
  return {
    tatva,
    varna: RASHI_VARNA[tatva],
    paya: RASHI_PAYA[rIdx],
    vashya: RASHI_VASHYA[rIdx],
    yoni: NAKSHATRA_YONI[nIdx],
    gan: NAKSHATRA_GAN[nIdx],
    nadi: NAKSHATRA_NADI[nIdx],
    nameAlphabet: NAKSHATRA_STARTING_SOUND[nIdx],
  };
}

export function digitalRoot(n) {
  let sum = Math.abs(n);
  while (sum > 9) {
    sum = String(sum)
      .split("")
      .reduce((a, d) => a + Number(d), 0);
  }
  return sum || 9;
}

export function destinyNumber(day, month, year) {
  const digits = `${day}${month}${year}`.split("").reduce((a, d) => a + Number(d), 0);
  return digitalRoot(digits);
}

const CHALDEAN_MAP = {
  a: 1, b: 2, c: 3, d: 4, e: 5, f: 8, g: 3, h: 5, i: 1, j: 1, k: 2, l: 3, m: 4,
  n: 5, o: 7, p: 8, q: 1, r: 2, s: 3, t: 4, u: 6, v: 6, w: 6, x: 5, y: 1, z: 7,
};

export function nameNumber(name) {
  const sum = name
    .toLowerCase()
    .replace(/[^a-z]/g, "")
    .split("")
    .reduce((a, ch) => a + (CHALDEAN_MAP[ch] || 0), 0);
  return digitalRoot(sum);
}

export function radicalNumber(day) {
  return digitalRoot(day);
}

export function numerologyProfile(num) {
  return NUMEROLOGY[num] || NUMEROLOGY[1];
}

export function buildDashaSequence(moonSiderealLon, birthDate) {
  const nIdx = nakshatraIndex(moonSiderealLon);
  const span = 360 / 27;
  const withinNakshatra = normalizeDeg(moonSiderealLon) % span;
  const fractionElapsed = withinNakshatra / span;
  const startLord = nakshatraLord(nIdx);
  const startLordYears = DASHA_YEARS[startLord];
  const balanceYears = startLordYears * (1 - fractionElapsed);

  const sequence = [];
  let cursor = new Date(birthDate);
  const startIdx = DASHA_SEQUENCE.indexOf(startLord);

  for (let i = 0; i < 9; i++) {
    const lord = DASHA_SEQUENCE[(startIdx + i) % 9];
    const years = i === 0 ? balanceYears : DASHA_YEARS[lord];
    const start = new Date(cursor);
    const end = new Date(cursor.getTime() + years * 365.25 * 86400000);
    sequence.push({ lord, start, end, years });
    cursor = end;
  }
  return sequence;
}

export function checkMangalDosha(planetSidereal, ascRashiIdx) {
  const marsRashiIdx = rashiIndex(planetSidereal.Mars);
  const houseOfMars = houseFromAscendant(marsRashiIdx, ascRashiIdx);
  const doshaHouses = [1, 2, 4, 7, 8, 12];
  return { present: doshaHouses.includes(houseOfMars), house: houseOfMars };
}

export function checkKaalSarpDosha(planetSidereal) {
  const rahuLon = normalizeDeg(planetSidereal.Rahu);
  const ketuLon = normalizeDeg(planetSidereal.Ketu);
  const classical = ["Sun", "Moon", "Mars", "Mercury", "Jupiter", "Venus", "Saturn"];

  const isBetween = (lon) => {
    const rel = normalizeDeg(lon - rahuLon);
    const span = normalizeDeg(ketuLon - rahuLon);
    return rel <= span;
  };

  const allOneSide = classical.every((p) => isBetween(planetSidereal[p]));
  const allOtherSide = classical.every((p) => !isBetween(planetSidereal[p]));
  return { present: allOneSide || allOtherSide };
}
