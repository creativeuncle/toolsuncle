import { useRef, useState } from "react";
import { Upload, Download, FileImage } from "lucide-react";
import html2canvas from "html2canvas-pro";
import { jsPDF } from "jspdf";
import { tools } from "../config/tools";
import { businessCardTemplates } from "../config/businessCardTemplates";
import ToolPageShell from "../components/ToolPageShell";
import Button from "../components/Button";
import BusinessCardPreview from "../components/BusinessCardPreview";

const tool = tools.find((t) => t.id === "business-card-maker");

const inputClass =
  "w-full rounded-xl border border-slate-300 dark:border-slate-700 bg-transparent px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-indigo-500";
const labelClass = "block text-xs font-medium text-slate-500 dark:text-slate-400 mb-1";

export default function BusinessCardMaker() {
  const fileInputRef = useRef(null);
  const cardRef = useRef(null);

  const [templateId, setTemplateId] = useState(businessCardTemplates[0].id);
  const [fields, setFields] = useState({
    fullName: "",
    jobTitle: "",
    company: "",
    phone: "",
    email: "",
    website: "",
    address: "",
    logoDataUrl: "",
  });
  const [downloading, setDownloading] = useState(false);

  const template = businessCardTemplates.find((t) => t.id === templateId);
  const setField = (key, value) => setFields((prev) => ({ ...prev, [key]: value }));

  const handleLogoChange = (e) => {
    const file = e.target.files?.[0];
    if (!file) return;
    const reader = new FileReader();
    reader.onload = () => setField("logoDataUrl", reader.result);
    reader.readAsDataURL(file);
  };

  const renderToCanvas = async () => {
    return html2canvas(cardRef.current, { scale: 4, backgroundColor: null, useCORS: true });
  };

  const handleDownloadPng = async () => {
    setDownloading(true);
    try {
      const canvas = await renderToCanvas();
      const link = document.createElement("a");
      link.href = canvas.toDataURL("image/png");
      link.download = `business-card-${(fields.fullName || "card").toLowerCase().replace(/\s+/g, "-")}.png`;
      link.click();
    } finally {
      setDownloading(false);
    }
  };

  const handleDownloadPdf = async () => {
    setDownloading(true);
    try {
      const canvas = await renderToCanvas();
      const imgData = canvas.toDataURL("image/png");
      const doc = new jsPDF({ unit: "mm", format: [89, 51], orientation: "landscape" });
      doc.addImage(imgData, "PNG", 0, 0, 89, 51);
      doc.save(`business-card-${(fields.fullName || "card").toLowerCase().replace(/\s+/g, "-")}.pdf`);
    } finally {
      setDownloading(false);
    }
  };

  return (
    <ToolPageShell icon={tool.icon} color={tool.color} title={tool.name} description={tool.description}>
      <div className="max-w-5xl space-y-8">
        <div>
          <h3 className="text-sm font-semibold mb-3">Choose a template</h3>
          <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-5 gap-3">
            {businessCardTemplates.map((t) => (
              <button
                key={t.id}
                type="button"
                onClick={() => setTemplateId(t.id)}
                className={`rounded-xl p-2 border-2 transition-colors ${
                  t.id === templateId
                    ? "border-indigo-500"
                    : "border-transparent hover:border-slate-300 dark:hover:border-slate-700"
                }`}
              >
                <div className="pointer-events-none">
                  <BusinessCardPreview template={t} fields={fields} width={130} />
                </div>
                <p className="mt-2 text-xs font-medium text-center truncate">{t.name}</p>
              </button>
            ))}
          </div>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-[1fr_auto] gap-8 items-start">
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div>
              <label className={labelClass}>Full Name *</label>
              <input className={inputClass} value={fields.fullName} onChange={(e) => setField("fullName", e.target.value)} placeholder="e.g. Priya Sharma" />
            </div>
            <div>
              <label className={labelClass}>Job Title</label>
              <input className={inputClass} value={fields.jobTitle} onChange={(e) => setField("jobTitle", e.target.value)} placeholder="e.g. Creative Director" />
            </div>
            <div>
              <label className={labelClass}>Company *</label>
              <input className={inputClass} value={fields.company} onChange={(e) => setField("company", e.target.value)} placeholder="e.g. Acme Studio" />
            </div>
            <div>
              <label className={labelClass}>Phone</label>
              <input className={inputClass} value={fields.phone} onChange={(e) => setField("phone", e.target.value)} placeholder="e.g. +91 98765 43210" />
            </div>
            <div>
              <label className={labelClass}>Email</label>
              <input className={inputClass} value={fields.email} onChange={(e) => setField("email", e.target.value)} placeholder="e.g. priya@acme.com" />
            </div>
            <div>
              <label className={labelClass}>Website</label>
              <input className={inputClass} value={fields.website} onChange={(e) => setField("website", e.target.value)} placeholder="e.g. acme.com" />
            </div>
            <div className="sm:col-span-2">
              <label className={labelClass}>Address</label>
              <input className={inputClass} value={fields.address} onChange={(e) => setField("address", e.target.value)} placeholder="e.g. Ahmedabad, India" />
            </div>
            <div className="sm:col-span-2">
              <label className={labelClass}>Logo (optional)</label>
              <button
                type="button"
                onClick={() => fileInputRef.current?.click()}
                className="flex items-center gap-2 rounded-xl border border-dashed border-slate-300 dark:border-slate-700 hover:border-indigo-400 dark:hover:border-indigo-500 px-3 py-2 text-sm text-slate-500 dark:text-slate-400 transition-colors"
              >
                {fields.logoDataUrl ? (
                  <img src={fields.logoDataUrl} alt="Logo" className="h-6 object-contain" />
                ) : (
                  <Upload size={16} />
                )}
                {fields.logoDataUrl ? "Change logo" : "Upload logo"}
              </button>
              <input ref={fileInputRef} type="file" accept="image/png,image/jpeg" className="hidden" onChange={handleLogoChange} />
            </div>
          </div>

          <div className="flex flex-col items-center gap-4">
            <p className="text-xs font-medium text-slate-500 dark:text-slate-400">Live Preview</p>
            <BusinessCardPreview ref={cardRef} template={template} fields={fields} width={340} />
            <div className="flex gap-3">
              <Button variant="secondary" onClick={handleDownloadPng} loading={downloading}>
                <FileImage size={16} />
                PNG
              </Button>
              <Button onClick={handleDownloadPdf} loading={downloading}>
                <Download size={16} />
                PDF
              </Button>
            </div>
          </div>
        </div>
      </div>
    </ToolPageShell>
  );
}
