import { useMemo, useState } from "react";
import {
  User, Calendar, Clock, MapPin, LayoutGrid, FlaskConical, Orbit, Compass, AlertTriangle, Repeat, Sparkles,
} from "lucide-react";
import { tools } from "../config/tools";
import ToolPageShell from "../components/ToolPageShell";
import Button from "../components/Button";
import { indianCities } from "../data/indianCities";
import BasicDetailsTab from "../components/kundli/BasicDetailsTab";
import PredictionsTab from "../components/kundli/PredictionsTab";
import PlanetsTab from "../components/kundli/PlanetsTab";
import ChartTab from "../components/kundli/ChartTab";
import DoshaTab from "../components/kundli/DoshaTab";
import DashaTab from "../components/kundli/DashaTab";
import RemediesTab from "../components/kundli/RemediesTab";
import {
  getPlanetTropical, ayanamsa, normalizeDeg, isRetrograde, rashiIndex, planetDetails,
  ascendantSidereal, houseFromAscendant, tithiOf, yogaOf, karanOf, moonSignAttributes,
  destinyNumber, nameNumber, radicalNumber, numerologyProfile, buildDashaSequence,
  checkMangalDosha, checkKaalSarpDosha, RASHI_LORDS,
} from "../utils/kundliCalculations";

const tool = tools.find((t) => t.id === "kundli");

const inputClass =
  "w-full rounded-xl border border-slate-300 dark:border-slate-700 bg-transparent px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-indigo-500";
const labelClass = "flex items-center gap-1.5 text-xs font-medium text-slate-500 dark:text-slate-400 mb-1";

const PLANET_ORDER = ["Sun", "Moon", "Mars", "Mercury", "Jupiter", "Venus", "Saturn", "Rahu", "Ketu", "Uranus", "Neptune", "Pluto"];

const dateTimeFmt = new Intl.DateTimeFormat("en-GB", { day: "2-digit", month: "short", year: "numeric" });

const TABS = [
  { id: "basic", label: "Basic Details", icon: LayoutGrid },
  { id: "predictions", label: "Kundli Predictions", icon: FlaskConical },
  { id: "planets", label: "Position of Planet", icon: Orbit },
  { id: "chart", label: "Chart", icon: Compass },
  { id: "dosha", label: "Dosha", icon: AlertTriangle },
  { id: "dasha", label: "Dasha", icon: Repeat },
  { id: "remedies", label: "Remedies", icon: Sparkles },
];

export default function Kundli() {
  const [name, setName] = useState("");
  const [dob, setDob] = useState("");
  const [hour, setHour] = useState("");
  const [minute, setMinute] = useState("");
  const [ampm, setAmpm] = useState("AM");
  const [cityQuery, setCityQuery] = useState("");
  const [selectedCity, setSelectedCity] = useState(null);
  const [gender, setGender] = useState("Male");
  const [tab, setTab] = useState("basic");
  const [submitted, setSubmitted] = useState(false);

  const cityMatches = useMemo(() => {
    if (!cityQuery || selectedCity) return [];
    const q = cityQuery.toLowerCase();
    return indianCities.filter((c) => c.name.toLowerCase().includes(q)).slice(0, 8);
  }, [cityQuery, selectedCity]);

  const canSubmit = name.trim() && dob && hour && minute && selectedCity;

  const kundli = useMemo(() => {
    if (!submitted || !canSubmit) return null;

    const [y, m, d] = dob.split("-").map(Number);
    let h24 = Number(hour) % 12;
    if (ampm === "PM") h24 += 12;
    const min = Number(minute);

    // Birth time is IST (UTC+5:30); convert to UTC for astronomical calculations.
    const localMs = new Date(y, m - 1, d, h24, min, 0).getTime();
    const utcDate = new Date(localMs - 5.5 * 3600000);

    const tropical = getPlanetTropical(utcDate);
    const ayan = ayanamsa(utcDate);
    const sidereal = {};
    PLANET_ORDER.forEach((p) => {
      sidereal[p] = normalizeDeg(tropical[p] - ayan);
    });

    const ascSidereal = ascendantSidereal(utcDate, selectedCity.lat, selectedCity.lon);
    const ascRashiIdx = rashiIndex(ascSidereal);
    const ascendant = {
      sidereal: ascSidereal,
      sign: planetDetails(ascSidereal).sign,
      rashiIdx: ascRashiIdx,
      details: planetDetails(ascSidereal),
    };

    const moonDetails = planetDetails(sidereal.Moon);
    const moonRashiIdx = rashiIndex(sidereal.Moon);
    const sunDetails = planetDetails(sidereal.Sun);

    const panchang = {
      tithi: tithiOf(sidereal.Sun, sidereal.Moon),
      yoga: yogaOf(sidereal.Sun, sidereal.Moon),
      karan: karanOf(sidereal.Sun, sidereal.Moon),
    };

    const moonAttrs = moonSignAttributes(sidereal.Moon);

    const destinyNum = destinyNumber(d, m, y);
    const nameNum = nameNumber(name);
    const radicalNum = radicalNumber(d);
    const numerology = {
      destinyNumber: destinyNum,
      nameNumber: nameNum,
      radicalNumber: radicalNum,
      radicalRuler: RASHI_LORDS[(radicalNum - 1 + 12) % 12] || "Sun",
      profile: numerologyProfile(destinyNum),
    };

    const planetRows = PLANET_ORDER.map((name2) => {
      const details = planetDetails(sidereal[name2]);
      const rIdx = rashiIndex(sidereal[name2]);
      return {
        name: name2,
        ...details,
        retrograde: isRetrograde(name2, utcDate),
        house: houseFromAscendant(rIdx, ascRashiIdx),
      };
    });
    planetRows.push({
      name: "Ascendant",
      ...ascendant.details,
      retrograde: false,
      house: 1,
    });

    const planetsByHouse = {};
    planetRows.forEach((r) => {
      if (r.name === "Ascendant") return;
      if (!["Sun", "Moon", "Mars", "Mercury", "Jupiter", "Venus", "Saturn", "Rahu", "Ketu"].includes(r.name)) return;
      planetsByHouse[r.house] = planetsByHouse[r.house] || [];
      planetsByHouse[r.house].push(r.name);
    });

    const dashaSequence = buildDashaSequence(sidereal.Moon, new Date(y, m - 1, d));
    const now = new Date();
    const currentDasha = dashaSequence.find((s) => now >= s.start && now < s.end) || dashaSequence[0];

    const mangal = checkMangalDosha(sidereal, ascRashiIdx);
    const kaalSarp = checkKaalSarpDosha(sidereal);

    const timeDisplay = `${String(h24 % 12 === 0 ? 12 : h24 % 12).padStart(2, "0")}:${String(min).padStart(2, "0")} ${ampm}`;

    return {
      person: {
        name,
        gender,
        place: `${selectedCity.name}, ${selectedCity.state}`,
        birthDisplay: `${dateTimeFmt.format(new Date(y, m - 1, d))} | ${timeDisplay}`,
        birthDisplayDateOnly: dateTimeFmt.format(new Date(y, m - 1, d)),
      },
      moonDetails,
      moonRashiIdx,
      sunDetails,
      ascendant,
      panchang,
      moonAttrs,
      numerology,
      planetRows,
      planetsByHouse,
      dashaSequence,
      currentDashaLord: currentDasha.lord,
      mangal,
      kaalSarp,
    };
  }, [submitted, canSubmit, dob, hour, minute, ampm, selectedCity, name, gender]);

  const handleSubmit = () => {
    if (canSubmit) setSubmitted(true);
  };

  const handleReset = () => {
    setSubmitted(false);
    setName("");
    setDob("");
    setHour("");
    setMinute("");
    setAmpm("AM");
    setCityQuery("");
    setSelectedCity(null);
    setGender("Male");
    setTab("basic");
  };

  return (
    <ToolPageShell icon={tool.icon} color={tool.color} title={tool.name} description={tool.description}>
      <div className="max-w-5xl space-y-6">
        {!kundli ? (
          <div className="rounded-2xl border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900 p-6">
            <h3 className="font-semibold mb-4">Get Your Free Kundli</h3>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div>
                <label className={labelClass}>
                  <User size={13} />
                  Full Name
                </label>
                <input value={name} onChange={(e) => setName(e.target.value)} placeholder="Enter your full name" className={inputClass} />
              </div>
              <div>
                <label className={labelClass}>
                  <Calendar size={13} />
                  Date of Birth
                </label>
                <input type="date" value={dob} max="2100-01-01" onChange={(e) => setDob(e.target.value)} className={inputClass} />
              </div>
              <div>
                <label className={labelClass}>
                  <Clock size={13} />
                  Time of Birth
                </label>
                <div className="grid grid-cols-3 gap-2">
                  <select value={hour} onChange={(e) => setHour(e.target.value)} className={inputClass}>
                    <option value="">HH</option>
                    {Array.from({ length: 12 }, (_, i) => i + 1).map((h) => (
                      <option key={h} value={h}>
                        {h}
                      </option>
                    ))}
                  </select>
                  <select value={minute} onChange={(e) => setMinute(e.target.value)} className={inputClass}>
                    <option value="">MM</option>
                    {Array.from({ length: 60 }, (_, i) => i).map((mi) => (
                      <option key={mi} value={mi}>
                        {String(mi).padStart(2, "0")}
                      </option>
                    ))}
                  </select>
                  <select value={ampm} onChange={(e) => setAmpm(e.target.value)} className={inputClass}>
                    <option value="AM">AM</option>
                    <option value="PM">PM</option>
                  </select>
                </div>
              </div>
              <div className="relative">
                <label className={labelClass}>
                  <MapPin size={13} />
                  Place of Birth
                </label>
                <input
                  value={selectedCity ? `${selectedCity.name}, ${selectedCity.state}` : cityQuery}
                  onChange={(e) => {
                    setSelectedCity(null);
                    setCityQuery(e.target.value);
                  }}
                  placeholder="Start typing a city name"
                  className={inputClass}
                />
                {cityMatches.length > 0 && (
                  <div className="absolute z-10 mt-1 w-full rounded-xl border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-800 shadow-lg max-h-56 overflow-y-auto">
                    {cityMatches.map((c) => (
                      <button
                        key={`${c.name}-${c.state}`}
                        type="button"
                        onClick={() => {
                          setSelectedCity(c);
                          setCityQuery("");
                        }}
                        className="w-full text-left px-3 py-2 text-sm hover:bg-slate-100 dark:hover:bg-slate-700"
                      >
                        {c.name}, {c.state}
                      </button>
                    ))}
                  </div>
                )}
              </div>
            </div>

            <div className="flex items-center gap-6 mt-5">
              {["Male", "Female"].map((g) => (
                <label key={g} className="flex items-center gap-2 text-sm cursor-pointer">
                  <input type="radio" name="gender" checked={gender === g} onChange={() => setGender(g)} className="accent-amber-500" />
                  {g}
                </label>
              ))}
            </div>

            <div className="mt-5">
              <Button onClick={handleSubmit} disabled={!canSubmit} className="w-full sm:w-auto">
                Submit
              </Button>
            </div>
          </div>
        ) : (
          <>
            <div className="flex items-center justify-between flex-wrap gap-3">
              <h2 className="text-xl font-bold">Kundli Report</h2>
              <Button variant="secondary" onClick={handleReset}>
                New Kundli
              </Button>
            </div>

            <div className="flex flex-wrap gap-2">
              {TABS.map((t) => (
                <button
                  key={t.id}
                  type="button"
                  onClick={() => setTab(t.id)}
                  className={`flex items-center gap-1.5 rounded-lg px-3.5 py-2 text-sm font-medium transition-colors ${
                    tab === t.id
                      ? "bg-amber-500 text-white"
                      : "bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-300 hover:bg-slate-200 dark:hover:bg-slate-700"
                  }`}
                >
                  <t.icon size={15} />
                  {t.label}
                </button>
              ))}
            </div>

            {tab === "basic" && <BasicDetailsTab kundli={kundli} />}
            {tab === "predictions" && <PredictionsTab rashiIndex={kundli.moonRashiIdx} />}
            {tab === "planets" && <PlanetsTab rows={kundli.planetRows} />}
            {tab === "chart" && <ChartTab ascRashiIdx={kundli.ascendant.rashiIdx} planetsByHouse={kundli.planetsByHouse} />}
            {tab === "dosha" && <DoshaTab mangal={kundli.mangal} kaalSarp={kundli.kaalSarp} />}
            {tab === "dasha" && <DashaTab sequence={kundli.dashaSequence} />}
            {tab === "remedies" && (
              <RemediesTab
                currentDashaLord={kundli.currentDashaLord}
                mangalDosha={kundli.mangal}
                kaalSarpDosha={kundli.kaalSarp}
                numerology={kundli.numerology}
              />
            )}
          </>
        )}
      </div>
    </ToolPageShell>
  );
}
