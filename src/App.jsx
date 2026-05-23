import { useState, useRef } from "react";

// ── Colour tokens ──────────────────────────────────────────────
const C = {
  navy: "#1A2744",
  navyLight: "#243158",
  teal: "#00C9A7",
  coral: "#FF6B6B",
  gold: "#F5A623",
  bg: "#F0F2F8",
  card: "#FFFFFF",
  text: "#1A2744",
  muted: "#7A85A3",
  border: "#E2E8F0",
};

// ── Sample seed data (matches your Excel Raw Data) ─────────────
const SEED = [
  { id: 1, leadId: "LD/SV/26-27/0001", entryDate: "01.04.2026", leadType: "Project", source: "Reference", refBy: "Vishal Patadiya", clientName: "Dr Dev Ramoliya", contact: "7600420178", email: "", city: "Kuvadava", projectName: "", projectType: "Bungalow", address: "Kuvadava", siteCity: "Kuvadava", floors: "G+2", estRft: 150, budgetRange: "", projectStage: "Finishing", urgency: "1 Month", material: "SS304 Powder Coated, SS304 PVD", productType: "", railingType: "", mountingType: "Top", finish: "Black", glassSpec: "12", architect: "", archContact: "", assignTo: "SB", siteVisit: "01.04.2026", measurements: "01.04.2026", quotationStatus: "Revised", amount: 400000, lastQuotDate: "04.04.2026", lastFollowup: "", nextFollowup: "", notes: "", status: "Negotiations", finalDeal: null, expectedClosure: "", lostReason: "", jmsDone: "", finalRft: "", productionStatus: "", installationStatus: "", billingStatus: "", photos: [] },
  { id: 2, leadId: "LD/SV/26-27/0002", entryDate: "01.04.2026", leadType: "Project", source: "Site Visit", refBy: "", clientName: "Virendra Vagadiya", contact: "9427236218", email: "", city: "Rajkot", projectName: "", projectType: "Bungalow", address: "Vrdhman Nagar", siteCity: "Rajkot", floors: "G+2", estRft: null, budgetRange: "", projectStage: "Construction", urgency: "2 Months", material: "", productType: "", railingType: "", mountingType: "", finish: "", glassSpec: "", architect: "", archContact: "", assignTo: "SB", siteVisit: "01.04.2026", measurements: "", quotationStatus: "Not Sent", amount: null, lastQuotDate: "", lastFollowup: "", nextFollowup: "", notes: "", status: "Meeting Done", finalDeal: null, expectedClosure: "", lostReason: "", jmsDone: "", finalRft: "", productionStatus: "", installationStatus: "", billingStatus: "", photos: [] },
  { id: 3, leadId: "LD/SV/26-27/0003", entryDate: "01.04.2026", leadType: "Project", source: "Site Visit", refBy: "", clientName: "Bansi Vagadiya", contact: "9016199099", email: "", city: "Rajkot", projectName: "", projectType: "Bungalow", address: "Vrdhman Nagar", siteCity: "Rajkot", floors: "G+2", estRft: null, budgetRange: "", projectStage: "Construction", urgency: "2 Months", material: "", productType: "", railingType: "", mountingType: "", finish: "", glassSpec: "", architect: "", archContact: "", assignTo: "SB", siteVisit: "01.04.2026", measurements: "", quotationStatus: "Not Sent", amount: null, lastQuotDate: "", lastFollowup: "", nextFollowup: "", notes: "", status: "Meeting Done", finalDeal: null, expectedClosure: "", lostReason: "", jmsDone: "", finalRft: "", productionStatus: "", installationStatus: "", billingStatus: "", photos: [] },
  { id: 10, leadId: "LD/SV/26-27/0010", entryDate: "01.04.2026", leadType: "Retail", source: "Dealer", refBy: "", clientName: "Octane Enterprise", contact: "9370810999", email: "", city: "Kolhapur", projectName: "", projectType: "", address: "Kolhapur", siteCity: "Kolhapur", floors: "", estRft: null, budgetRange: "", projectStage: "", urgency: "Immediate", material: "Aluminium Powder Coated", productType: "T Brackets, Hilti Bolts", railingType: "", mountingType: "Top", finish: "Silver", glassSpec: "12", architect: "", archContact: "", assignTo: "SB", siteVisit: "", measurements: "", quotationStatus: "Sent", amount: 32175, lastQuotDate: "", lastFollowup: "", nextFollowup: "", notes: "", status: "Won", finalDeal: 32175, expectedClosure: "", lostReason: "", jmsDone: "", finalRft: "", productionStatus: "Completed", installationStatus: "", billingStatus: "Done", photos: [] },
  { id: 15, leadId: "LD/SV/26-27/0015", entryDate: "01.04.2026", leadType: "Project", source: "End Client", refBy: "", clientName: "Nilesh Ghelani", contact: "9979105530", email: "", city: "Rajkot", projectName: "", projectType: "Bungalow", address: "Vavdi", siteCity: "Rajkot", floors: "G+2", estRft: null, budgetRange: "", projectStage: "Ready", urgency: "Immediate", material: "", productType: "", railingType: "", mountingType: "Top", finish: "Matt", glassSpec: "", architect: "", archContact: "", assignTo: "SB", siteVisit: "01.04.2026", measurements: "", quotationStatus: "Sent", amount: 85000, lastQuotDate: "", lastFollowup: "", nextFollowup: "", notes: "", status: "Won", finalDeal: 85000, expectedClosure: "", lostReason: "", jmsDone: "", finalRft: "", productionStatus: "", installationStatus: "", billingStatus: "", photos: [] },
  { id: 25, leadId: "LD/SV/26-27/0025", entryDate: "06.04.2026", leadType: "Retail", source: "Dealer", refBy: "", clientName: "Dadakrupa Glass", contact: "", email: "", city: "Jaipur", projectName: "K C Vadhrani", projectType: "", address: "", siteCity: "", floors: "", estRft: null, budgetRange: "", projectStage: "", urgency: "", material: "SS304", productType: "100x50x10mm Flat baluster", railingType: "", mountingType: "Top", finish: "Matt", glassSpec: "12", architect: "", archContact: "", assignTo: "SB", siteVisit: "", measurements: "", quotationStatus: "Sent", amount: 561000, lastQuotDate: "", lastFollowup: "", nextFollowup: "", notes: "", status: "Negotiations", finalDeal: null, expectedClosure: "", lostReason: "", jmsDone: "", finalRft: "", productionStatus: "", installationStatus: "", billingStatus: "", photos: [] },
  { id: 30, leadId: "LD/SV/26-27/0030", entryDate: "13.04.2026", leadType: "Retail", source: "Dealer", refBy: "", clientName: "Mahaveer Metals", contact: "9929074147", email: "", city: "Jodhpur", projectName: "", projectType: "", address: "", siteCity: "", floors: "", estRft: null, budgetRange: "", projectStage: "Ready", urgency: "Immediate", material: "SS304", productType: "38mm HR Flexi bend", railingType: "", mountingType: "", finish: "Matt", glassSpec: "", architect: "", archContact: "", assignTo: "SB", siteVisit: "", measurements: "", quotationStatus: "Not Sent", amount: null, lastQuotDate: "", lastFollowup: "", nextFollowup: "", notes: "", status: "Lost", finalDeal: null, expectedClosure: "", lostReason: "Specification not available for the bends", jmsDone: "", finalRft: "", productionStatus: "", installationStatus: "", billingStatus: "", photos: [] },
];

const STATUS_COLORS = {
  "Won": { bg: "#DCFCE7", text: "#166534" },
  "Lost": { bg: "#FEE2E2", text: "#991B1B" },
  "Hot": { bg: "#FEF3C7", text: "#92400E" },
  "Negotiations": { bg: "#FEF3C7", text: "#92400E" },
  "Quotation Sent": { bg: "#EDE9FE", text: "#5B21B6" },
  "Meeting Done": { bg: "#DBEAFE", text: "#1E40AF" },
  "Site Visit Done": { bg: "#D1FAE5", text: "#065F46" },
  "Price Given": { bg: "#FEE2E2", text: "#9A3412" },
  "Contacted": { bg: "#E0F2FE", text: "#075985" },
  "New": { bg: "#F1F5F9", text: "#475569" },
  "Cold": { bg: "#F1F5F9", text: "#94A3B8" },
  "Warm": { bg: "#FEF9C3", text: "#854D0E" },
};

const SOURCES = ["Site Visit", "Reference", "Dealer", "End Client", "Architect/Interiors"];
const LEAD_TYPES = ["Project", "Retail"];
const PROJECT_TYPES = ["Bungalow", "Apartments", "Commercial", "Office", "Industrial", "Hospital", "Hotel", "Retail Store"];
const STATUSES = ["New", "Contacted", "Site Visit Done", "Price Given", "Quotation Sent", "Negotiations", "Meeting Done", "Hot", "Warm", "Cold", "Won", "Lost"];
const QUOT_STATUSES = ["Not Sent", "Sent", "Revised", "Approved"];
const FLOORS = ["G", "G+1", "G+2", "G+3", "G+4", "G+5", "More"];
const BUDGET_RANGES = ["Under 50K", "50K–1L", "1L–3L", "3L–5L", "5L–10L", "10L+"];
const STAGES = ["Planning", "Construction", "Finishing", "Ready", "Renovation"];
const URGENCIES = ["Immediate", "1 Month", "2 Months", "3 Months", "6 Months", "No Rush"];
const MOUNTING_TYPES = ["Top Mount", "Side Mount", "Core Drill", "Spider Fitting", "U-Channel", "Patch Fitting", "Wall Bracket"];
const FINISHES = ["Black Powder Coat", "Silver/White Powder Coat", "Gold PVD", "Rose Gold PVD", "Bronze PVD", "SS Mirror Polish", "SS Matt/Hairline", "Custom"];
const PROD_STATUSES = ["Not Started", "In Progress", "Complete"];
const INSTALL_STATUSES = ["Pending", "Scheduled", "Done"];
const BILLING_STATUSES = ["Pending", "Partial", "Complete"];
const ASSIGN_TO = ["SB", "VV", "Other"];

// ── Tiny helpers ───────────────────────────────────────────────
const fmt = (n) => n ? `₹${Number(n).toLocaleString("en-IN")}` : "—";
const pct = (a, b) => b ? ((a / b) * 100).toFixed(1) + "%" : "0%";

function Badge({ status }) {
  const c = STATUS_COLORS[status] || { bg: "#F1F5F9", text: "#475569" };
  return (
    <span style={{ background: c.bg, color: c.text, padding: "2px 10px", borderRadius: 20, fontSize: 11, fontWeight: 700, whiteSpace: "nowrap" }}>
      {status || "—"}
    </span>
  );
}

function KpiCard({ label, value, sub, color }) {
  return (
    <div style={{ background: C.card, borderRadius: 16, padding: "20px 24px", boxShadow: "0 2px 12px rgba(26,39,68,.07)", borderTop: `4px solid ${color}`, minWidth: 0 }}>
      <div style={{ color: C.muted, fontSize: 11, fontWeight: 700, letterSpacing: 1, textTransform: "uppercase" }}>{label}</div>
      <div style={{ color: C.text, fontSize: 26, fontWeight: 800, margin: "6px 0 2px" }}>{value}</div>
      {sub && <div style={{ color: C.muted, fontSize: 12 }}>{sub}</div>}
    </div>
  );
}

function Input({ label, type = "text", value, onChange, required, placeholder, options, half }) {
  const base = { width: "100%", padding: "9px 13px", borderRadius: 8, border: `1.5px solid ${C.border}`, fontSize: 14, color: C.text, background: "#FAFBFE", boxSizing: "border-box", outline: "none", fontFamily: "inherit" };
  return (
    <div style={{ display: "flex", flexDirection: "column", gap: 4, flex: half ? "0 0 calc(50% - 6px)" : "1 1 100%" }}>
      <label style={{ fontSize: 12, fontWeight: 600, color: C.muted }}>
        {label}{required && <span style={{ color: C.coral }}> *</span>}
      </label>
      {options ? (
        <select value={value} onChange={e => onChange(e.target.value)} style={base}>
          <option value="">— Select —</option>
          {options.map(o => <option key={o} value={o}>{o}</option>)}
        </select>
      ) : type === "textarea" ? (
        <textarea value={value} onChange={e => onChange(e.target.value)} placeholder={placeholder} rows={3} style={{ ...base, resize: "vertical" }} />
      ) : (
        <input type={type} value={value} onChange={e => onChange(e.target.value)} placeholder={placeholder} style={base} />
      )}
    </div>
  );
}

function Section({ title, children }) {
  return (
    <div style={{ marginBottom: 24 }}>
      <div style={{ display: "flex", alignItems: "center", gap: 10, marginBottom: 14 }}>
        <div style={{ height: 3, width: 20, background: C.teal, borderRadius: 2 }} />
        <span style={{ fontSize: 13, fontWeight: 700, color: C.navy, textTransform: "uppercase", letterSpacing: 0.8 }}>{title}</span>
      </div>
      <div style={{ display: "flex", flexWrap: "wrap", gap: 12 }}>{children}</div>
    </div>
  );
}

// ── Photo Upload Component ─────────────────────────────────────
function PhotoUpload({ photos, onChange }) {
  const fileRef = useRef();

  const handleFiles = (e) => {
    const files = Array.from(e.target.files);
    files.forEach(file => {
      const reader = new FileReader();
      reader.onload = (ev) => {
        onChange(prev => [...prev, { id: Date.now() + Math.random(), url: ev.target.result, name: file.name, remark: "", type: "site_visit", date: new Date().toLocaleDateString("en-IN") }]);
      };
      reader.readAsDataURL(file);
    });
    e.target.value = "";
  };

  const updateRemark = (id, remark) => {
    onChange(prev => prev.map(p => p.id === id ? { ...p, remark } : p));
  };

  const updateType = (id, type) => {
    onChange(prev => prev.map(p => p.id === id ? { ...p, type } : p));
  };

  const removePhoto = (id) => {
    onChange(prev => prev.filter(p => p.id !== id));
  };

  const PHOTO_TYPES = ["site_visit", "measurement", "installation", "completion", "reference"];

  return (
    <div>
      <input ref={fileRef} type="file" accept="image/*" multiple onChange={handleFiles} style={{ display: "none" }} />
      <button
        type="button"
        onClick={() => fileRef.current.click()}
        style={{ background: C.navy, color: "#fff", border: "none", borderRadius: 10, padding: "11px 22px", fontSize: 13, fontWeight: 700, cursor: "pointer", display: "flex", alignItems: "center", gap: 8, marginBottom: 16 }}
      >
        <span style={{ fontSize: 18 }}>📷</span> Upload Photos
      </button>

      {photos.length === 0 && (
        <div style={{ border: `2px dashed ${C.border}`, borderRadius: 12, padding: "32px 20px", textAlign: "center", color: C.muted, fontSize: 14 }}>
          No photos uploaded yet. Click the button above to add site photos.
        </div>
      )}

      <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fill, minmax(220px, 1fr))", gap: 16 }}>
        {photos.map(photo => (
          <div key={photo.id} style={{ background: C.card, borderRadius: 12, overflow: "hidden", boxShadow: "0 2px 10px rgba(0,0,0,.08)", border: `1px solid ${C.border}` }}>
            <div style={{ position: "relative" }}>
              <img src={photo.url} alt={photo.name} style={{ width: "100%", height: 160, objectFit: "cover", display: "block" }} />
              <button
                type="button"
                onClick={() => removePhoto(photo.id)}
                style={{ position: "absolute", top: 8, right: 8, background: "rgba(255,60,60,.85)", color: "#fff", border: "none", borderRadius: "50%", width: 28, height: 28, cursor: "pointer", fontSize: 14, fontWeight: 700 }}
              >✕</button>
              <div style={{ position: "absolute", bottom: 8, left: 8 }}>
                <select
                  value={photo.type}
                  onChange={e => updateType(photo.id, e.target.value)}
                  style={{ fontSize: 11, padding: "3px 8px", borderRadius: 6, border: "none", background: "rgba(26,39,68,.75)", color: "#fff", cursor: "pointer" }}
                >
                  {PHOTO_TYPES.map(t => <option key={t} value={t}>{t.replace("_", " ")}</option>)}
                </select>
              </div>
            </div>
            <div style={{ padding: "10px 12px" }}>
              <div style={{ fontSize: 11, color: C.muted, marginBottom: 6, overflow: "hidden", textOverflow: "ellipsis", whiteSpace: "nowrap" }}>{photo.name}</div>
              <textarea
                placeholder="Add remark / description..."
                value={photo.remark}
                onChange={e => updateRemark(photo.id, e.target.value)}
                rows={2}
                style={{ width: "100%", border: `1.5px solid ${C.border}`, borderRadius: 7, padding: "7px 10px", fontSize: 12, color: C.text, resize: "none", fontFamily: "inherit", boxSizing: "border-box" }}
              />
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}

// ── New Lead Form ─────────────────────────────────────────────
const BLANK = {
  leadType: "", source: "", refBy: "", clientName: "", contact: "", email: "", city: "",
  projectName: "", projectType: "", address: "", siteCity: "", floors: "", estRft: "",
  budgetRange: "", projectStage: "", urgency: "", material: "", productType: "",
  railingType: "", mountingType: "", finish: "", glassSpec: "", architect: "", archContact: "",
  assignTo: "", siteVisit: "", measurements: "", quotationStatus: "Not Sent", amount: "",
  lastQuotDate: "", lastFollowup: "", nextFollowup: "", notes: "", status: "New",
  finalDeal: "", expectedClosure: "", lostReason: "", jmsDone: "", finalRft: "",
  productionStatus: "", installationStatus: "", billingStatus: "", photos: [],
};

function NewLeadForm({ leads, onSave, onCancel }) {
  const [f, setF] = useState({ ...BLANK });
  const nextId = leads.length + 1;
  const leadId = `LD/SV/26-27/${String(nextId).padStart(4, "0")}`;
  const today = new Date().toLocaleDateString("en-IN", { day: "2-digit", month: "2-digit", year: "numeric" }).replace(/\//g, ".");

  const set = (k) => (v) => setF(p => ({ ...p, [k]: v }));

  const handleSubmit = (e) => {
    e.preventDefault();
    if (!f.clientName || !f.leadType || !f.source || !f.city || !f.assignTo || !f.status) {
      alert("Please fill all required fields (marked with *)");
      return;
    }
    onSave({ ...f, id: nextId, leadId, entryDate: today });
  };

  return (
    <div style={{ maxWidth: 900, margin: "0 auto", padding: "0 0 60px" }}>
      <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: 28 }}>
        <div>
          <h2 style={{ margin: 0, fontSize: 22, color: C.navy, fontWeight: 800 }}>New Inquiry</h2>
          <div style={{ color: C.muted, fontSize: 13, marginTop: 4 }}>Lead ID: <b>{leadId}</b> · Date: {today}</div>
        </div>
        <button onClick={onCancel} style={{ background: "#F1F5F9", color: C.navy, border: "none", borderRadius: 10, padding: "10px 20px", cursor: "pointer", fontWeight: 600 }}>✕ Cancel</button>
      </div>

      <form onSubmit={handleSubmit}>
        {/* Lead Identity */}
        <div style={{ background: C.card, borderRadius: 16, padding: 24, marginBottom: 16, boxShadow: "0 2px 12px rgba(26,39,68,.06)" }}>
          <Section title="Lead Identity">
            <Input label="Lead Type" options={LEAD_TYPES} value={f.leadType} onChange={set("leadType")} required half />
            <Input label="Source" options={SOURCES} value={f.source} onChange={set("source")} required half />
            <Input label="Reference By" value={f.refBy} onChange={set("refBy")} placeholder="Name of reference" />
          </Section>
        </div>

        {/* Client Details */}
        <div style={{ background: C.card, borderRadius: 16, padding: 24, marginBottom: 16, boxShadow: "0 2px 12px rgba(26,39,68,.06)" }}>
          <Section title="Client Details">
            <Input label="Client Name" value={f.clientName} onChange={set("clientName")} required placeholder="Full name" />
            <Input label="Contact Number" type="tel" value={f.contact} onChange={set("contact")} required placeholder="10-digit mobile" half />
            <Input label="Email" type="email" value={f.email} onChange={set("email")} placeholder="email@example.com" half />
            <Input label="City" value={f.city} onChange={set("city")} required placeholder="Client city" half />
          </Section>
        </div>

        {/* Project Info */}
        <div style={{ background: C.card, borderRadius: 16, padding: 24, marginBottom: 16, boxShadow: "0 2px 12px rgba(26,39,68,.06)" }}>
          <Section title="Project Information">
            <Input label="Project Name" value={f.projectName} onChange={set("projectName")} placeholder="Building / project name" half />
            <Input label="Project Type" options={PROJECT_TYPES} value={f.projectType} onChange={set("projectType")} half />
            <Input label="Address" type="textarea" value={f.address} onChange={set("address")} placeholder="Site address" />
            <Input label="Site City" value={f.siteCity} onChange={set("siteCity")} placeholder="City of site" half />
            <Input label="No. of Floors" options={FLOORS} value={f.floors} onChange={set("floors")} half />
            <Input label="Est. RFT" type="number" value={f.estRft} onChange={set("estRft")} placeholder="Running feet" half />
            <Input label="Budget Range" options={BUDGET_RANGES} value={f.budgetRange} onChange={set("budgetRange")} half />
          </Section>
        </div>

        {/* Timeline */}
        <div style={{ background: C.card, borderRadius: 16, padding: 24, marginBottom: 16, boxShadow: "0 2px 12px rgba(26,39,68,.06)" }}>
          <Section title="Timeline">
            <Input label="Project Stage" options={STAGES} value={f.projectStage} onChange={set("projectStage")} half />
            <Input label="Requirement Urgency" options={URGENCIES} value={f.urgency} onChange={set("urgency")} half />
          </Section>
        </div>

        {/* Technical */}
        <div style={{ background: C.card, borderRadius: 16, padding: 24, marginBottom: 16, boxShadow: "0 2px 12px rgba(26,39,68,.06)" }}>
          <Section title="Technical Requirements">
            <Input label="Material" value={f.material} onChange={set("material")} placeholder="SS304, Aluminium, etc." />
            <Input label="Product Type" value={f.productType} onChange={set("productType")} placeholder="Railing type / accessories" />
            <Input label="Railing Type" value={f.railingType} onChange={set("railingType")} placeholder="SS, Aluminium, Frameless Glass..." half />
            <Input label="Mounting Type" options={MOUNTING_TYPES} value={f.mountingType} onChange={set("mountingType")} half />
            <Input label="Finish" options={FINISHES} value={f.finish} onChange={set("finish")} half />
            <Input label="Glass Specification" value={f.glassSpec} onChange={set("glassSpec")} placeholder="e.g. 12mm toughened clear" half />
          </Section>
        </div>

        {/* Stakeholders */}
        <div style={{ background: C.card, borderRadius: 16, padding: 24, marginBottom: 16, boxShadow: "0 2px 12px rgba(26,39,68,.06)" }}>
          <Section title="Stakeholders">
            <Input label="Architect / Interior Designer" value={f.architect} onChange={set("architect")} placeholder="Name" half />
            <Input label="Architect Contact" type="tel" value={f.archContact} onChange={set("archContact")} placeholder="Mobile" half />
          </Section>
        </div>

        {/* Sales */}
        <div style={{ background: C.card, borderRadius: 16, padding: 24, marginBottom: 16, boxShadow: "0 2px 12px rgba(26,39,68,.06)" }}>
          <Section title="Sales Tracking">
            <Input label="Assign To" options={ASSIGN_TO} value={f.assignTo} onChange={set("assignTo")} required half />
            <Input label="Status" options={STATUSES} value={f.status} onChange={set("status")} required half />
            <Input label="Site Visit Done" type="date" value={f.siteVisit} onChange={set("siteVisit")} half />
            <Input label="Measurements Done" type="date" value={f.measurements} onChange={set("measurements")} half />
          </Section>
        </div>

        {/* Quotation */}
        <div style={{ background: C.card, borderRadius: 16, padding: 24, marginBottom: 16, boxShadow: "0 2px 12px rgba(26,39,68,.06)" }}>
          <Section title="Quotation">
            <Input label="Quotation Status" options={QUOT_STATUSES} value={f.quotationStatus} onChange={set("quotationStatus")} half />
            <Input label="Amount (₹)" type="number" value={f.amount} onChange={set("amount")} placeholder="Quote amount" half />
            <Input label="Last Quotation Date" type="date" value={f.lastQuotDate} onChange={set("lastQuotDate")} half />
          </Section>
        </div>

        {/* Follow-up */}
        <div style={{ background: C.card, borderRadius: 16, padding: 24, marginBottom: 16, boxShadow: "0 2px 12px rgba(26,39,68,.06)" }}>
          <Section title="Follow-up Engine">
            <Input label="Last Follow-Up" type="date" value={f.lastFollowup} onChange={set("lastFollowup")} half />
            <Input label="Next Follow-Up" type="date" value={f.nextFollowup} onChange={set("nextFollowup")} half />
            <Input label="Notes" type="textarea" value={f.notes} onChange={set("notes")} placeholder="Any remarks or conversation notes..." />
          </Section>
        </div>

        {/* Closure */}
        <div style={{ background: C.card, borderRadius: 16, padding: 24, marginBottom: 16, boxShadow: "0 2px 12px rgba(26,39,68,.06)" }}>
          <Section title="Closure Data">
            <Input label="Final Deal Value (₹)" type="number" value={f.finalDeal} onChange={set("finalDeal")} placeholder="Confirmed deal value" half />
            <Input label="Expected Closure Date" type="date" value={f.expectedClosure} onChange={set("expectedClosure")} half />
            {f.status === "Lost" && <Input label="Lost Reason" type="textarea" value={f.lostReason} onChange={set("lostReason")} placeholder="Why was this lead lost?" />}
          </Section>
        </div>

        {/* Execution */}
        <div style={{ background: C.card, borderRadius: 16, padding: 24, marginBottom: 16, boxShadow: "0 2px 12px rgba(26,39,68,.06)" }}>
          <Section title="Execution Status">
            <Input label="JMS Done Date" type="date" value={f.jmsDone} onChange={set("jmsDone")} half />
            <Input label="Final RFT" type="number" value={f.finalRft} onChange={set("finalRft")} placeholder="Final running feet" half />
            <Input label="Production Status" options={PROD_STATUSES} value={f.productionStatus} onChange={set("productionStatus")} half />
            <Input label="Installation Status" options={INSTALL_STATUSES} value={f.installationStatus} onChange={set("installationStatus")} half />
            <Input label="Billing Status" options={BILLING_STATUSES} value={f.billingStatus} onChange={set("billingStatus")} half />
          </Section>
        </div>

        {/* Photos */}
        <div style={{ background: C.card, borderRadius: 16, padding: 24, marginBottom: 24, boxShadow: "0 2px 12px rgba(26,39,68,.06)" }}>
          <div style={{ display: "flex", alignItems: "center", gap: 10, marginBottom: 18 }}>
            <div style={{ height: 3, width: 20, background: C.teal, borderRadius: 2 }} />
            <span style={{ fontSize: 13, fontWeight: 700, color: C.navy, textTransform: "uppercase", letterSpacing: 0.8 }}>Site Photos with Remarks</span>
          </div>
          <PhotoUpload photos={f.photos} onChange={(updater) => setF(p => ({ ...p, photos: typeof updater === "function" ? updater(p.photos) : updater }))} />
        </div>

        {/* Submit */}
        <button
          type="submit"
          style={{ width: "100%", background: C.navy, color: "#fff", border: "none", borderRadius: 14, padding: "16px 0", fontSize: 16, fontWeight: 800, cursor: "pointer", letterSpacing: 0.5 }}
        >
          ✅ Save Inquiry — {leadId}
        </button>
      </form>
    </div>
  );
}

// ── Lead Detail Modal ─────────────────────────────────────────
function LeadModal({ lead, onClose }) {
  if (!lead) return null;
  const Row = ({ label, val }) => val ? (
    <div style={{ display: "flex", gap: 12, padding: "8px 0", borderBottom: `1px solid ${C.border}` }}>
      <div style={{ color: C.muted, fontSize: 12, fontWeight: 600, width: 160, flexShrink: 0 }}>{label}</div>
      <div style={{ fontSize: 13, color: C.text }}>{val}</div>
    </div>
  ) : null;

  return (
    <div style={{ position: "fixed", inset: 0, background: "rgba(10,20,50,.55)", zIndex: 999, display: "flex", alignItems: "flex-start", justifyContent: "flex-end" }} onClick={onClose}>
      <div style={{ background: C.card, width: 480, maxWidth: "95vw", height: "100vh", overflowY: "auto", padding: 28, boxShadow: "-8px 0 40px rgba(0,0,0,.15)" }} onClick={e => e.stopPropagation()}>
        <div style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-start", marginBottom: 20 }}>
          <div>
            <div style={{ fontSize: 11, color: C.teal, fontWeight: 700, letterSpacing: 1 }}>{lead.leadId}</div>
            <div style={{ fontSize: 18, fontWeight: 800, color: C.navy, margin: "4px 0" }}>{lead.clientName}</div>
            <Badge status={lead.status} />
          </div>
          <button onClick={onClose} style={{ background: "#F1F5F9", border: "none", borderRadius: 8, padding: "8px 14px", cursor: "pointer", fontWeight: 700 }}>✕</button>
        </div>

        <Row label="Lead Type" val={lead.leadType} />
        <Row label="Source" val={lead.source} />
        <Row label="Reference By" val={lead.refBy} />
        <Row label="Contact" val={lead.contact} />
        <Row label="Email" val={lead.email} />
        <Row label="City" val={lead.city} />
        <Row label="Project Type" val={lead.projectType} />
        <Row label="Site City" val={lead.siteCity} />
        <Row label="Floors" val={lead.floors} />
        <Row label="Est. RFT" val={lead.estRft} />
        <Row label="Budget Range" val={lead.budgetRange} />
        <Row label="Project Stage" val={lead.projectStage} />
        <Row label="Urgency" val={lead.urgency} />
        <Row label="Material" val={lead.material} />
        <Row label="Product Type" val={lead.productType} />
        <Row label="Mounting Type" val={lead.mountingType} />
        <Row label="Finish" val={lead.finish} />
        <Row label="Glass Spec" val={lead.glassSpec} />
        <Row label="Architect" val={lead.architect} />
        <Row label="Arch. Contact" val={lead.archContact} />
        <Row label="Assigned To" val={lead.assignTo} />
        <Row label="Quotation Status" val={lead.quotationStatus} />
        <Row label="Amount" val={fmt(lead.amount)} />
        <Row label="Final Deal" val={fmt(lead.finalDeal)} />
        <Row label="Lost Reason" val={lead.lostReason} />
        <Row label="Production" val={lead.productionStatus} />
        <Row label="Installation" val={lead.installationStatus} />
        <Row label="Billing" val={lead.billingStatus} />
        <Row label="Notes" val={lead.notes} />

        {lead.photos && lead.photos.length > 0 && (
          <div style={{ marginTop: 20 }}>
            <div style={{ fontSize: 13, fontWeight: 700, color: C.navy, marginBottom: 12 }}>📷 Site Photos ({lead.photos.length})</div>
            <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 10 }}>
              {lead.photos.map(p => (
                <div key={p.id} style={{ borderRadius: 10, overflow: "hidden", border: `1px solid ${C.border}` }}>
                  <img src={p.url} alt={p.name} style={{ width: "100%", height: 110, objectFit: "cover", display: "block" }} />
                  {p.remark && <div style={{ padding: "6px 10px", fontSize: 11, color: C.muted }}>{p.remark}</div>}
                  <div style={{ padding: "0 10px 8px", fontSize: 10, color: C.teal, fontWeight: 700, textTransform: "uppercase" }}>{p.type?.replace("_", " ")}</div>
                </div>
              ))}
            </div>
          </div>
        )}
      </div>
    </div>
  );
}

// ── Dashboard ─────────────────────────────────────────────────
function Dashboard({ leads }) {
  const total = leads.length;
  const active = leads.filter(l => !["Won", "Lost"].includes(l.status)).length;
  const won = leads.filter(l => l.status === "Won");
  const lost = leads.filter(l => l.status === "Lost");
  const pipeline = leads.reduce((s, l) => s + (Number(l.amount) || 0), 0);
  const wonVal = won.reduce((s, l) => s + (Number(l.finalDeal) || 0), 0);
  const conv = pct(won.length, total);

  // Status counts for funnel
  const statusCounts = {};
  STATUSES.forEach(s => { statusCounts[s] = leads.filter(l => l.status === s).length; });
  const maxCount = Math.max(...Object.values(statusCounts), 1);

  // Source pie
  const sourceCounts = {};
  SOURCES.forEach(s => { sourceCounts[s] = leads.filter(l => l.source === s).length; });

  return (
    <div>
      {/* KPI Row */}
      <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(160px, 1fr))", gap: 14, marginBottom: 24 }}>
        <KpiCard label="Total Leads" value={total} color={C.navy} />
        <KpiCard label="Active Leads" value={active} color={C.teal} />
        <KpiCard label="Pipeline Value" value={`₹${(pipeline / 100000).toFixed(1)}L`} color="#6366F1" />
        <KpiCard label="Won Value" value={`₹${(wonVal / 100000).toFixed(1)}L`} color="#10B981" />
        <KpiCard label="Conversion" value={conv} color={C.gold} />
        <KpiCard label="Won / Lost" value={`${won.length} / ${lost.length}`} color={C.coral} />
      </div>

      <div style={{ display: "grid", gridTemplateColumns: "1fr 320px", gap: 16 }}>
        {/* Status Funnel */}
        <div style={{ background: C.card, borderRadius: 16, padding: 24, boxShadow: "0 2px 12px rgba(26,39,68,.07)" }}>
          <div style={{ fontWeight: 700, color: C.navy, marginBottom: 18, fontSize: 14 }}>📊 Lead Status Funnel</div>
          {STATUSES.map(s => {
            const count = statusCounts[s] || 0;
            const c = STATUS_COLORS[s] || { bg: "#E2E8F0", text: "#475569" };
            return (
              <div key={s} style={{ display: "flex", alignItems: "center", gap: 10, marginBottom: 10 }}>
                <div style={{ width: 130, fontSize: 12, color: C.muted, fontWeight: 600, textAlign: "right", flexShrink: 0 }}>{s}</div>
                <div style={{ flex: 1, background: "#F1F5F9", borderRadius: 6, height: 22, position: "relative", overflow: "hidden" }}>
                  <div style={{ position: "absolute", left: 0, top: 0, bottom: 0, width: `${(count / maxCount) * 100}%`, background: c.bg, borderRadius: 6, transition: "width .4s" }} />
                </div>
                <div style={{ width: 24, fontSize: 12, fontWeight: 800, color: c.text }}>{count}</div>
              </div>
            );
          })}
        </div>

        {/* Source + City */}
        <div style={{ display: "flex", flexDirection: "column", gap: 16 }}>
          <div style={{ background: C.card, borderRadius: 16, padding: 20, boxShadow: "0 2px 12px rgba(26,39,68,.07)" }}>
            <div style={{ fontWeight: 700, color: C.navy, marginBottom: 14, fontSize: 14 }}>🗂 Source Mix</div>
            {Object.entries(sourceCounts).map(([s, c]) => (
              <div key={s} style={{ display: "flex", justifyContent: "space-between", alignItems: "center", padding: "5px 0", borderBottom: `1px solid ${C.border}` }}>
                <span style={{ fontSize: 12, color: C.muted }}>{s}</span>
                <span style={{ fontSize: 13, fontWeight: 800, color: C.navy }}>{c}</span>
              </div>
            ))}
          </div>

          <div style={{ background: C.card, borderRadius: 16, padding: 20, boxShadow: "0 2px 12px rgba(26,39,68,.07)" }}>
            <div style={{ fontWeight: 700, color: C.navy, marginBottom: 14, fontSize: 14 }}>🏙 Top Cities</div>
            {Object.entries(
              leads.reduce((acc, l) => { if (l.city) acc[l.city] = (acc[l.city] || 0) + 1; return acc; }, {})
            ).sort((a, b) => b[1] - a[1]).slice(0, 6).map(([city, count]) => (
              <div key={city} style={{ display: "flex", justifyContent: "space-between", padding: "5px 0", borderBottom: `1px solid ${C.border}` }}>
                <span style={{ fontSize: 12, color: C.muted }}>{city}</span>
                <span style={{ fontSize: 13, fontWeight: 800, color: C.navy }}>{count}</span>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}

// ── Leads Table ───────────────────────────────────────────────
function LeadsList({ leads, onSelect }) {
  const [search, setSearch] = useState("");
  const [filterStatus, setFilterStatus] = useState("");
  const [filterSource, setFilterSource] = useState("");
  const [filterAssign, setFilterAssign] = useState("");
  const [page, setPage] = useState(1);
  const PER_PAGE = 15;

  const filtered = leads.filter(l => {
    const q = search.toLowerCase();
    const match = !q || l.clientName?.toLowerCase().includes(q) || l.leadId?.toLowerCase().includes(q) || l.city?.toLowerCase().includes(q) || l.contact?.includes(q);
    return match && (!filterStatus || l.status === filterStatus) && (!filterSource || l.source === filterSource) && (!filterAssign || l.assignTo === filterAssign);
  });

  const pages = Math.ceil(filtered.length / PER_PAGE);
  const visible = filtered.slice((page - 1) * PER_PAGE, page * PER_PAGE);

  const exportCSV = () => {
    const cols = ["Lead ID", "Client", "Contact", "City", "Type", "Source", "Status", "Amount", "Assign To", "Next Followup"];
    const rows = filtered.map(l => [l.leadId, l.clientName, l.contact, l.city, l.leadType, l.source, l.status, l.amount || "", l.assignTo, l.nextFollowup]);
    const csv = [cols, ...rows].map(r => r.join(",")).join("\n");
    const a = document.createElement("a"); a.href = "data:text/csv," + encodeURIComponent(csv); a.download = "sv_leads.csv"; a.click();
  };

  return (
    <div>
      {/* Filters */}
      <div style={{ display: "flex", flexWrap: "wrap", gap: 10, marginBottom: 16, alignItems: "center" }}>
        <input
          placeholder="🔍  Search client, ID, city, phone..."
          value={search} onChange={e => { setSearch(e.target.value); setPage(1); }}
          style={{ flex: "1 1 240px", padding: "10px 14px", borderRadius: 10, border: `1.5px solid ${C.border}`, fontSize: 13, color: C.text, background: C.card }}
        />
        <select value={filterStatus} onChange={e => { setFilterStatus(e.target.value); setPage(1); }} style={{ padding: "10px 14px", borderRadius: 10, border: `1.5px solid ${C.border}`, fontSize: 13, color: C.text, background: C.card }}>
          <option value="">All Status</option>
          {STATUSES.map(s => <option key={s}>{s}</option>)}
        </select>
        <select value={filterSource} onChange={e => { setFilterSource(e.target.value); setPage(1); }} style={{ padding: "10px 14px", borderRadius: 10, border: `1.5px solid ${C.border}`, fontSize: 13, color: C.text, background: C.card }}>
          <option value="">All Sources</option>
          {SOURCES.map(s => <option key={s}>{s}</option>)}
        </select>
        <select value={filterAssign} onChange={e => { setFilterAssign(e.target.value); setPage(1); }} style={{ padding: "10px 14px", borderRadius: 10, border: `1.5px solid ${C.border}`, fontSize: 13, color: C.text, background: C.card }}>
          <option value="">All Staff</option>
          {ASSIGN_TO.map(s => <option key={s}>{s}</option>)}
        </select>
        <button onClick={exportCSV} style={{ background: C.navy, color: "#fff", border: "none", borderRadius: 10, padding: "10px 18px", fontSize: 13, fontWeight: 700, cursor: "pointer" }}>⬇ Export CSV</button>
      </div>

      <div style={{ fontSize: 12, color: C.muted, marginBottom: 10 }}>{filtered.length} leads found</div>

      {/* Table */}
      <div style={{ background: C.card, borderRadius: 16, overflow: "hidden", boxShadow: "0 2px 12px rgba(26,39,68,.07)" }}>
        <div style={{ overflowX: "auto" }}>
          <table style={{ width: "100%", borderCollapse: "collapse", fontSize: 13 }}>
            <thead>
              <tr style={{ background: C.navy, color: "#fff" }}>
                {["Lead ID", "Client", "Contact", "City", "Type", "Source", "Amount", "Status", "Assigned", "Photos"].map(h => (
                  <th key={h} style={{ padding: "12px 14px", textAlign: "left", fontWeight: 700, fontSize: 11, letterSpacing: 0.5, whiteSpace: "nowrap" }}>{h}</th>
                ))}
              </tr>
            </thead>
            <tbody>
              {visible.map((l, i) => (
                <tr key={l.id} onClick={() => onSelect(l)} style={{ background: i % 2 ? "#FAFBFE" : C.card, cursor: "pointer", transition: "background .15s" }}
                  onMouseEnter={e => e.currentTarget.style.background = "#EEF2FF"}
                  onMouseLeave={e => e.currentTarget.style.background = i % 2 ? "#FAFBFE" : C.card}>
                  <td style={{ padding: "11px 14px", color: C.teal, fontWeight: 700, fontFamily: "monospace", fontSize: 12, whiteSpace: "nowrap" }}>{l.leadId}</td>
                  <td style={{ padding: "11px 14px", fontWeight: 600, color: C.navy }}>{l.clientName || "—"}</td>
                  <td style={{ padding: "11px 14px", color: C.muted }}>{l.contact || "—"}</td>
                  <td style={{ padding: "11px 14px" }}>{l.city || "—"}</td>
                  <td style={{ padding: "11px 14px" }}>
                    <span style={{ background: l.leadType === "Project" ? "#DBEAFE" : "#FEF9C3", color: l.leadType === "Project" ? "#1E40AF" : "#854D0E", padding: "2px 8px", borderRadius: 6, fontSize: 11, fontWeight: 700 }}>{l.leadType || "—"}</span>
                  </td>
                  <td style={{ padding: "11px 14px", color: C.muted }}>{l.source || "—"}</td>
                  <td style={{ padding: "11px 14px", fontWeight: 700, color: C.navy }}>{l.amount ? fmt(l.amount) : "—"}</td>
                  <td style={{ padding: "11px 14px" }}><Badge status={l.status} /></td>
                  <td style={{ padding: "11px 14px" }}>
                    <span style={{ background: C.navy, color: "#fff", padding: "3px 9px", borderRadius: 6, fontSize: 11, fontWeight: 700 }}>{l.assignTo || "—"}</span>
                  </td>
                  <td style={{ padding: "11px 14px", color: l.photos?.length ? C.teal : C.muted, fontWeight: 700 }}>
                    {l.photos?.length ? `📷 ${l.photos.length}` : "—"}
                  </td>
                </tr>
              ))}
              {visible.length === 0 && (
                <tr><td colSpan={10} style={{ padding: 40, textAlign: "center", color: C.muted }}>No leads match your filters.</td></tr>
              )}
            </tbody>
          </table>
        </div>

        {/* Pagination */}
        {pages > 1 && (
          <div style={{ display: "flex", justifyContent: "center", gap: 8, padding: 16, borderTop: `1px solid ${C.border}` }}>
            <button onClick={() => setPage(p => Math.max(1, p - 1))} disabled={page === 1} style={{ padding: "7px 14px", borderRadius: 8, border: `1px solid ${C.border}`, cursor: "pointer", background: C.card, fontWeight: 600 }}>‹ Prev</button>
            <span style={{ padding: "7px 14px", fontSize: 13, color: C.muted }}>Page {page} of {pages}</span>
            <button onClick={() => setPage(p => Math.min(pages, p + 1))} disabled={page === pages} style={{ padding: "7px 14px", borderRadius: 8, border: `1px solid ${C.border}`, cursor: "pointer", background: C.card, fontWeight: 600 }}>Next ›</button>
          </div>
        )}
      </div>
    </div>
  );
}

// ── Followups Page ────────────────────────────────────────────
function Followups({ leads }) {
  const today = new Date();
  const toDate = (s) => { if (!s) return null; try { return new Date(s); } catch { return null; } };
  const overdue = leads.filter(l => { const d = toDate(l.nextFollowup); return d && d < today && !["Won", "Lost"].includes(l.status); });
  const dueToday = leads.filter(l => { const d = toDate(l.nextFollowup); return d && d.toDateString() === today.toDateString(); });

  const Card = ({ lead, tag, tagColor }) => (
    <div style={{ background: C.card, borderRadius: 12, padding: "14px 18px", boxShadow: "0 2px 8px rgba(26,39,68,.06)", display: "flex", justifyContent: "space-between", alignItems: "center" }}>
      <div>
        <div style={{ fontSize: 11, color: C.teal, fontWeight: 700 }}>{lead.leadId}</div>
        <div style={{ fontSize: 14, fontWeight: 700, color: C.navy, margin: "2px 0" }}>{lead.clientName}</div>
        <div style={{ fontSize: 12, color: C.muted }}>{lead.city} · {lead.assignTo} · {lead.nextFollowup}</div>
      </div>
      <div style={{ display: "flex", flexDirection: "column", alignItems: "flex-end", gap: 6 }}>
        <span style={{ background: tagColor, color: "#fff", fontSize: 11, fontWeight: 700, padding: "3px 10px", borderRadius: 20 }}>{tag}</span>
        <Badge status={lead.status} />
      </div>
    </div>
  );

  return (
    <div>
      <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 24 }}>
        <div>
          <div style={{ fontSize: 14, fontWeight: 800, color: C.coral, marginBottom: 12 }}>🔴 Overdue ({overdue.length})</div>
          <div style={{ display: "flex", flexDirection: "column", gap: 10 }}>
            {overdue.length ? overdue.map(l => <Card key={l.id} lead={l} tag="OVERDUE" tagColor={C.coral} />) : <div style={{ color: C.muted, fontSize: 13 }}>No overdue follow-ups 🎉</div>}
          </div>
        </div>
        <div>
          <div style={{ fontSize: 14, fontWeight: 800, color: C.gold, marginBottom: 12 }}>🟡 Due Today ({dueToday.length})</div>
          <div style={{ display: "flex", flexDirection: "column", gap: 10 }}>
            {dueToday.length ? dueToday.map(l => <Card key={l.id} lead={l} tag="TODAY" tagColor={C.gold} />) : <div style={{ color: C.muted, fontSize: 13 }}>No follow-ups due today</div>}
          </div>
        </div>
      </div>
    </div>
  );
}

// ── Main App ──────────────────────────────────────────────────
export default function App() {
  const [leads, setLeads] = useState(SEED);
  const [page, setPage] = useState("dashboard");
  const [selectedLead, setSelectedLead] = useState(null);

  const navItems = [
    { id: "dashboard", label: "Dashboard", icon: "📊" },
    { id: "leads", label: "All Leads", icon: "📋" },
    { id: "new", label: "New Inquiry", icon: "➕" },
    { id: "followups", label: "Follow-ups", icon: "📅" },
  ];

  const handleSave = (lead) => {
    setLeads(prev => [...prev, lead]);
    setPage("leads");
  };

  return (
    <div style={{ minHeight: "100vh", background: C.bg, fontFamily: "'DM Sans', 'Segoe UI', sans-serif" }}>
      {/* Topbar */}
      <div style={{ background: C.navy, color: "#fff", padding: "0 28px", display: "flex", alignItems: "center", justifyContent: "space-between", height: 56, position: "sticky", top: 0, zIndex: 100, boxShadow: "0 2px 16px rgba(0,0,0,.18)" }}>
        <div style={{ display: "flex", alignItems: "center", gap: 12 }}>
          <div style={{ background: C.teal, color: C.navy, fontWeight: 900, fontSize: 13, padding: "5px 10px", borderRadius: 8, letterSpacing: 0.5 }}>SV</div>
          <div>
            <div style={{ fontWeight: 800, fontSize: 15, letterSpacing: 0.3 }}>S&V Railing CRM</div>
            <div style={{ fontSize: 10, opacity: 0.6, letterSpacing: 0.5 }}>RAJKOT · GUJARAT</div>
          </div>
        </div>
        <nav style={{ display: "flex", gap: 4 }}>
          {navItems.map(n => (
            <button key={n.id} onClick={() => setPage(n.id)} style={{
              background: page === n.id ? "rgba(0,201,167,.15)" : "transparent",
              color: page === n.id ? C.teal : "rgba(255,255,255,.7)",
              border: page === n.id ? `1px solid rgba(0,201,167,.3)` : "1px solid transparent",
              borderRadius: 8, padding: "7px 14px", cursor: "pointer", fontSize: 13, fontWeight: 700, display: "flex", alignItems: "center", gap: 6
            }}>
              <span>{n.icon}</span> <span style={{ display: window.innerWidth < 600 ? "none" : "inline" }}>{n.label}</span>
            </button>
          ))}
        </nav>
        <div style={{ fontSize: 12, opacity: 0.6 }}>{leads.length} leads</div>
      </div>

      {/* Page content */}
      <div style={{ padding: "24px 28px", maxWidth: 1200, margin: "0 auto" }}>
        <div style={{ marginBottom: 20 }}>
          <h1 style={{ margin: 0, fontSize: page === "new" ? 0 : 20, color: C.navy, fontWeight: 800 }}>
            {page !== "new" && navItems.find(n => n.id === page)?.label}
          </h1>
        </div>

        {page === "dashboard" && <Dashboard leads={leads} />}
        {page === "leads" && <LeadsList leads={leads} onSelect={setSelectedLead} />}
        {page === "new" && <NewLeadForm leads={leads} onSave={handleSave} onCancel={() => setPage("leads")} />}
        {page === "followups" && <Followups leads={leads} />}
      </div>

      {/* Lead Detail Slide-over */}
      {selectedLead && <LeadModal lead={selectedLead} onClose={() => setSelectedLead(null)} />}
    </div>
  );
}
