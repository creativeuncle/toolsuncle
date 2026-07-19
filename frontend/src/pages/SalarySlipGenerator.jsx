import { useMemo, useRef, useState } from "react";
import { Plus, X, Upload, User, Calendar, Building2, IndianRupee, Landmark } from "lucide-react";
import { tools } from "../config/tools";
import { currencies } from "../config/currencies";
import ToolPageShell from "../components/ToolPageShell";
import Button from "../components/Button";
import { generateSalarySlipPdf } from "../utils/generateSalarySlipPdf";

const tool = tools.find((t) => t.id === "salary-slip-generator");

const MONTHS = [
  "January", "February", "March", "April", "May", "June",
  "July", "August", "September", "October", "November", "December",
];
const CURRENT_YEAR = new Date().getFullYear();
const YEARS = Array.from({ length: 11 }, (_, i) => CURRENT_YEAR - 5 + i);

const inputClass =
  "w-full rounded-xl border border-slate-300 dark:border-slate-700 bg-transparent px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-indigo-500";
const compactSelectClass =
  "w-full rounded-xl border border-slate-300 dark:border-slate-700 bg-transparent pl-2 pr-1 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-indigo-500";
const labelClass = "block text-xs font-medium text-slate-500 dark:text-slate-400 mb-1";

let nextId = 1;
const uid = () => nextId++;

const DEFAULT_EMPLOYEE_FIELDS = [
  { key: "employeeName", label: "Employee Name", required: true, placeholder: "e.g. Rajesh Kumar" },
  { key: "employeeId", label: "Employee ID", required: true, placeholder: "e.g. EMP001" },
  { key: "designation", label: "Designation", placeholder: "e.g. Software Engineer" },
  { key: "department", label: "Department", placeholder: "e.g. Engineering" },
  { key: "location", label: "Location", placeholder: "e.g. Ahmedabad" },
  { key: "pan", label: "PAN", placeholder: "e.g. ABCDE1234F" },
  { key: "uan", label: "UAN Number", placeholder: "e.g. 102092398476" },
  { key: "pfNumber", label: "P.F. Number", placeholder: "e.g. GJAHD3198527000" },
  { key: "esiNumber", label: "ESI Number", placeholder: "e.g. 1234567890" },
  { key: "bankName", label: "Bank Name", placeholder: "e.g. HDFC Bank" },
  { key: "bankAccount", label: "Bank A/C Number", placeholder: "e.g. 1234567890" },
  { key: "dateOfJoining", label: "Date of Joining", placeholder: "e.g. 01/Jun/24" },
].map((f) => ({ id: uid(), value: "", custom: false, ...f }));

const DEFAULT_WORKING_FIELDS = [
  { key: "wd", label: "WD (Working Days)", value: "22" },
  { key: "wo", label: "WO (Weekly Off)", value: "8" },
  { key: "ph", label: "PH (Public Holiday)", value: "0" },
  { key: "pd", label: "PD (Paid Days)", value: "22" },
  { key: "cl", label: "CL (Casual Leave)", value: "0" },
  { key: "pl", label: "PL (Privilege Leave)", value: "0" },
  { key: "sl", label: "SL (Sick Leave)", value: "0" },
  { key: "lwp", label: "LWP (Leave Without Pay)", value: "0" },
].map((f) => ({ id: uid(), custom: false, ...f }));

const DEFAULT_EARNINGS = [
  { key: "basic", label: "Consol. Basic", required: true },
  { key: "da", label: "DA (Dearness Allowance)" },
  { key: "hra", label: "HRA (House Rent Allowance)" },
  { key: "conv", label: "CONV (Conveyance)" },
  { key: "medical", label: "MEDICAL" },
  { key: "othAll", label: "OTH.All (Other Allowance)" },
  { key: "diffArrear", label: "Diff Basic / Arrear" },
].map((f) => ({ id: uid(), value: "", custom: false, ...f }));

const DEFAULT_DEDUCTIONS = [
  { key: "pf", label: "P.F (12% of Basic, capped at ₹1,800)", auto: true, autoCalc: true, applyCap: true },
  { key: "esi", label: "ESI (0.75% of Gross — only if Gross ≤ ₹21,000)", auto: true, autoCalc: true },
  { key: "pt", label: "P.T. (Professional Tax)" },
  { key: "it", label: "I.T. (Income Tax / TDS)" },
  { key: "lwf", label: "L.W.F (Labour Welfare Fund)" },
  { key: "adv", label: "Adv. (Advance)" },
  { key: "loan", label: "Loan" },
  { key: "othDed", label: "Oth.Ded (Other Deduction)" },
  { key: "canteen", label: "Canteen / Food" },
].map((f) => ({ id: uid(), value: "", custom: false, ...f }));

function SectionCard({ icon: Icon, iconColor, title, right, children }) {
  return (
    <div className="rounded-2xl border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900 p-6">
      <div className="flex items-center justify-between mb-5">
        <h3 className="flex items-center gap-2 font-semibold">
          <Icon size={18} className={iconColor} />
          {title}
        </h3>
        {right}
      </div>
      {children}
    </div>
  );
}

function RemovableField({ field, onChange, onRemove }) {
  return (
    <div>
      <div className="flex items-center justify-between mb-1">
        {field.custom ? (
          <input
            value={field.label}
            onChange={(e) => onChange({ label: e.target.value })}
            placeholder="Field name"
            className="text-xs font-medium text-slate-500 dark:text-slate-400 bg-transparent focus:outline-none border-b border-dashed border-slate-300 dark:border-slate-700"
          />
        ) : (
          <label className="text-xs font-medium text-slate-500 dark:text-slate-400">
            {field.label}
            {field.required && " *"}
          </label>
        )}
        {!field.required && (
          <button type="button" onClick={onRemove} className="text-slate-400 hover:text-red-500">
            <X size={14} />
          </button>
        )}
      </div>
      <input
        value={field.value}
        onChange={(e) => onChange({ value: e.target.value })}
        placeholder={field.placeholder || "0"}
        className={inputClass}
      />
    </div>
  );
}

function MoneyRow({ row, currencySymbol, onChange, onRemove, disabled, computedValue }) {
  return (
    <div>
      <div className="flex items-center justify-between mb-1">
        {row.custom ? (
          <input
            value={row.label}
            onChange={(e) => onChange({ label: e.target.value })}
            placeholder="Item name"
            className="text-xs font-medium text-slate-500 dark:text-slate-400 bg-transparent focus:outline-none border-b border-dashed border-slate-300 dark:border-slate-700"
          />
        ) : (
          <label className="text-xs font-medium text-slate-500 dark:text-slate-400">
            {row.label}
            {row.required && " *"}
          </label>
        )}
        {!row.required && (
          <button type="button" onClick={onRemove} className="text-slate-400 hover:text-red-500">
            <X size={14} />
          </button>
        )}
      </div>
      <div className="relative">
        <span className="absolute left-3 top-1/2 -translate-y-1/2 text-sm text-slate-400">{currencySymbol}</span>
        <input
          type="number"
          min={0}
          step="0.01"
          disabled={disabled}
          value={disabled ? Number(computedValue || 0).toFixed(2) : row.value}
          onChange={(e) => onChange({ value: e.target.value })}
          className={`${inputClass} pl-7 ${disabled ? "opacity-70 cursor-not-allowed" : ""}`}
        />
      </div>
      {row.auto && (
        <div className="flex items-center gap-4 mt-1.5">
          <label className="flex items-center gap-1.5 text-xs text-slate-500 dark:text-slate-400">
            <input
              type="checkbox"
              checked={row.autoCalc}
              onChange={(e) => onChange({ autoCalc: e.target.checked })}
              className="rounded accent-amber-500"
            />
            Auto-calc
          </label>
          {row.key === "pf" && (
            <label className="flex items-center gap-1.5 text-xs text-slate-500 dark:text-slate-400">
              <input
                type="checkbox"
                checked={row.applyCap}
                onChange={(e) => onChange({ applyCap: e.target.checked })}
                className="rounded accent-amber-500"
              />
              Apply ₹1,800 cap
            </label>
          )}
        </div>
      )}
    </div>
  );
}

export default function SalarySlipGenerator() {
  const fileInputRef = useRef(null);

  const [currencyCode, setCurrencyCode] = useState("INR");
  const [month, setMonth] = useState(new Date().getMonth());
  const [year, setYear] = useState(CURRENT_YEAR);

  const [companyName, setCompanyName] = useState("");
  const [companyAddress, setCompanyAddress] = useState("");
  const [logoDataUrl, setLogoDataUrl] = useState("");
  const [logoFormat, setLogoFormat] = useState("PNG");
  const [logoDimensions, setLogoDimensions] = useState(null);
  const [logoError, setLogoError] = useState("");

  const [employeeFields, setEmployeeFields] = useState(DEFAULT_EMPLOYEE_FIELDS);
  const [workingFields, setWorkingFields] = useState(DEFAULT_WORKING_FIELDS);
  const [earnings, setEarnings] = useState(DEFAULT_EARNINGS);
  const [deductions, setDeductions] = useState(DEFAULT_DEDUCTIONS);

  const currencySymbol = currencies.find((c) => c.code === currencyCode)?.symbol || "₹";

  const handleLogoChange = (e) => {
    const file = e.target.files?.[0];
    if (!file) return;
    if (file.size > 1024 * 1024) {
      setLogoError("Logo must be under 1 MB.");
      return;
    }
    setLogoError("");
    setLogoFormat(file.type === "image/png" ? "PNG" : "JPEG");
    const reader = new FileReader();
    reader.onload = () => {
      const dataUrl = reader.result;
      const img = new Image();
      img.onload = () => {
        setLogoDataUrl(dataUrl);
        setLogoDimensions({ width: img.naturalWidth, height: img.naturalHeight });
      };
      img.src = dataUrl;
    };
    reader.readAsDataURL(file);
  };

  const updateField = (setter, id, patch) =>
    setter((items) => items.map((it) => (it.id === id ? { ...it, ...patch } : it)));
  const removeField = (setter, id) => setter((items) => items.filter((it) => it.id !== id));

  const addEmployeeField = () =>
    setEmployeeFields((items) => [...items, { id: uid(), key: `custom-${uid()}`, label: "", value: "", custom: true }]);
  const addWorkingField = () =>
    setWorkingFields((items) => [...items, { id: uid(), key: `custom-${uid()}`, label: "", value: "0", custom: true }]);
  const addEarning = () =>
    setEarnings((items) => [...items, { id: uid(), key: `custom-${uid()}`, label: "", value: "", custom: true }]);
  const addDeduction = () =>
    setDeductions((items) => [...items, { id: uid(), key: `custom-${uid()}`, label: "", value: "", custom: true }]);

  const findWorking = (key) => Number(workingFields.find((f) => f.key === key)?.value) || 0;

  const totals = useMemo(() => {
    const grossActual = earnings.reduce((sum, e) => sum + (Number(e.value) || 0), 0);
    const basicAmount = Number(earnings.find((e) => e.key === "basic")?.value) || 0;

    const wd = findWorking("wd");
    const pd = findWorking("pd");
    const lwp = findWorking("lwp");
    const prorationFactor = lwp > 0 && wd > 0 ? pd / wd : 1;
    const grossPayable = grossActual * prorationFactor;

    const pfComputed = Math.min(basicAmount * 0.12, deductions.find((d) => d.key === "pf")?.applyCap ? 1800 : Infinity);
    const esiComputed = grossPayable <= 21000 ? grossPayable * 0.0075 : 0;

    const deductionsWithValues = deductions.map((d) => {
      if (d.key === "pf") return { ...d, currentValue: d.autoCalc ? pfComputed : Number(d.value) || 0 };
      if (d.key === "esi") return { ...d, currentValue: d.autoCalc ? esiComputed : Number(d.value) || 0 };
      return { ...d, currentValue: Number(d.value) || 0 };
    });

    const grossDeductions = deductionsWithValues.reduce((sum, d) => sum + d.currentValue, 0);
    const netPay = grossPayable - grossDeductions;

    return { grossActual, grossPayable, grossDeductions, netPay, pfComputed, esiComputed, deductionsWithValues, prorationFactor };
  }, [earnings, deductions, workingFields]);

  const handleDownload = () => {
    generateSalarySlipPdf({
      payPeriod: { currency: currencyCode, month, year },
      company: {
        name: companyName,
        address: companyAddress,
        logoDataUrl,
        logoFormat,
        logoWidth: logoDimensions?.width,
        logoHeight: logoDimensions?.height,
      },
      employeeFields,
      workingFields,
      earnings,
      deductions: totals.deductionsWithValues,
      totals,
    });
  };

  const canDownload = companyName.trim() && employeeFields.find((f) => f.key === "employeeName")?.value.trim() &&
    employeeFields.find((f) => f.key === "employeeId")?.value.trim() &&
    Number(earnings.find((e) => e.key === "basic")?.value) > 0;

  return (
    <ToolPageShell icon={tool.icon} color={tool.color} title={tool.name} description={tool.description}>
      <div className="max-w-4xl space-y-6">
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
          <SectionCard icon={Calendar} iconColor="text-amber-500" title="Pay Period & Currency">
            <div className="grid grid-cols-[1fr_1.3fr_1fr] gap-2">
              <div>
                <label className={labelClass}>Currency</label>
                <select value={currencyCode} onChange={(e) => setCurrencyCode(e.target.value)} className={compactSelectClass}>
                  {currencies.map((c) => (
                    <option key={c.code} value={c.code}>
                      {c.code}
                    </option>
                  ))}
                </select>
              </div>
              <div>
                <label className={labelClass}>Month</label>
                <select value={month} onChange={(e) => setMonth(Number(e.target.value))} className={compactSelectClass}>
                  {MONTHS.map((m, i) => (
                    <option key={m} value={i}>
                      {m}
                    </option>
                  ))}
                </select>
              </div>
              <div>
                <label className={labelClass}>Year</label>
                <select value={year} onChange={(e) => setYear(Number(e.target.value))} className={compactSelectClass}>
                  {YEARS.map((y) => (
                    <option key={y} value={y}>
                      {y}
                    </option>
                  ))}
                </select>
              </div>
            </div>
          </SectionCard>

          <SectionCard icon={Building2} iconColor="text-indigo-500" title="Company Details">
            <div className="space-y-3">
              <div>
                <label className={labelClass}>Company Name *</label>
                <input
                  value={companyName}
                  onChange={(e) => setCompanyName(e.target.value)}
                  placeholder="e.g. Acme Pvt Ltd"
                  className={inputClass}
                />
              </div>
              <div>
                <label className={labelClass}>Company Address</label>
                <input
                  value={companyAddress}
                  onChange={(e) => setCompanyAddress(e.target.value)}
                  placeholder="e.g. 123 MG Road, Bangalore"
                  className={inputClass}
                />
              </div>
              <div>
                <label className={labelClass}>Company Logo (optional · max 1 MB)</label>
                <button
                  type="button"
                  onClick={() => fileInputRef.current?.click()}
                  className="flex items-center gap-2 w-full rounded-xl border border-dashed border-slate-300 dark:border-slate-700 hover:border-indigo-400 dark:hover:border-indigo-500 px-3 py-2 text-sm text-slate-500 dark:text-slate-400 transition-colors"
                >
                  {logoDataUrl ? (
                    <img src={logoDataUrl} alt="Logo" className="h-6 object-contain" />
                  ) : (
                    <Upload size={16} />
                  )}
                  {logoDataUrl ? "Change logo" : "Upload logo"}
                </button>
                <input
                  ref={fileInputRef}
                  type="file"
                  accept="image/png,image/jpeg"
                  className="hidden"
                  onChange={handleLogoChange}
                />
                {logoError && <p className="mt-1 text-xs text-red-500">{logoError}</p>}
              </div>
            </div>
          </SectionCard>
        </div>

        <SectionCard
          icon={User}
          iconColor="text-amber-500"
          title="Employee Details"
          right={
            <button
              type="button"
              onClick={addEmployeeField}
              className="flex items-center gap-1 text-sm font-medium text-amber-600 dark:text-amber-400"
            >
              <Plus size={14} />
              Add another field
            </button>
          }
        >
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            {employeeFields.map((field) => (
              <RemovableField
                key={field.id}
                field={field}
                onChange={(patch) => updateField(setEmployeeFields, field.id, patch)}
                onRemove={() => removeField(setEmployeeFields, field.id)}
              />
            ))}
          </div>
        </SectionCard>

        <SectionCard
          icon={Calendar}
          iconColor="text-amber-500"
          title="Working Details"
          right={
            <button
              type="button"
              onClick={addWorkingField}
              className="flex items-center gap-1 text-sm font-medium text-amber-600 dark:text-amber-400"
            >
              <Plus size={14} />
              Add field
            </button>
          }
        >
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
            {workingFields.map((field) => (
              <RemovableField
                key={field.id}
                field={field}
                onChange={(patch) => updateField(setWorkingFields, field.id, patch)}
                onRemove={() => removeField(setWorkingFields, field.id)}
              />
            ))}
          </div>
          <p className="mt-4 text-xs text-slate-400 dark:text-slate-500">
            Total = WD + WO + PH = {findWorking("wd") + findWorking("wo") + findWorking("ph")}. If LWP &gt; 0, the
            Payable column auto-prorates to PD ÷ WD.
          </p>
        </SectionCard>

        <SectionCard
          icon={IndianRupee}
          iconColor="text-emerald-500"
          title="Earnings (₹)"
        >
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            {earnings.map((row) => (
              <MoneyRow
                key={row.id}
                row={row}
                currencySymbol={currencySymbol}
                onChange={(patch) => updateField(setEarnings, row.id, patch)}
                onRemove={() => removeField(setEarnings, row.id)}
              />
            ))}
          </div>
          <button
            type="button"
            onClick={addEarning}
            className="flex items-center gap-1.5 text-sm font-medium text-emerald-600 dark:text-emerald-400 mt-4"
          >
            <Plus size={16} />
            Add Earning
          </button>

          <div className="border-t border-slate-200 dark:border-slate-800 mt-5 pt-4 space-y-1.5">
            <div className="flex justify-between text-sm">
              <span className="text-slate-500 dark:text-slate-400">Gross (Actual)</span>
              <span className="font-medium">
                {currencySymbol}
                {totals.grossActual.toFixed(2)}
              </span>
            </div>
            <div className="flex justify-between font-semibold">
              <span>Gross Income (Payable)</span>
              <span className="text-emerald-600 dark:text-emerald-400">
                {currencySymbol}
                {totals.grossPayable.toFixed(2)}
              </span>
            </div>
          </div>
        </SectionCard>

        <SectionCard icon={Landmark} iconColor="text-red-500" title="Deductions (₹)">
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            {deductions.map((row) => {
              const isAuto = row.auto && row.autoCalc;
              const computed = row.key === "pf" ? totals.pfComputed : row.key === "esi" ? totals.esiComputed : 0;
              return (
                <MoneyRow
                  key={row.id}
                  row={row}
                  currencySymbol={currencySymbol}
                  onChange={(patch) => updateField(setDeductions, row.id, patch)}
                  onRemove={() => removeField(setDeductions, row.id)}
                  disabled={isAuto}
                  computedValue={computed}
                />
              );
            })}
          </div>
          <button
            type="button"
            onClick={addDeduction}
            className="flex items-center gap-1.5 text-sm font-medium text-red-600 dark:text-red-400 mt-4"
          >
            <Plus size={16} />
            Add Deduction
          </button>

          <div className="border-t border-slate-200 dark:border-slate-800 mt-5 pt-4 flex justify-between font-semibold">
            <span>Gross Deductions</span>
            <span className="text-red-600 dark:text-red-400">
              {currencySymbol}
              {totals.grossDeductions.toFixed(2)}
            </span>
          </div>
        </SectionCard>

        <div className="rounded-2xl bg-indigo-50 dark:bg-indigo-500/10 px-6 py-5 flex items-center justify-between">
          <span className="text-lg font-semibold text-indigo-700 dark:text-indigo-400">Net Pay</span>
          <span className="text-2xl font-bold text-indigo-700 dark:text-indigo-400">
            {currencySymbol}
            {totals.netPay.toFixed(2)}
          </span>
        </div>

        <div className="flex justify-end">
          <Button onClick={handleDownload} disabled={!canDownload}>
            Download Payslip
          </Button>
        </div>
        {!canDownload && (
          <p className="text-right text-xs text-slate-400 dark:text-slate-500">
            Company Name, Employee Name, Employee ID, and Consol. Basic are required.
          </p>
        )}
      </div>
    </ToolPageShell>
  );
}
