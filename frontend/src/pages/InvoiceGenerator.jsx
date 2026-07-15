import { useMemo, useRef, useState } from "react";
import { Plus, Trash2, Upload } from "lucide-react";
import { tools } from "../config/tools";
import { currencies } from "../config/currencies";
import ToolPageShell from "../components/ToolPageShell";
import Button from "../components/Button";
import { generateInvoicePdf } from "../utils/generateInvoicePdf";

const tool = tools.find((t) => t.id === "invoice-generator");

let nextId = 1;
const emptyLineItem = () => ({ id: nextId++, item: "", quantity: 1, rate: 0 });

const inputClass =
  "w-full rounded-xl border border-slate-300 dark:border-slate-700 bg-transparent px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-indigo-500";
const labelClass = "block text-xs font-medium text-slate-500 dark:text-slate-400 mb-1";

function DetailsFields({ title, value, onChange }) {
  return (
    <div>
      <h3 className="text-sm font-semibold mb-3">{title}</h3>
      <div className="space-y-3">
        <div>
          <label className={labelClass}>Company Name</label>
          <input
            className={inputClass}
            value={value.companyName}
            onChange={(e) => onChange({ ...value, companyName: e.target.value })}
          />
        </div>
        <div>
          <label className={labelClass}>Address</label>
          <input
            className={inputClass}
            value={value.address}
            onChange={(e) => onChange({ ...value, address: e.target.value })}
          />
        </div>
        <div>
          <label className={labelClass}>Phone Number</label>
          <input
            className={inputClass}
            value={value.phone}
            onChange={(e) => onChange({ ...value, phone: e.target.value })}
          />
        </div>
        <div>
          <label className={labelClass}>Email</label>
          <input
            className={inputClass}
            value={value.email}
            onChange={(e) => onChange({ ...value, email: e.target.value })}
          />
        </div>
      </div>
    </div>
  );
}

export default function InvoiceGenerator() {
  const fileInputRef = useRef(null);
  const [logoDataUrl, setLogoDataUrl] = useState("");
  const [logoFormat, setLogoFormat] = useState("PNG");

  const [invoiceNumber, setInvoiceNumber] = useState("INV-0001");
  const [currencyCode, setCurrencyCode] = useState("USD");

  const [yourDetails, setYourDetails] = useState({
    companyName: "",
    address: "",
    phone: "",
    email: "",
  });
  const [billTo, setBillTo] = useState({ companyName: "", address: "", phone: "", email: "" });

  const [invoiceDate, setInvoiceDate] = useState("");
  const [paymentTerms, setPaymentTerms] = useState("");
  const [dueDate, setDueDate] = useState("");
  const [poNumber, setPoNumber] = useState("");

  const [lineItems, setLineItems] = useState([emptyLineItem()]);
  const [discount, setDiscount] = useState(0);
  const [tax, setTax] = useState(0);
  const [shipping, setShipping] = useState(0);
  const [amountPaid, setAmountPaid] = useState(0);

  const [notes, setNotes] = useState("");
  const [terms, setTerms] = useState("");

  const currencySymbol = currencies.find((c) => c.code === currencyCode)?.symbol || "$";

  const handleLogoChange = (e) => {
    const file = e.target.files?.[0];
    if (!file) return;
    setLogoFormat(file.type === "image/png" ? "PNG" : "JPEG");
    const reader = new FileReader();
    reader.onload = () => setLogoDataUrl(reader.result);
    reader.readAsDataURL(file);
  };

  const updateLineItem = (id, patch) => {
    setLineItems((items) => items.map((it) => (it.id === id ? { ...it, ...patch } : it)));
  };

  const addLineItem = () => setLineItems((items) => [...items, emptyLineItem()]);
  const removeLineItem = (id) =>
    setLineItems((items) => (items.length > 1 ? items.filter((it) => it.id !== id) : items));

  const totals = useMemo(() => {
    const subtotal = lineItems.reduce((sum, i) => sum + (Number(i.quantity) || 0) * (Number(i.rate) || 0), 0);
    const discountAmount = subtotal * ((Number(discount) || 0) / 100);
    const taxAmount = (subtotal - discountAmount) * ((Number(tax) || 0) / 100);
    const total = subtotal - discountAmount + taxAmount + (Number(shipping) || 0);
    const balanceDue = total - (Number(amountPaid) || 0);
    return { subtotal, discountAmount, taxAmount, total, balanceDue };
  }, [lineItems, discount, tax, shipping, amountPaid]);

  const formatMoney = (n) => `${currencySymbol}${n.toFixed(2)}`;

  const handleDownload = () => {
    generateInvoicePdf({
      logoDataUrl,
      logoFormat,
      invoiceNumber,
      yourDetails,
      billTo,
      invoiceDate,
      paymentTerms,
      dueDate,
      poNumber,
      lineItems,
      discount,
      tax,
      shipping,
      amountPaid,
      notes,
      terms,
      currencySymbol,
    });
  };

  return (
    <ToolPageShell
      icon={tool.icon}
      color={tool.color}
      title={tool.name}
      description={tool.description}
    >
      <div className="max-w-4xl">
        {/* Logo + Invoice Number */}
        <div className="flex items-start justify-between gap-6 mb-8">
          <div>
            <label className={labelClass}>Your Logo</label>
            <button
              type="button"
              onClick={() => fileInputRef.current?.click()}
              className="flex items-center justify-center w-32 h-24 rounded-xl border-2 border-dashed border-slate-300 dark:border-slate-700 hover:border-indigo-400 dark:hover:border-indigo-500 transition-colors overflow-hidden bg-slate-50 dark:bg-slate-800"
            >
              {logoDataUrl ? (
                <img src={logoDataUrl} alt="Logo" className="max-w-full max-h-full object-contain" />
              ) : (
                <span className="flex flex-col items-center gap-1 text-slate-400">
                  <Upload size={20} />
                  <span className="text-xs">Upload logo</span>
                </span>
              )}
            </button>
            <input
              ref={fileInputRef}
              type="file"
              accept="image/png,image/jpeg"
              className="hidden"
              onChange={handleLogoChange}
            />
          </div>

          <div className="text-right">
            <label className={labelClass}>Invoice Number</label>
            <input
              className={`${inputClass} text-right`}
              value={invoiceNumber}
              onChange={(e) => setInvoiceNumber(e.target.value)}
            />
          </div>
        </div>

        {/* Invoice Settings */}
        <div className="mb-8 rounded-xl bg-slate-100 dark:bg-slate-800 px-4 py-3 flex items-center gap-3">
          <span className="text-sm font-medium">Invoice Settings — Currency</span>
          <select
            value={currencyCode}
            onChange={(e) => setCurrencyCode(e.target.value)}
            className="rounded-lg border border-slate-300 dark:border-slate-700 bg-white dark:bg-slate-900 px-3 py-1.5 text-sm focus:outline-none focus:ring-2 focus:ring-indigo-500"
          >
            {currencies.map((c) => (
              <option key={c.code} value={c.code}>
                {c.code} ({c.symbol})
              </option>
            ))}
          </select>
        </div>

        {/* Your Details / Bill To */}
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-8 mb-8">
          <DetailsFields title="Your Details" value={yourDetails} onChange={setYourDetails} />
          <DetailsFields title="Bill To" value={billTo} onChange={setBillTo} />
        </div>

        {/* Meta fields */}
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-4 mb-8">
          <div>
            <label className={labelClass}>Invoice Date</label>
            <input
              type="date"
              className={inputClass}
              value={invoiceDate}
              onChange={(e) => setInvoiceDate(e.target.value)}
            />
          </div>
          <div>
            <label className={labelClass}>Payment Terms</label>
            <input
              className={inputClass}
              placeholder="Net 30"
              value={paymentTerms}
              onChange={(e) => setPaymentTerms(e.target.value)}
            />
          </div>
          <div>
            <label className={labelClass}>Due Date</label>
            <input
              type="date"
              className={inputClass}
              value={dueDate}
              onChange={(e) => setDueDate(e.target.value)}
            />
          </div>
          <div>
            <label className={labelClass}>PO Number</label>
            <input className={inputClass} value={poNumber} onChange={(e) => setPoNumber(e.target.value)} />
          </div>
        </div>

        {/* Line items */}
        <div className="mb-3 overflow-x-auto">
          <table className="w-full text-sm min-w-[520px]">
            <thead>
              <tr className="text-left text-xs text-slate-500 dark:text-slate-400">
                <th className="pb-2 font-medium">Item</th>
                <th className="pb-2 font-medium w-24">Quantity</th>
                <th className="pb-2 font-medium w-28">Rate</th>
                <th className="pb-2 font-medium w-28 text-right">Amount</th>
                <th className="pb-2 w-8"></th>
              </tr>
            </thead>
            <tbody>
              {lineItems.map((item) => (
                <tr key={item.id}>
                  <td className="py-1.5 pr-2">
                    <input
                      className={inputClass}
                      value={item.item}
                      onChange={(e) => updateLineItem(item.id, { item: e.target.value })}
                    />
                  </td>
                  <td className="py-1.5 pr-2">
                    <input
                      type="number"
                      min={0}
                      className={inputClass}
                      value={item.quantity}
                      onChange={(e) => updateLineItem(item.id, { quantity: Number(e.target.value) })}
                    />
                  </td>
                  <td className="py-1.5 pr-2">
                    <input
                      type="number"
                      min={0}
                      step="0.01"
                      className={inputClass}
                      value={item.rate}
                      onChange={(e) => updateLineItem(item.id, { rate: Number(e.target.value) })}
                    />
                  </td>
                  <td className="py-1.5 pr-2 text-right font-medium">
                    {formatMoney((Number(item.quantity) || 0) * (Number(item.rate) || 0))}
                  </td>
                  <td className="py-1.5">
                    <button
                      type="button"
                      onClick={() => removeLineItem(item.id)}
                      className="text-slate-400 hover:text-red-500"
                      title="Remove line item"
                    >
                      <Trash2 size={16} />
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
        <button
          type="button"
          onClick={addLineItem}
          className="flex items-center gap-1.5 text-sm font-medium text-indigo-600 dark:text-indigo-400 mb-8"
        >
          <Plus size={16} />
          Add Line Item
        </button>

        {/* Totals */}
        <div className="flex justify-end mb-8">
          <div className="w-full sm:w-80 space-y-3">
            <div className="flex items-center justify-between text-sm">
              <span className="text-slate-500 dark:text-slate-400">Subtotal</span>
              <span className="font-medium">{formatMoney(totals.subtotal)}</span>
            </div>
            <div className="flex items-center justify-between text-sm gap-3">
              <span className="text-slate-500 dark:text-slate-400 shrink-0">Discount (%)</span>
              <input
                type="number"
                min={0}
                className={`${inputClass} w-24 text-right`}
                value={discount}
                onChange={(e) => setDiscount(Number(e.target.value))}
              />
            </div>
            <div className="flex items-center justify-between text-sm gap-3">
              <span className="text-slate-500 dark:text-slate-400 shrink-0">Tax (%)</span>
              <input
                type="number"
                min={0}
                className={`${inputClass} w-24 text-right`}
                value={tax}
                onChange={(e) => setTax(Number(e.target.value))}
              />
            </div>
            <div className="flex items-center justify-between text-sm gap-3">
              <span className="text-slate-500 dark:text-slate-400 shrink-0">Shipping</span>
              <input
                type="number"
                min={0}
                step="0.01"
                className={`${inputClass} w-24 text-right`}
                value={shipping}
                onChange={(e) => setShipping(Number(e.target.value))}
              />
            </div>

            <div className="border-t border-slate-200 dark:border-slate-800 pt-3 flex items-center justify-between">
              <span className="font-semibold">Total</span>
              <span className="font-semibold">{formatMoney(totals.total)}</span>
            </div>

            <div className="flex items-center justify-between text-sm gap-3">
              <span className="text-slate-500 dark:text-slate-400 shrink-0">Amount Paid</span>
              <input
                type="number"
                min={0}
                step="0.01"
                className={`${inputClass} w-24 text-right`}
                value={amountPaid}
                onChange={(e) => setAmountPaid(Number(e.target.value))}
              />
            </div>

            <div className="flex items-center justify-between rounded-xl bg-indigo-50 dark:bg-indigo-500/10 px-4 py-3">
              <span className="font-semibold text-indigo-700 dark:text-indigo-400">Balance Due</span>
              <span className="font-semibold text-indigo-700 dark:text-indigo-400">
                {formatMoney(totals.balanceDue)}
              </span>
            </div>
          </div>
        </div>

        {/* Notes & Terms */}
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-6 mb-8">
          <div>
            <label className={labelClass}>Notes</label>
            <textarea
              rows={3}
              className={inputClass}
              value={notes}
              onChange={(e) => setNotes(e.target.value)}
            />
          </div>
          <div>
            <label className={labelClass}>Terms</label>
            <textarea
              rows={3}
              className={inputClass}
              value={terms}
              onChange={(e) => setTerms(e.target.value)}
            />
          </div>
        </div>

        <div className="flex justify-end">
          <Button onClick={handleDownload}>Download Invoice</Button>
        </div>
      </div>
    </ToolPageShell>
  );
}
