import { useEffect, useRef, useState } from "react";
import { Upload, Download, FileImage, QrCode } from "lucide-react";
import html2canvas from "html2canvas-pro";
import { jsPDF } from "jspdf";
import QRCodeLib from "qrcode";
import { tools } from "../config/tools";
import { businessCardTemplates } from "../config/businessCardTemplates";
import ToolPageShell from "../components/ToolPageShell";
import Button from "../components/Button";
import BusinessCardPreview from "../components/BusinessCardPreview";

const tool = tools.find((t) => t.id === "business-card-maker");

const inputClass =
  "w-full rounded-xl border border-slate-300 dark:border-slate-700 bg-transparent px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-indigo-500";
const labelClass = "block text-xs font-medium text-slate-500 dark:text-slate-400 mb-1";

const OFFSCREEN_STYLE = { position: "absolute", left: -9999, top: 0, pointerEvents: "none" };

const SAMPLE_FIELDS = {
  fullName: "Your Name",
  jobTitle: "Job Title",
  company: "Company Name",
  phone: "+91 98765 43210",
  email: "you@email.com",
  website: "yourwebsite.com",
  address: "",
  logoDataUrl: "",
};

const THUMB_WIDTH = 260;

export default function BusinessCardMaker() {
  const fileInputRef = useRef(null);
  const frontRef = useRef(null);
  const backRef = useRef(null);
  const thumbRefs = useRef({});

  const [templateId, setTemplateId] = useState(businessCardTemplates[0].id);
  const [side, setSide] = useState("front");
  const [templateThumbs, setTemplateThumbs] = useState({});
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
  const [backFields, setBackFields] = useState({ tagline: "", note: "", showQr: false });
  const [qrDataUrl, setQrDataUrl] = useState("");
  const [downloading, setDownloading] = useState(false);

  const template = businessCardTemplates.find((t) => t.id === templateId);
  const setField = (key, value) => setFields((prev) => ({ ...prev, [key]: value }));
  const setBackField = (key, value) => setBackFields((prev) => ({ ...prev, [key]: value }));

  useEffect(() => {
    if (!backFields.showQr) {
      setQrDataUrl("");
      return;
    }
    const target = fields.website || fields.email || fields.phone;
    if (!target) {
      setQrDataUrl("");
      return;
    }
    QRCodeLib.toDataURL(target, { width: 240, margin: 1 })
      .then(setQrDataUrl)
      .catch(() => setQrDataUrl(""));
  }, [backFields.showQr, fields.website, fields.email, fields.phone]);

  // Render every template once with sample data and bake it to a static
  // image for the picker grid, instead of live-rendering the HTML at a
  // tiny size (which is what caused decorative elements to visually
  // overlap neighboring cards at small widths).
  useEffect(() => {
    let cancelled = false;
    async function generateThumbnails() {
      const results = {};
      for (const t of businessCardTemplates) {
        const node = thumbRefs.current[t.id];
        if (!node) continue;
        try {
          const canvas = await html2canvas(node, { scale: 2, backgroundColor: null, useCORS: true });
          results[t.id] = canvas.toDataURL("image/png");
        } catch {
          // fall back to live render for this template if capture fails
        }
      }
      if (!cancelled) setTemplateThumbs(results);
    }
    generateThumbnails();
    return () => {
      cancelled = true;
    };
  }, []);

  const handleLogoChange = (e) => {
    const file = e.target.files?.[0];
    if (!file) return;
    const reader = new FileReader();
    reader.onload = () => setField("logoDataUrl", reader.result);
    reader.readAsDataURL(file);
  };

  // Off-screen nodes are already rendered at 1050px wide (~300dpi for a
  // 3.5in card), so scale: 1 here is print resolution, not a thumbnail.
  const captureSide = async (node) => html2canvas(node, { scale: 1, backgroundColor: null, useCORS: true });

  const fileBase = (fields.fullName || "card").toLowerCase().replace(/\s+/g, "-");

  const handleDownloadPng = async () => {
    setDownloading(true);
    try {
      const node = side === "front" ? frontRef.current : backRef.current;
      const canvas = await captureSide(node);
      const link = document.createElement("a");
      link.href = canvas.toDataURL("image/png");
      link.download = `business-card-${fileBase}-${side}.png`;
      link.click();
    } finally {
      setDownloading(false);
    }
  };

  const handleDownloadPdf = async () => {
    setDownloading(true);
    try {
      const node = side === "front" ? frontRef.current : backRef.current;
      const canvas = await captureSide(node);
      const doc = new jsPDF({ unit: "mm", format: [89, 51], orientation: "landscape" });
      doc.addImage(canvas.toDataURL("image/png"), "PNG", 0, 0, 89, 51);
      doc.save(`business-card-${fileBase}-${side}.pdf`);
    } finally {
      setDownloading(false);
    }
  };

  const handleDownloadBothPdf = async () => {
    setDownloading(true);
    try {
      const frontCanvas = await captureSide(frontRef.current);
      const backCanvas = await captureSide(backRef.current);
      const doc = new jsPDF({ unit: "mm", format: [89, 51], orientation: "landscape" });
      doc.addImage(frontCanvas.toDataURL("image/png"), "PNG", 0, 0, 89, 51);
      doc.addPage([89, 51], "landscape");
      doc.addImage(backCanvas.toDataURL("image/png"), "PNG", 0, 0, 89, 51);
      doc.save(`business-card-${fileBase}-both-sides.pdf`);
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
                {templateThumbs[t.id] ? (
                  <img
                    src={templateThumbs[t.id]}
                    alt={t.name}
                    className="w-full rounded-lg pointer-events-none"
                    style={{ aspectRatio: 1.75 }}
                  />
                ) : (
                  <div className="pointer-events-none">
                    <BusinessCardPreview template={t} fields={SAMPLE_FIELDS} width={130} />
                  </div>
                )}
                <p className="mt-2 text-xs font-medium text-center truncate">{t.name}</p>
              </button>
            ))}
          </div>
        </div>

        <div className="inline-flex rounded-lg border border-slate-200 dark:border-slate-700 overflow-hidden">
          {["front", "back"].map((s) => (
            <button
              key={s}
              type="button"
              onClick={() => setSide(s)}
              className={`px-4 py-1.5 text-sm font-medium capitalize transition-colors ${
                side === s
                  ? "bg-indigo-600 text-white"
                  : "bg-white dark:bg-slate-900 text-slate-600 dark:text-slate-300 hover:bg-slate-50 dark:hover:bg-slate-800"
              }`}
            >
              {s} side
            </button>
          ))}
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-[1fr_auto] gap-8 items-start">
          {side === "front" ? (
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
                <p className="mt-1 text-xs text-slate-400 dark:text-slate-500">Also used on the back side.</p>
              </div>
            </div>
          ) : (
            <div className="grid grid-cols-1 gap-4">
              <p className="text-xs text-slate-400 dark:text-slate-500 -mb-1">
                The back side reuses your Company Name and Logo from the front.
              </p>
              <div>
                <label className={labelClass}>Tagline / Slogan</label>
                <input
                  className={inputClass}
                  value={backFields.tagline}
                  onChange={(e) => setBackField("tagline", e.target.value)}
                  placeholder="e.g. Designing tomorrow, today."
                />
              </div>
              <div>
                <label className={labelClass}>Back Note (address, socials, hours…)</label>
                <textarea
                  rows={3}
                  className={inputClass}
                  value={backFields.note}
                  onChange={(e) => setBackField("note", e.target.value)}
                  placeholder={"e.g. @acmestudio\nMon–Fri, 9am–6pm"}
                />
              </div>
              <label className="flex items-center gap-2 text-sm text-slate-600 dark:text-slate-300">
                <input
                  type="checkbox"
                  checked={backFields.showQr}
                  onChange={(e) => setBackField("showQr", e.target.checked)}
                  className="rounded accent-indigo-600"
                />
                <QrCode size={16} />
                Show QR code (links to Website, or Email/Phone if no website)
              </label>
            </div>
          )}

          <div className="flex flex-col items-center gap-4">
            <p className="text-xs font-medium text-slate-500 dark:text-slate-400">Live Preview — {side} side</p>
            {side === "front" ? (
              <BusinessCardPreview key="front-visible" template={template} fields={fields} width={340} />
            ) : (
              <BusinessCardPreview
                key="back-visible"
                template={template}
                fields={fields}
                backFields={backFields}
                qrDataUrl={qrDataUrl}
                side="back"
                width={340}
              />
            )}
            <div className="flex flex-wrap justify-center gap-3">
              <Button variant="secondary" onClick={handleDownloadPng} loading={downloading}>
                <FileImage size={16} />
                PNG
              </Button>
              <Button onClick={handleDownloadPdf} loading={downloading}>
                <Download size={16} />
                PDF
              </Button>
            </div>
            <Button variant="secondary" onClick={handleDownloadBothPdf} loading={downloading}>
              <Download size={16} />
              Download Both Sides (PDF)
            </Button>
          </div>
        </div>
      </div>

      {/* Off-screen mounts so both sides are always capturable, regardless of which tab is active */}
      <div style={OFFSCREEN_STYLE} aria-hidden="true">
        <BusinessCardPreview ref={frontRef} template={template} fields={fields} width={1050} />
      </div>
      <div style={OFFSCREEN_STYLE} aria-hidden="true">
        <BusinessCardPreview ref={backRef} template={template} fields={fields} backFields={backFields} qrDataUrl={qrDataUrl} side="back" width={1050} />
      </div>

      {/* Off-screen source nodes used once to bake static picker thumbnails */}
      <div style={OFFSCREEN_STYLE} aria-hidden="true">
        {businessCardTemplates.map((t) => (
          <div key={t.id} ref={(el) => (thumbRefs.current[t.id] = el)}>
            <BusinessCardPreview template={t} fields={SAMPLE_FIELDS} width={THUMB_WIDTH} />
          </div>
        ))}
      </div>
    </ToolPageShell>
  );
}
