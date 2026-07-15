import { useRef, useState } from "react";
import { Plus, Trash2, Upload, ChevronRight, ChevronLeft } from "lucide-react";
import { tools } from "../config/tools";
import ToolPageShell from "../components/ToolPageShell";
import Button from "../components/Button";
import Accordion from "../components/Accordion";
import SimpleRichTextEditor from "../components/SimpleRichTextEditor";
import { generateResumePdf } from "../utils/generateResumePdf";

const tool = tools.find((t) => t.id === "resume-builder");

const inputClass =
  "w-full rounded-xl border border-slate-300 dark:border-slate-700 bg-transparent px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-indigo-500";
const labelClass = "block text-xs font-medium text-slate-500 dark:text-slate-400 mb-1";

const SKILL_LEVEL_OPTIONS = ["Expert", "Experienced", "Skilfull", "Intermediate", "Beginner"];
const LANGUAGE_LEVEL_OPTIONS = [
  "Native speaker",
  "Highly proficient in speaking and writing",
  "Very good command",
  "Good working knowledge",
  "Working knowledge",
];

let nextId = 1;
const makeId = () => nextId++;

function Field({ label, ...props }) {
  return (
    <div>
      <label className={labelClass}>{label}</label>
      <input className={inputClass} {...props} />
    </div>
  );
}

function EntryCard({ children, onRemove }) {
  return (
    <div className="relative rounded-xl border border-slate-200 dark:border-slate-800 p-4 space-y-3">
      {onRemove && (
        <button
          type="button"
          onClick={onRemove}
          className="absolute top-3 right-3 text-slate-400 hover:text-red-500"
          title="Remove"
        >
          <Trash2 size={16} />
        </button>
      )}
      {children}
    </div>
  );
}

function AddButton({ onClick, label }) {
  return (
    <button
      type="button"
      onClick={onClick}
      className="flex items-center gap-1.5 text-sm font-medium text-indigo-600 dark:text-indigo-400"
    >
      <Plus size={16} />
      {label}
    </button>
  );
}

export default function ResumeBuilder() {
  const [step, setStep] = useState(1);
  const fileInputRef = useRef(null);

  // --- Personal details ---
  const [photoDataUrl, setPhotoDataUrl] = useState("");
  const [photoFormat, setPhotoFormat] = useState("PNG");
  const [photoDimensions, setPhotoDimensions] = useState(null);
  const [showAdditional, setShowAdditional] = useState(false);
  const [personal, setPersonal] = useState({
    firstName: "",
    lastName: "",
    email: "",
    phone: "",
    address: "",
    zipCode: "",
    city: "",
    dob: "",
    gender: "",
    nationality: "",
    maritalStatus: "",
    linkedin: "",
    website: "",
  });

  const setP = (patch) => setPersonal((prev) => ({ ...prev, ...patch }));

  const handlePhotoChange = (e) => {
    const file = e.target.files?.[0];
    if (!file) return;
    setPhotoFormat(file.type === "image/png" ? "PNG" : "JPEG");
    const reader = new FileReader();
    reader.onload = () => {
      const dataUrl = reader.result;
      const img = new Image();
      img.onload = () => {
        setPhotoDataUrl(dataUrl);
        setPhotoDimensions({ width: img.naturalWidth, height: img.naturalHeight });
      };
      img.src = dataUrl;
    };
    reader.readAsDataURL(file);
  };

  // --- Experiences ---
  const [workExperience, setWorkExperience] = useState([
    { id: makeId(), jobTitle: "", city: "", company: "", startDate: "", endDate: "", description: "" },
  ]);
  const [education, setEducation] = useState([
    { id: makeId(), degree: "", city: "", school: "", startDate: "", endDate: "", description: "" },
  ]);
  const [interests, setInterests] = useState([{ id: makeId(), hobby: "" }]);
  const [skills, setSkills] = useState([{ id: makeId(), skill: "", level: "Experienced" }]);
  const [courses, setCourses] = useState([
    { id: makeId(), course: "", institution: "", startDate: "", endDate: "", description: "" },
  ]);
  const [languages, setLanguages] = useState([{ id: makeId(), language: "", level: "Very good command" }]);
  const [achievements, setAchievements] = useState("");

  const updateItem = (setter, id, patch) =>
    setter((items) => items.map((it) => (it.id === id ? { ...it, ...patch } : it)));
  const removeItem = (setter) => (id) =>
    setter((items) => (items.length > 1 ? items.filter((it) => it.id !== id) : items));

  const handleDownload = () => {
    generateResumePdf({
      personal: { ...personal, photoDataUrl, photoFormat, photoWidth: photoDimensions?.width, photoHeight: photoDimensions?.height },
      workExperience,
      education,
      interests,
      skills,
      courses,
      languages,
      achievements,
    });
  };

  return (
    <ToolPageShell
      icon={tool.icon}
      color={tool.color}
      title={tool.name}
      description={tool.description}
    >
      <div className="max-w-3xl">
        <div className="flex items-center gap-3 mb-8 text-sm font-medium">
          <span className={step === 1 ? "text-indigo-600 dark:text-indigo-400" : "text-slate-400"}>
            1. Personal Details
          </span>
          <ChevronRight size={16} className="text-slate-300" />
          <span className={step === 2 ? "text-indigo-600 dark:text-indigo-400" : "text-slate-400"}>
            2. My Experiences
          </span>
        </div>

        {step === 1 && (
          <div className="space-y-6">
            <div>
              <label className={labelClass}>Upload Image</label>
              <button
                type="button"
                onClick={() => fileInputRef.current?.click()}
                className="flex items-center justify-center w-28 h-28 rounded-full border-2 border-dashed border-slate-300 dark:border-slate-700 hover:border-indigo-400 dark:hover:border-indigo-500 transition-colors overflow-hidden bg-slate-50 dark:bg-slate-800"
              >
                {photoDataUrl ? (
                  <img src={photoDataUrl} alt="Profile" className="w-full h-full object-cover" />
                ) : (
                  <span className="flex flex-col items-center gap-1 text-slate-400">
                    <Upload size={20} />
                    <span className="text-xs">Photo</span>
                  </span>
                )}
              </button>
              <input
                ref={fileInputRef}
                type="file"
                accept="image/png,image/jpeg"
                className="hidden"
                onChange={handlePhotoChange}
              />
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <Field label="First Name" value={personal.firstName} onChange={(e) => setP({ firstName: e.target.value })} />
              <Field label="Last Name" value={personal.lastName} onChange={(e) => setP({ lastName: e.target.value })} />
              <Field label="Email Address" value={personal.email} onChange={(e) => setP({ email: e.target.value })} />
              <Field label="Phone Number" value={personal.phone} onChange={(e) => setP({ phone: e.target.value })} />
              <Field label="Address" value={personal.address} onChange={(e) => setP({ address: e.target.value })} />
              <Field label="Zip Code" value={personal.zipCode} onChange={(e) => setP({ zipCode: e.target.value })} />
              <Field label="City/Town" value={personal.city} onChange={(e) => setP({ city: e.target.value })} />
            </div>

            <button
              type="button"
              onClick={() => setShowAdditional((s) => !s)}
              className="flex items-center gap-2 text-sm font-medium text-indigo-600 dark:text-indigo-400"
            >
              <span className="flex items-center justify-center w-5 h-5 rounded-full bg-indigo-100 dark:bg-indigo-500/20 text-base leading-none">
                {showAdditional ? "−" : "+"}
              </span>
              Additional Information
            </button>

            {showAdditional && (
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <Field label="Date of Birth" type="date" value={personal.dob} onChange={(e) => setP({ dob: e.target.value })} />
                <Field label="Gender" value={personal.gender} onChange={(e) => setP({ gender: e.target.value })} />
                <Field label="Nationality" value={personal.nationality} onChange={(e) => setP({ nationality: e.target.value })} />
                <Field label="Marital Status" value={personal.maritalStatus} onChange={(e) => setP({ maritalStatus: e.target.value })} />
                <Field label="LinkedIn Profile" value={personal.linkedin} onChange={(e) => setP({ linkedin: e.target.value })} />
                <Field label="Website" value={personal.website} onChange={(e) => setP({ website: e.target.value })} />
              </div>
            )}

            <div className="flex justify-end">
              <Button onClick={() => setStep(2)}>
                Next: My Experiences
                <ChevronRight size={16} />
              </Button>
            </div>
          </div>
        )}

        {step === 2 && (
          <div className="space-y-4">
            <Accordion title="Work Experience" defaultOpen>
              {workExperience.map((w) => (
                <EntryCard key={w.id} onRemove={() => removeItem(setWorkExperience)(w.id)}>
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                    <Field label="Job Title" value={w.jobTitle} onChange={(e) => updateItem(setWorkExperience, w.id, { jobTitle: e.target.value })} />
                    <Field label="City/Town" value={w.city} onChange={(e) => updateItem(setWorkExperience, w.id, { city: e.target.value })} />
                    <Field label="Company" value={w.company} onChange={(e) => updateItem(setWorkExperience, w.id, { company: e.target.value })} />
                    <div className="grid grid-cols-2 gap-3">
                      <Field label="Start Date" type="date" value={w.startDate} onChange={(e) => updateItem(setWorkExperience, w.id, { startDate: e.target.value })} />
                      <Field label="End Date" type="date" value={w.endDate} onChange={(e) => updateItem(setWorkExperience, w.id, { endDate: e.target.value })} />
                    </div>
                  </div>
                  <div>
                    <label className={labelClass}>Description</label>
                    <SimpleRichTextEditor value={w.description} onChange={(v) => updateItem(setWorkExperience, w.id, { description: v })} />
                  </div>
                </EntryCard>
              ))}
              <AddButton
                label="Add another work experience"
                onClick={() =>
                  setWorkExperience((items) => [
                    ...items,
                    { id: makeId(), jobTitle: "", city: "", company: "", startDate: "", endDate: "", description: "" },
                  ])
                }
              />
            </Accordion>

            <Accordion title="Education and Qualifications">
              {education.map((ed) => (
                <EntryCard key={ed.id} onRemove={() => removeItem(setEducation)(ed.id)}>
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                    <Field label="Degree" value={ed.degree} onChange={(e) => updateItem(setEducation, ed.id, { degree: e.target.value })} />
                    <Field label="City/Town" value={ed.city} onChange={(e) => updateItem(setEducation, ed.id, { city: e.target.value })} />
                    <Field label="School" value={ed.school} onChange={(e) => updateItem(setEducation, ed.id, { school: e.target.value })} />
                    <div className="grid grid-cols-2 gap-3">
                      <Field label="Start Date" type="date" value={ed.startDate} onChange={(e) => updateItem(setEducation, ed.id, { startDate: e.target.value })} />
                      <Field label="End Date" type="date" value={ed.endDate} onChange={(e) => updateItem(setEducation, ed.id, { endDate: e.target.value })} />
                    </div>
                  </div>
                  <div>
                    <label className={labelClass}>Description</label>
                    <SimpleRichTextEditor value={ed.description} onChange={(v) => updateItem(setEducation, ed.id, { description: v })} />
                  </div>
                </EntryCard>
              ))}
              <AddButton
                label="Add another education"
                onClick={() =>
                  setEducation((items) => [
                    ...items,
                    { id: makeId(), degree: "", city: "", school: "", startDate: "", endDate: "", description: "" },
                  ])
                }
              />
            </Accordion>

            <Accordion title="Interests">
              {interests.map((i) => (
                <EntryCard key={i.id} onRemove={() => removeItem(setInterests)(i.id)}>
                  <Field label="Hobby" value={i.hobby} onChange={(e) => updateItem(setInterests, i.id, { hobby: e.target.value })} />
                </EntryCard>
              ))}
              <AddButton
                label="Add another hobby"
                onClick={() => setInterests((items) => [...items, { id: makeId(), hobby: "" }])}
              />
            </Accordion>

            <Accordion title="Skills">
              {skills.map((s) => (
                <EntryCard key={s.id} onRemove={() => removeItem(setSkills)(s.id)}>
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                    <Field label="Skill" value={s.skill} onChange={(e) => updateItem(setSkills, s.id, { skill: e.target.value })} />
                    <div>
                      <label className={labelClass}>Level</label>
                      <select
                        className={inputClass}
                        value={s.level}
                        onChange={(e) => updateItem(setSkills, s.id, { level: e.target.value })}
                      >
                        {SKILL_LEVEL_OPTIONS.map((lvl) => (
                          <option key={lvl} value={lvl}>
                            {lvl}
                          </option>
                        ))}
                      </select>
                    </div>
                  </div>
                </EntryCard>
              ))}
              <AddButton
                label="Add another skill"
                onClick={() => setSkills((items) => [...items, { id: makeId(), skill: "", level: "Experienced" }])}
              />
            </Accordion>

            <Accordion title="Courses">
              {courses.map((c) => (
                <EntryCard key={c.id} onRemove={() => removeItem(setCourses)(c.id)}>
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                    <Field label="Course" value={c.course} onChange={(e) => updateItem(setCourses, c.id, { course: e.target.value })} />
                    <Field label="Institution" value={c.institution} onChange={(e) => updateItem(setCourses, c.id, { institution: e.target.value })} />
                    <div className="grid grid-cols-2 gap-3 sm:col-span-2">
                      <Field label="Start Date" type="date" value={c.startDate} onChange={(e) => updateItem(setCourses, c.id, { startDate: e.target.value })} />
                      <Field label="End Date" type="date" value={c.endDate} onChange={(e) => updateItem(setCourses, c.id, { endDate: e.target.value })} />
                    </div>
                  </div>
                  <div>
                    <label className={labelClass}>Description</label>
                    <SimpleRichTextEditor value={c.description} onChange={(v) => updateItem(setCourses, c.id, { description: v })} />
                  </div>
                </EntryCard>
              ))}
              <AddButton
                label="Add another course"
                onClick={() =>
                  setCourses((items) => [
                    ...items,
                    { id: makeId(), course: "", institution: "", startDate: "", endDate: "", description: "" },
                  ])
                }
              />
            </Accordion>

            <Accordion title="Languages">
              {languages.map((l) => (
                <EntryCard key={l.id} onRemove={() => removeItem(setLanguages)(l.id)}>
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                    <Field label="Language" value={l.language} onChange={(e) => updateItem(setLanguages, l.id, { language: e.target.value })} />
                    <div>
                      <label className={labelClass}>Level</label>
                      <select
                        className={inputClass}
                        value={l.level}
                        onChange={(e) => updateItem(setLanguages, l.id, { level: e.target.value })}
                      >
                        {LANGUAGE_LEVEL_OPTIONS.map((lvl) => (
                          <option key={lvl} value={lvl}>
                            {lvl}
                          </option>
                        ))}
                      </select>
                    </div>
                  </div>
                </EntryCard>
              ))}
              <AddButton
                label="Add another language"
                onClick={() => setLanguages((items) => [...items, { id: makeId(), language: "", level: "Very good command" }])}
              />
            </Accordion>

            <Accordion title="Achievements">
              <SimpleRichTextEditor value={achievements} onChange={setAchievements} />
            </Accordion>

            <div className="flex justify-between pt-2">
              <Button variant="secondary" onClick={() => setStep(1)}>
                <ChevronLeft size={16} />
                Back
              </Button>
              <Button onClick={handleDownload}>Download Resume</Button>
            </div>
          </div>
        )}
      </div>
    </ToolPageShell>
  );
}
