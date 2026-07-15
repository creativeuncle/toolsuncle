import { jsPDF } from "jspdf";
import { htmlToLines } from "./htmlToLines";

const SIDEBAR_W = 65;
const PAGE_W = 210;
const PAGE_H = 297;
const MARGIN_BOTTOM = 15;
const MAIN_X = SIDEBAR_W + 10;
const MAIN_W = PAGE_W - SIDEBAR_W - 20;
const SIDEBAR_PAD = 8;
const SIDEBAR_INNER_W = SIDEBAR_W - SIDEBAR_PAD * 2;

const ACCENT = [79, 70, 229]; // indigo-600
const SIDEBAR_BG = [30, 27, 60]; // deep indigo/navy
const SIDEBAR_TEXT = [226, 226, 240];
const SIDEBAR_MUTED = [165, 160, 200];

const SKILL_LEVELS = {
  Expert: 1,
  Experienced: 0.8,
  Skilfull: 0.6,
  Intermediate: 0.4,
  Beginner: 0.2,
};

const LANGUAGE_LEVELS = {
  "Native speaker": 1,
  "Highly proficient in speaking and writing": 0.85,
  "Very good command": 0.7,
  "Good working knowledge": 0.5,
  "Working knowledge": 0.3,
};

function fitImageSize(width, height, maxW, maxH) {
  if (!width || !height) return { width: maxW, height: maxH };
  const aspect = width / height;
  let w = maxW;
  let h = w / aspect;
  if (h > maxH) {
    h = maxH;
    w = h * aspect;
  }
  return { width: w, height: h };
}

export function generateResumePdf(data) {
  const {
    personal,
    workExperience,
    education,
    interests,
    skills,
    courses,
    languages,
    achievements,
  } = data;

  const doc = new jsPDF({ unit: "mm", format: "a4" });

  function drawSidebarBackground() {
    doc.setFillColor(...SIDEBAR_BG);
    doc.rect(0, 0, SIDEBAR_W, PAGE_H, "F");
  }

  drawSidebarBackground();

  let sy = 15;

  if (personal.photoDataUrl) {
    const { width, height } = fitImageSize(
      personal.photoWidth,
      personal.photoHeight,
      SIDEBAR_INNER_W,
      SIDEBAR_INNER_W
    );
    const px = (SIDEBAR_W - width) / 2;
    try {
      doc.addImage(personal.photoDataUrl, personal.photoFormat, px, sy, width, height, undefined, "FAST");
    } catch {
      // ignore unsupported image
    }
    sy += height + 8;
  }

  doc.setTextColor(255, 255, 255);
  doc.setFont(undefined, "bold");
  doc.setFontSize(16);
  const fullName = `${personal.firstName || ""} ${personal.lastName || ""}`.trim() || "Your Name";
  const nameLines = doc.splitTextToSize(fullName, SIDEBAR_INNER_W);
  doc.text(nameLines, SIDEBAR_W / 2, sy, { align: "center" });
  sy += nameLines.length * 6 + 6;

  function sidebarSectionHeading(label) {
    doc.setTextColor(...ACCENT.map((c) => Math.min(255, c + 60)));
    doc.setFont(undefined, "bold");
    doc.setFontSize(10.5);
    doc.text(label.toUpperCase(), SIDEBAR_PAD, sy);
    sy += 2;
    doc.setDrawColor(...SIDEBAR_MUTED);
    doc.line(SIDEBAR_PAD, sy, SIDEBAR_W - SIDEBAR_PAD, sy);
    sy += 5;
  }

  function sidebarText(text, opts = {}) {
    doc.setFont(undefined, opts.bold ? "bold" : "normal");
    doc.setFontSize(opts.size || 9);
    doc.setTextColor(...(opts.muted ? SIDEBAR_MUTED : SIDEBAR_TEXT));
    const lines = doc.splitTextToSize(text, SIDEBAR_INNER_W);
    doc.text(lines, SIDEBAR_PAD, sy);
    sy += lines.length * 4.2;
  }

  function sidebarBar(label, ratio) {
    doc.setFont(undefined, "normal");
    doc.setFontSize(9);
    doc.setTextColor(...SIDEBAR_TEXT);
    doc.text(label, SIDEBAR_PAD, sy);
    sy += 3;
    const barW = SIDEBAR_INNER_W;
    const barH = 2;
    doc.setFillColor(70, 65, 110);
    doc.roundedRect(SIDEBAR_PAD, sy, barW, barH, 1, 1, "F");
    doc.setFillColor(...ACCENT.map((c) => Math.min(255, c + 40)));
    doc.roundedRect(SIDEBAR_PAD, sy, Math.max(barW * ratio, 3), barH, 1, 1, "F");
    sy += barH + 4;
  }

  // Contact
  sidebarSectionHeading("Contact");
  const contactLines = [
    personal.email,
    personal.phone,
    personal.address,
    [personal.city, personal.zipCode].filter(Boolean).join(", "),
  ].filter(Boolean);
  contactLines.forEach((line) => sidebarText(line, { size: 9 }));
  sy += 4;

  // Additional info
  const additionalPairs = [
    ["Date of Birth", personal.dob],
    ["Gender", personal.gender],
    ["Nationality", personal.nationality],
    ["Marital Status", personal.maritalStatus],
    ["LinkedIn", personal.linkedin],
    ["Website", personal.website],
  ].filter(([, v]) => v);

  if (additionalPairs.length) {
    sidebarSectionHeading("Additional Info");
    additionalPairs.forEach(([label, value]) => {
      sidebarText(label, { bold: true, size: 8.5 });
      sidebarText(value, { size: 9 });
      sy += 1.5;
    });
    sy += 2.5;
  }

  // Skills
  const filledSkills = skills.filter((s) => s.skill);
  if (filledSkills.length) {
    sidebarSectionHeading("Skills");
    filledSkills.forEach((s) => sidebarBar(s.skill, SKILL_LEVELS[s.level] ?? 0.6));
    sy += 2;
  }

  // Languages
  const filledLanguages = languages.filter((l) => l.language);
  if (filledLanguages.length) {
    sidebarSectionHeading("Languages");
    filledLanguages.forEach((l) => sidebarBar(l.language, LANGUAGE_LEVELS[l.level] ?? 0.6));
    sy += 2;
  }

  // Interests
  const filledInterests = interests.filter((i) => i.hobby);
  if (filledInterests.length) {
    sidebarSectionHeading("Interests");
    sidebarText(filledInterests.map((i) => i.hobby).join(", "), { size: 9 });
  }

  // ---- Main column ----
  let my = 18;

  function ensureSpace(needed) {
    if (my + needed > PAGE_H - MARGIN_BOTTOM) {
      doc.addPage();
      my = 18;
    }
  }

  function mainSectionHeading(label) {
    ensureSpace(14);
    doc.setTextColor(...ACCENT);
    doc.setFont(undefined, "bold");
    doc.setFontSize(13);
    doc.text(label, MAIN_X, my);
    my += 2;
    doc.setDrawColor(...ACCENT);
    doc.setLineWidth(0.6);
    doc.line(MAIN_X, my, MAIN_X + MAIN_W, my);
    doc.setLineWidth(0.2);
    my += 7;
  }

  function entryHeader(title, subtitle, dateRange) {
    ensureSpace(10);
    doc.setFont(undefined, "bold");
    doc.setFontSize(11);
    doc.setTextColor(20, 20, 30);
    doc.text(title || "-", MAIN_X, my);
    if (dateRange) {
      doc.setFont(undefined, "normal");
      doc.setFontSize(9);
      doc.setTextColor(120, 120, 130);
      doc.text(dateRange, MAIN_X + MAIN_W, my, { align: "right" });
    }
    my += 5;
    if (subtitle) {
      doc.setFont(undefined, "italic");
      doc.setFontSize(9.5);
      doc.setTextColor(90, 90, 100);
      doc.text(subtitle, MAIN_X, my);
      my += 5;
    }
  }

  function entryDescription(html) {
    const lines = htmlToLines(html);
    if (!lines.length) return;
    doc.setFont(undefined, "normal");
    doc.setFontSize(9.5);
    doc.setTextColor(60, 60, 70);
    lines.forEach((line) => {
      const wrapped = doc.splitTextToSize(line, MAIN_W - 2);
      ensureSpace(wrapped.length * 4.6 + 2);
      doc.text(wrapped, MAIN_X, my);
      my += wrapped.length * 4.6;
    });
    my += 3;
  }

  function dateLabel(start, end) {
    if (!start && !end) return "";
    return `${start || "-"} — ${end || "Present"}`;
  }

  const filledWork = workExperience.filter((w) => w.jobTitle || w.company);
  if (filledWork.length) {
    mainSectionHeading("Work Experience");
    filledWork.forEach((w) => {
      entryHeader(w.jobTitle, [w.company, w.city].filter(Boolean).join(" · "), dateLabel(w.startDate, w.endDate));
      entryDescription(w.description);
      my += 2;
    });
  }

  const filledEdu = education.filter((e) => e.degree || e.school);
  if (filledEdu.length) {
    mainSectionHeading("Education & Qualifications");
    filledEdu.forEach((e) => {
      entryHeader(e.degree, [e.school, e.city].filter(Boolean).join(" · "), dateLabel(e.startDate, e.endDate));
      entryDescription(e.description);
      my += 2;
    });
  }

  const filledCourses = courses.filter((c) => c.course || c.institution);
  if (filledCourses.length) {
    mainSectionHeading("Courses");
    filledCourses.forEach((c) => {
      entryHeader(c.course, c.institution, dateLabel(c.startDate, c.endDate));
      entryDescription(c.description);
      my += 2;
    });
  }

  if (achievements && achievements.trim() && achievements !== "<p></p>") {
    mainSectionHeading("Achievements");
    entryDescription(achievements);
  }

  const fileName = `resume-${(personal.firstName || "resume").toLowerCase().replace(/\s+/g, "-")}.pdf`;
  doc.save(fileName);
}
