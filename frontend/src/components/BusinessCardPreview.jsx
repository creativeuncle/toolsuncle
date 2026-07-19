import { forwardRef } from "react";
import { Phone, Mail, Globe, MapPin } from "lucide-react";

const FONT_STACKS = {
  serif: "'Georgia', 'Times New Roman', serif",
  sans: "'Inter', 'Helvetica Neue', Arial, sans-serif",
  mono: "'Courier New', monospace",
};

function initials(name) {
  return (name || "")
    .trim()
    .split(/\s+/)
    .slice(0, 2)
    .map((w) => w[0]?.toUpperCase())
    .join("") || "?";
}

function ContactLines({ fields, color, iconColor, size = 9 }) {
  const rows = [
    [Phone, fields.phone],
    [Mail, fields.email],
    [Globe, fields.website],
    [MapPin, fields.address],
  ].filter(([, v]) => v);

  return (
    <div style={{ display: "flex", flexDirection: "column", gap: 3 }}>
      {rows.map(([Icon, value], i) => (
        <div key={i} style={{ display: "flex", alignItems: "center", gap: 5, color, fontSize: size }}>
          <Icon size={size + 3} color={iconColor} strokeWidth={2} />
          <span>{value}</span>
        </div>
      ))}
    </div>
  );
}

function LogoOrInitials({ fields, size, bg, color }) {
  if (fields.logoDataUrl) {
    return (
      <img
        src={fields.logoDataUrl}
        alt="Logo"
        style={{ width: size, height: size, objectFit: "contain", borderRadius: 8 }}
      />
    );
  }
  return (
    <div
      style={{
        width: size,
        height: size,
        borderRadius: "50%",
        background: bg,
        color,
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
        fontWeight: 700,
        fontSize: size * 0.4,
      }}
    >
      {initials(fields.fullName)}
    </div>
  );
}

const BusinessCardPreview = forwardRef(function BusinessCardPreview({ template: t, fields, width = 350 }, ref) {
  const height = width / 1.75;
  const font = FONT_STACKS[t.font] || FONT_STACKS.sans;
  const base = {
    width,
    height,
    position: "relative",
    overflow: "hidden",
    fontFamily: font,
    boxShadow: "0 4px 20px rgba(0,0,0,0.15)",
    borderRadius: 6,
  };

  if (t.layout === "left-panel") {
    return (
      <div ref={ref} style={{ ...base, display: "flex", background: t.bodyBg }}>
        <div
          style={{
            width: "36%",
            background: t.panelBg,
            color: t.panelText,
            display: "flex",
            flexDirection: "column",
            alignItems: "center",
            justifyContent: "center",
            gap: 8,
            padding: 8,
          }}
        >
          <LogoOrInitials fields={fields} size={width * 0.16} bg={t.accent} color={t.panelBg} />
        </div>
        <div style={{ flex: 1, padding: width * 0.055, display: "flex", flexDirection: "column", justifyContent: "center", gap: 6 }}>
          <div>
            <div style={{ fontWeight: 700, fontSize: width * 0.052, color: t.bodyText }}>{fields.fullName || "Your Name"}</div>
            <div style={{ fontSize: width * 0.032, color: t.accent, marginTop: 2 }}>{fields.jobTitle}</div>
            <div style={{ fontSize: width * 0.03, color: t.bodyText, opacity: 0.75 }}>{fields.company}</div>
          </div>
          <div style={{ height: 1, background: t.accent, opacity: 0.4, width: "60%" }} />
          <ContactLines fields={fields} color={t.bodyText} iconColor={t.accent} size={width * 0.026} />
        </div>
      </div>
    );
  }

  if (t.layout === "minimal-border") {
    return (
      <div ref={ref} style={{ ...base, background: t.bodyBg, border: `2px solid ${t.borderColor}`, padding: width * 0.06, boxSizing: "border-box", display: "flex", flexDirection: "column", justifyContent: "space-between" }}>
        <div>
          <div style={{ fontWeight: 700, fontSize: width * 0.06, color: t.bodyText }}>{fields.fullName || "Your Name"}</div>
          <div style={{ fontSize: width * 0.032, color: t.accent, marginTop: 2 }}>
            {[fields.jobTitle, fields.company].filter(Boolean).join(" · ")}
          </div>
        </div>
        <div style={{ height: 1, background: t.accent, opacity: 0.3, margin: `${width * 0.03}px 0` }} />
        <ContactLines fields={fields} color={t.bodyText} iconColor={t.accent} size={width * 0.026} />
      </div>
    );
  }

  if (t.layout === "top-band") {
    return (
      <div ref={ref} style={{ ...base, background: t.bodyBg, display: "flex", flexDirection: "column" }}>
        <div style={{ background: t.bandGradient, color: t.bandText, padding: `${width * 0.045}px ${width * 0.06}px`, display: "flex", alignItems: "center", gap: 10 }}>
          <LogoOrInitials fields={fields} size={width * 0.14} bg="rgba(255,255,255,0.25)" color={t.bandText} />
          <div>
            <div style={{ fontWeight: 700, fontSize: width * 0.05 }}>{fields.fullName || "Your Name"}</div>
            <div style={{ fontSize: width * 0.028, opacity: 0.9 }}>
              {[fields.jobTitle, fields.company].filter(Boolean).join(" · ")}
            </div>
          </div>
        </div>
        <div style={{ padding: `${width * 0.05}px ${width * 0.06}px`, flex: 1, display: "flex", alignItems: "center" }}>
          <ContactLines fields={fields} color={t.bodyText} iconColor={t.accent} size={width * 0.026} />
        </div>
      </div>
    );
  }

  if (t.layout === "diagonal-split") {
    return (
      <div ref={ref} style={{ ...base, background: t.bodyBg }}>
        <div
          style={{
            position: "absolute",
            inset: 0,
            background: t.blockBg,
            color: t.blockText,
            clipPath: "polygon(0 0, 62% 0, 38% 100%, 0 100%)",
            display: "flex",
            flexDirection: "column",
            justifyContent: "center",
            paddingLeft: width * 0.05,
            width: "70%",
          }}
        >
          <div style={{ fontWeight: 700, fontSize: width * 0.05 }}>{fields.fullName || "Your Name"}</div>
          <div style={{ fontSize: width * 0.028, opacity: 0.9, marginTop: 2 }}>{fields.jobTitle}</div>
        </div>
        <div style={{ position: "absolute", right: width * 0.05, top: 0, bottom: 0, width: "48%", display: "flex", flexDirection: "column", justifyContent: "center", gap: 6 }}>
          <div style={{ fontSize: width * 0.03, fontWeight: 600, color: t.bodyText }}>{fields.company}</div>
          <ContactLines fields={fields} color={t.bodyText} iconColor={t.accent} size={width * 0.024} />
        </div>
      </div>
    );
  }

  if (t.layout === "centered") {
    return (
      <div ref={ref} style={{ ...base, background: t.bodyBg, display: "flex", flexDirection: "column", alignItems: "center", justifyContent: "center", textAlign: "center", padding: width * 0.05 }}>
        <LogoOrInitials fields={fields} size={width * 0.16} bg={t.accent} color={t.bodyBg} />
        <div style={{ fontWeight: 700, fontSize: width * 0.055, color: t.bodyText, marginTop: 8, letterSpacing: 1 }}>
          {fields.fullName || "Your Name"}
        </div>
        <div style={{ fontSize: width * 0.03, color: t.accent, marginTop: 2 }}>
          {[fields.jobTitle, fields.company].filter(Boolean).join(" · ")}
        </div>
        <div style={{ height: 1, background: t.accent, opacity: 0.4, width: "40%", margin: `${width * 0.025}px 0` }} />
        <ContactLines fields={fields} color={t.bodyText} iconColor={t.accent} size={width * 0.024} />
      </div>
    );
  }

  if (t.layout === "circles") {
    return (
      <div ref={ref} style={{ ...base, background: t.bodyBg, padding: width * 0.06, boxSizing: "border-box", display: "flex", flexDirection: "column", justifyContent: "space-between" }}>
        <div style={{ position: "absolute", width: width * 0.4, height: width * 0.4, borderRadius: "50%", background: t.circleColor, opacity: 0.35, top: -width * 0.15, right: -width * 0.1 }} />
        <div style={{ position: "absolute", width: width * 0.22, height: width * 0.22, borderRadius: "50%", background: t.accent, opacity: 0.25, bottom: -width * 0.08, right: width * 0.12 }} />
        <div style={{ position: "relative" }}>
          <div style={{ fontWeight: 700, fontSize: width * 0.055, color: t.bodyText }}>{fields.fullName || "Your Name"}</div>
          <div style={{ fontSize: width * 0.03, color: t.accent, marginTop: 2 }}>
            {[fields.jobTitle, fields.company].filter(Boolean).join(" · ")}
          </div>
        </div>
        <div style={{ position: "relative" }}>
          <ContactLines fields={fields} color={t.bodyText} iconColor={t.accent} size={width * 0.026} />
        </div>
      </div>
    );
  }

  return null;
});

export default BusinessCardPreview;
