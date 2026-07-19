import { forwardRef } from "react";
import { Phone, Mail, Globe, MapPin } from "lucide-react";

const FONT_STACKS = {
  serif: "'Georgia', 'Times New Roman', serif",
  sans: "'Inter', 'Helvetica Neue', Arial, sans-serif",
  mono: "'Courier New', monospace",
};

function initials(name) {
  return (
    (name || "")
      .trim()
      .split(/\s+/)
      .slice(0, 2)
      .map((w) => w[0]?.toUpperCase())
      .join("") || "?"
  );
}

function ContactLines({ fields, color, iconColor, width }) {
  const rows = [
    [Phone, fields.phone],
    [Mail, fields.email],
    [Globe, fields.website],
    [MapPin, fields.address],
  ].filter(([, v]) => v);

  const fontSize = width * 0.026;

  return (
    <div style={{ display: "flex", flexDirection: "column", gap: width * 0.012 }}>
      {rows.map(([Icon, value], i) => (
        <div key={i} style={{ display: "flex", alignItems: "center", gap: width * 0.014, color, fontSize }}>
          <Icon size={fontSize + 3} color={iconColor} strokeWidth={2} style={{ flexShrink: 0 }} />
          <span style={{ whiteSpace: "nowrap", overflow: "hidden", textOverflow: "ellipsis" }}>{value}</span>
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
        style={{ width: size, height: size, objectFit: "contain", borderRadius: size * 0.15, flexShrink: 0 }}
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
        flexShrink: 0,
      }}
    >
      {initials(fields.fullName)}
    </div>
  );
}

function resolveBackColors(t) {
  const bg = t.panelBg || t.blockBg || t.bandGradient || t.bodyBg;
  const text = t.panelText || t.blockText || t.bandText || t.bodyText;
  return { bg, text };
}

const BackSide = forwardRef(function BackSide({ t, fields, backFields, width, height, qrDataUrl }, ref) {
  const { bg, text } = resolveBackColors(t);
  const font = FONT_STACKS[t.font] || FONT_STACKS.sans;

  return (
    <div
      ref={ref}
      style={{
        width,
        height,
        position: "relative",
        overflow: "hidden",
        fontFamily: font,
        boxShadow: "0 4px 20px rgba(0,0,0,0.15)",
        borderRadius: width * 0.017,
        transform: "translateZ(0)",
        isolation: "isolate",
        background: bg,
        color: text,
        display: "flex",
        flexDirection: "column",
        alignItems: "center",
        justifyContent: "center",
        textAlign: "center",
        padding: width * 0.06,
        boxSizing: "border-box",
        gap: width * 0.02,
      }}
    >
      <LogoOrInitials fields={fields} size={width * 0.17} bg={t.accent} color={bg} />
      <div style={{ fontWeight: 700, fontSize: width * 0.05, letterSpacing: 1 }}>{fields.company || "Company Name"}</div>
      {backFields.tagline && (
        <div style={{ fontSize: width * 0.028, color: t.accent, maxWidth: "85%" }}>{backFields.tagline}</div>
      )}
      {backFields.note && (
        <div style={{ fontSize: width * 0.024, opacity: 0.85, maxWidth: "85%", whiteSpace: "pre-line" }}>
          {backFields.note}
        </div>
      )}
      {backFields.showQr && qrDataUrl && (
        <img src={qrDataUrl} alt="QR code" style={{ width: width * 0.22, height: width * 0.22, marginTop: width * 0.01 }} />
      )}
    </div>
  );
});

const BusinessCardPreview = forwardRef(function BusinessCardPreview(
  { template: t, fields, width = 350, side = "front", backFields, qrDataUrl },
  ref
) {
  const height = width / 1.75;
  const font = FONT_STACKS[t.font] || FONT_STACKS.sans;
  const base = {
    width,
    height,
    position: "relative",
    overflow: "hidden",
    fontFamily: font,
    boxShadow: "0 4px 20px rgba(0,0,0,0.15)",
    borderRadius: width * 0.017,
    // Forces its own compositing layer — without this, Chromium can fail
    // to clip absolutely-positioned children at the rounded corners.
    transform: "translateZ(0)",
    isolation: "isolate",
  };

  if (side === "back") {
    return (
      <BackSide ref={ref} t={t} fields={fields} backFields={backFields || {}} width={width} height={height} qrDataUrl={qrDataUrl} />
    );
  }

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
            padding: width * 0.02,
            boxSizing: "border-box",
          }}
        >
          <LogoOrInitials fields={fields} size={width * 0.16} bg={t.accent} color={t.panelBg} />
        </div>
        <div
          style={{
            flex: 1,
            minWidth: 0,
            padding: width * 0.05,
            boxSizing: "border-box",
            display: "flex",
            flexDirection: "column",
            justifyContent: "center",
            gap: width * 0.018,
          }}
        >
          <div>
            <div style={{ fontWeight: 700, fontSize: width * 0.05, color: t.bodyText, lineHeight: 1.2, whiteSpace: "nowrap", overflow: "hidden", textOverflow: "ellipsis" }}>
              {fields.fullName || "Your Name"}
            </div>
            <div style={{ fontSize: width * 0.03, color: t.accent, marginTop: width * 0.006, whiteSpace: "nowrap", overflow: "hidden", textOverflow: "ellipsis" }}>
              {fields.jobTitle}
            </div>
            <div style={{ fontSize: width * 0.028, color: t.bodyText, opacity: 0.75, whiteSpace: "nowrap", overflow: "hidden", textOverflow: "ellipsis" }}>
              {fields.company}
            </div>
          </div>
          <div style={{ height: 1, background: t.accent, opacity: 0.4, width: "55%" }} />
          <ContactLines fields={fields} color={t.bodyText} iconColor={t.accent} width={width} />
        </div>
      </div>
    );
  }

  if (t.layout === "minimal-border") {
    return (
      <div
        ref={ref}
        style={{
          ...base,
          background: t.bodyBg,
          border: `${Math.max(1, width * 0.006)}px solid ${t.borderColor}`,
          padding: width * 0.06,
          boxSizing: "border-box",
          display: "flex",
          flexDirection: "column",
          justifyContent: "space-between",
        }}
      >
        <div>
          <div style={{ fontWeight: 700, fontSize: width * 0.058, color: t.bodyText, lineHeight: 1.2 }}>
            {fields.fullName || "Your Name"}
          </div>
          <div style={{ fontSize: width * 0.03, color: t.accent, marginTop: width * 0.006 }}>
            {[fields.jobTitle, fields.company].filter(Boolean).join(" · ")}
          </div>
        </div>
        <div style={{ height: 1, background: t.accent, opacity: 0.3, margin: `${width * 0.025}px 0` }} />
        <ContactLines fields={fields} color={t.bodyText} iconColor={t.accent} width={width} />
      </div>
    );
  }

  if (t.layout === "top-band") {
    return (
      <div ref={ref} style={{ ...base, background: t.bodyBg, display: "flex", flexDirection: "column" }}>
        <div
          style={{
            background: t.bandGradient,
            color: t.bandText,
            padding: `${width * 0.04}px ${width * 0.05}px`,
            display: "flex",
            alignItems: "center",
            gap: width * 0.03,
            boxSizing: "border-box",
          }}
        >
          <LogoOrInitials fields={fields} size={width * 0.13} bg="rgba(255,255,255,0.25)" color={t.bandText} />
          <div style={{ minWidth: 0 }}>
            <div style={{ fontWeight: 700, fontSize: width * 0.046, lineHeight: 1.2, whiteSpace: "nowrap", overflow: "hidden", textOverflow: "ellipsis" }}>
              {fields.fullName || "Your Name"}
            </div>
            <div style={{ fontSize: width * 0.026, opacity: 0.9, whiteSpace: "nowrap", overflow: "hidden", textOverflow: "ellipsis" }}>
              {[fields.jobTitle, fields.company].filter(Boolean).join(" · ")}
            </div>
          </div>
        </div>
        <div style={{ padding: `${width * 0.045}px ${width * 0.05}px`, flex: 1, display: "flex", alignItems: "center", boxSizing: "border-box" }}>
          <ContactLines fields={fields} color={t.bodyText} iconColor={t.accent} width={width} />
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
            boxSizing: "border-box",
          }}
        >
          <div style={{ fontWeight: 700, fontSize: width * 0.045, lineHeight: 1.2, maxWidth: "58%", overflow: "hidden", textOverflow: "ellipsis", whiteSpace: "nowrap" }}>
            {fields.fullName || "Your Name"}
          </div>
          <div style={{ fontSize: width * 0.026, opacity: 0.9, marginTop: width * 0.006, maxWidth: "58%", overflow: "hidden", textOverflow: "ellipsis", whiteSpace: "nowrap" }}>
            {fields.jobTitle}
          </div>
        </div>
        <div
          style={{
            position: "absolute",
            right: width * 0.05,
            top: 0,
            bottom: 0,
            width: "44%",
            display: "flex",
            flexDirection: "column",
            justifyContent: "center",
            gap: width * 0.015,
          }}
        >
          <div style={{ fontSize: width * 0.028, fontWeight: 600, color: t.bodyText, whiteSpace: "nowrap", overflow: "hidden", textOverflow: "ellipsis" }}>
            {fields.company}
          </div>
          <ContactLines fields={fields} color={t.bodyText} iconColor={t.accent} width={width * 0.85} />
        </div>
      </div>
    );
  }

  if (t.layout === "centered") {
    return (
      <div
        ref={ref}
        style={{
          ...base,
          background: t.bodyBg,
          display: "flex",
          flexDirection: "column",
          alignItems: "center",
          justifyContent: "center",
          textAlign: "center",
          padding: width * 0.05,
          boxSizing: "border-box",
          gap: width * 0.012,
        }}
      >
        <LogoOrInitials fields={fields} size={width * 0.15} bg={t.accent} color={t.bodyBg} />
        <div style={{ fontWeight: 700, fontSize: width * 0.05, color: t.bodyText, letterSpacing: 1, lineHeight: 1.2 }}>
          {fields.fullName || "Your Name"}
        </div>
        <div style={{ fontSize: width * 0.028, color: t.accent }}>
          {[fields.jobTitle, fields.company].filter(Boolean).join(" · ")}
        </div>
        <div style={{ height: 1, background: t.accent, opacity: 0.4, width: "40%" }} />
        <ContactLines fields={fields} color={t.bodyText} iconColor={t.accent} width={width * 0.9} />
      </div>
    );
  }

  if (t.layout === "circles") {
    return (
      <div
        ref={ref}
        style={{
          ...base,
          background: t.bodyBg,
          padding: width * 0.06,
          boxSizing: "border-box",
          display: "flex",
          flexDirection: "column",
          justifyContent: "space-between",
        }}
      >
        <div
          style={{
            position: "absolute",
            width: width * 0.4,
            height: width * 0.4,
            borderRadius: "50%",
            background: t.circleColor,
            opacity: 0.35,
            top: -width * 0.15,
            right: -width * 0.1,
          }}
        />
        <div
          style={{
            position: "absolute",
            width: width * 0.22,
            height: width * 0.22,
            borderRadius: "50%",
            background: t.accent,
            opacity: 0.25,
            bottom: -width * 0.08,
            right: width * 0.12,
          }}
        />
        <div style={{ position: "relative" }}>
          <div style={{ fontWeight: 700, fontSize: width * 0.05, color: t.bodyText, lineHeight: 1.2, whiteSpace: "nowrap", overflow: "hidden", textOverflow: "ellipsis", maxWidth: "80%" }}>
            {fields.fullName || "Your Name"}
          </div>
          <div style={{ fontSize: width * 0.028, color: t.accent, marginTop: width * 0.006 }}>
            {[fields.jobTitle, fields.company].filter(Boolean).join(" · ")}
          </div>
        </div>
        <div style={{ position: "relative" }}>
          <ContactLines fields={fields} color={t.bodyText} iconColor={t.accent} width={width} />
        </div>
      </div>
    );
  }

  return null;
});

export default BusinessCardPreview;
