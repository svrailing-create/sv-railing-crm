import { useState, useRef, useEffect } from "react";

const SCRIPT_URL = "https://script.google.com/macros/s/AKfycbxIdHYxQChMVKYobFmafzyiQEDPdQ71BKli6vemzbKeBKjUd8IhG77A-GrrBJjSwoBa/exec";

const C = {
  navy: "#1A2744", teal: "#00C9A7", coral: "#FF6B6B",
  gold: "#F5A623", bg: "#F0F2F8", card: "#FFFFFF",
  text: "#1A2744", muted: "#7A85A3", border: "#E2E8F0",
};

const STATUS_COLORS = {
  "Won":{ bg:"#DCFCE7", text:"#166534" }, "Lost":{ bg:"#FEE2E2", text:"#991B1B" },
  "Hot":{ bg:"#FEF3C7", text:"#92400E" }, "Negotiations":{ bg:"#FEF3C7", text:"#92400E" },
  "Quotation Sent":{ bg:"#EDE9FE", text:"#5B21B6" }, "Meeting Done":{ bg:"#DBEAFE", text:"#1E40AF" },
  "Site Visit Done":{ bg:"#D1FAE5", text:"#065F46" }, "Price Given":{ bg:"#FEE2E2", text:"#9A3412" },
  "Contacted":{ bg:"#E0F2FE", text:"#075985" }, "New":{ bg:"#F1F5F9", text:"#475569" },
  "Cold":{ bg:"#F1F5F9", text:"#94A3B8" }, "Warm":{ bg:"#FEF9C3", text:"#854D0E" },
};

const SOURCES=["Site Visit","Reference","Dealer","End Client","Architect/Interiors"];
const LEAD_TYPES=["Project","Retail"];
const PROJECT_TYPES=["Bungalow","Apartments","Commercial","Office","Industrial","Hospital","Hotel","Retail Store"];
const STATUSES=["New","Contacted","Site Visit Done","Price Given","Quotation Sent","Negotiations","Meeting Done","Hot","Warm","Cold","Won","Lost"];
const QUOT_STATUSES=["Not Sent","Sent","Revised","Approved"];
const FLOORS=["G","G+1","G+2","G+3","G+4","G+5","More"];
const BUDGET_RANGES=["Under 50K","50K–1L","1L–3L","3L–5L","5L–10L","10L+"];
const STAGES=["Planning","Construction","Finishing","Ready","Renovation"];
const URGENCIES=["Immediate","1 Month","2 Months","3 Months","6 Months","No Rush"];
const MOUNTING_TYPES=["Top Mount","Side Mount","Core Drill","Spider Fitting","U-Channel","Patch Fitting","Wall Bracket"];
const FINISHES=["Black Powder Coat","Silver/White Powder Coat","Gold PVD","Rose Gold PVD","Bronze PVD","SS Mirror Polish","SS Matt/Hairline","Custom"];
const PROD_STATUSES=["Not Started","In Progress","Complete"];
const INSTALL_STATUSES=["Pending","Scheduled","Done"];
const BILLING_STATUSES=["Pending","Partial","Complete"];
const ASSIGN_TO=["Siddharth Bhatt","Viraj Vadodariya"];

const fmt=(n)=>n?`₹${Number(n).toLocaleString("en-IN")}`:"—";
const pct=(a,b)=>b?((a/b)*100).toFixed(1)+"%":"0%";

function useIsMobile() {
  const [mobile,setMobile]=useState(window.innerWidth<768);
  useEffect(()=>{ const fn=()=>setMobile(window.innerWidth<768); window.addEventListener("resize",fn); return()=>window.removeEventListener("resize",fn); },[]);
  return mobile;
}

function Badge({ status }) {
  const c=STATUS_COLORS[status]||{ bg:"#F1F5F9", text:"#475569" };
  return <span style={{ background:c.bg, color:c.text, padding:"2px 10px", borderRadius:20, fontSize:11, fontWeight:700, whiteSpace:"nowrap" }}>{status||"—"}</span>;
}

function KpiCard({ label, value, color }) {
  return (
    <div style={{ background:"#fff", borderRadius:14, padding:"16px 18px", boxShadow:"0 2px 12px rgba(26,39,68,.07)", borderTop:`4px solid ${color}` }}>
      <div style={{ color:C.muted, fontSize:11, fontWeight:700, letterSpacing:1, textTransform:"uppercase" }}>{label}</div>
      <div style={{ color:C.text, fontSize:22, fontWeight:800, marginTop:6 }}>{value}</div>
    </div>
  );
}

function Input({ label, type="text", value, onChange, required, placeholder, options, half }) {
  const isMobile=useIsMobile();
  const base={ width:"100%", padding:"10px 13px", borderRadius:8, border:"1.5px solid #E2E8F0", fontSize:14, color:C.text, background:"#FAFBFE", boxSizing:"border-box", outline:"none", fontFamily:"inherit" };
  return (
    <div style={{ display:"flex", flexDirection:"column", gap:4, flex:half&&!isMobile?"0 0 calc(50% - 6px)":"1 1 100%" }}>
      <label style={{ fontSize:12, fontWeight:600, color:C.muted }}>{label}{required&&<span style={{ color:C.coral }}> *</span>}</label>
      {options
        ?<select value={value} onChange={e=>onChange(e.target.value)} style={base}><option value="">— Select —</option>{options.map(o=><option key={o} value={o}>{o}</option>)}</select>
        :type==="textarea"
        ?<textarea value={value} onChange={e=>onChange(e.target.value)} placeholder={placeholder} rows={3} style={{ ...base, resize:"vertical" }}/>
        :<input type={type} value={value} onChange={e=>onChange(e.target.value)} placeholder={placeholder} style={base}/>
      }
    </div>
  );
}

function Sec({ title, children }) {
  return (
    <div style={{ marginBottom:20 }}>
      <div style={{ display:"flex", alignItems:"center", gap:8, marginBottom:12 }}>
        <div style={{ height:3, width:18, background:C.teal, borderRadius:2 }}/>
        <span style={{ fontSize:12, fontWeight:700, color:C.navy, textTransform:"uppercase", letterSpacing:0.8 }}>{title}</span>
      </div>
      <div style={{ display:"flex", flexWrap:"wrap", gap:12 }}>{children}</div>
    </div>
  );
}

function PhotoUpload({ photos, onChange }) {
  const fileRef=useRef();
  const handleFiles=(e)=>{ Array.from(e.target.files).forEach(file=>{ const reader=new FileReader(); reader.onload=(ev)=>{ onChange(prev=>[...prev,{ id:Date.now()+Math.random(), url:ev.target.result, name:file.name, remark:"", type:"site_visit" }]); }; reader.readAsDataURL(file); }); e.target.value=""; };
  const TYPES=["site_visit","measurement","installation","completion","reference"];
  return (
    <div style={{ width:"100%" }}>
      <input ref={fileRef} type="file" accept="image/*" multiple onChange={handleFiles} style={{ display:"none" }}/>
      <button type="button" onClick={()=>fileRef.current.click()} style={{ background:C.navy, color:"#fff", border:"none", borderRadius:10, padding:"11px 22px", fontSize:13, fontWeight:700, cursor:"pointer", marginBottom:14 }}>📷 Upload Photos</button>
      {photos.length===0&&<div style={{ border:"2px dashed #E2E8F0", borderRadius:12, padding:"24px", textAlign:"center", color:C.muted, fontSize:13 }}>No photos yet. Tap above to add site photos.</div>}
      <div style={{ display:"grid", gridTemplateColumns:"repeat(auto-fill,minmax(160px,1fr))", gap:12 }}>
        {photos.map(p=>(
          <div key={p.id} style={{ background:"#fff", borderRadius:12, overflow:"hidden", boxShadow:"0 2px 8px rgba(0,0,0,.08)", border:"1px solid #E2E8F0" }}>
            <div style={{ position:"relative" }}>
              <img src={p.url} alt={p.name} style={{ width:"100%", height:130, objectFit:"cover", display:"block" }}/>
              <button type="button" onClick={()=>onChange(prev=>prev.filter(x=>x.id!==p.id))} style={{ position:"absolute", top:6, right:6, background:"rgba(255,60,60,.85)", color:"#fff", border:"none", borderRadius:"50%", width:26, height:26, cursor:"pointer", fontWeight:700 }}>✕</button>
              <select value={p.type} onChange={e=>onChange(prev=>prev.map(x=>x.id===p.id?{...x,type:e.target.value}:x))} style={{ position:"absolute", bottom:6, left:6, fontSize:10, padding:"2px 6px", borderRadius:5, border:"none", background:"rgba(26,39,68,.8)", color:"#fff" }}>
                {TYPES.map(t=><option key={t} value={t}>{t.replace("_"," ")}</option>)}
              </select>
            </div>
            <div style={{ padding:"8px 10px" }}>
              <div style={{ fontSize:10, color:C.muted, marginBottom:4, overflow:"hidden", textOverflow:"ellipsis", whiteSpace:"nowrap" }}>{p.name}</div>
              <textarea placeholder="Add remark..." value={p.remark} onChange={e=>onChange(prev=>prev.map(x=>x.id===p.id?{...x,remark:e.target.value}:x))} rows={2} style={{ width:"100%", border:"1.5px solid #E2E8F0", borderRadius:7, padding:"6px 9px", fontSize:12, resize:"none", fontFamily:"inherit", boxSizing:"border-box" }}/>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}

const BLANK={ leadType:"", source:"", refBy:"", clientName:"", contact:"", email:"", city:"", projectName:"", projectType:"", address:"", siteCity:"", floors:"", estRft:"", budgetRange:"", projectStage:"", urgency:"", material:"", productType:"", railingType:"", mountingType:"", finish:"", glassSpec:"", architect:"", archContact:"", assignTo:"", siteVisit:"", measurements:"", quotationStatus:"Not Sent", amount:"", lastQuotDate:"", lastFollowup:"", nextFollowup:"", notes:"", status:"New", finalDeal:"", expectedClosure:"", lostReason:"", jmsDone:"", finalRft:"", productionStatus:"", installationStatus:"", billingStatus:"", photos:[] };

function NewLeadForm({ leads, onSave, onCancel, currentUser }) {
  const [f,setF]=useState({ ...BLANK, assignTo:currentUser });
  const [saving,setSaving]=useState(false);
  const nextId=leads.length+1;
  const leadId=`LD/SV/26-27/${String(nextId).padStart(4,"0")}`;
  const today=new Date().toLocaleDateString("en-IN",{ day:"2-digit", month:"2-digit", year:"numeric" }).replace(/\//g,".");
  const set=k=>v=>setF(p=>({ ...p, [k]:v }));

  const handleSubmit=async(e)=>{
    e.preventDefault();
    if(!f.clientName||!f.leadType||!f.source||!f.city||!f.assignTo){ alert("Fill required fields (*)"); return; }
    setSaving(true);
    const lead={ ...f, id:nextId, leadId, entryDate:today, submittedBy:currentUser, photos:[] };
    try {
      await fetch(SCRIPT_URL, {
        method:"POST",
        body:JSON.stringify(lead),
      });
    } catch(err) { console.log("Sheet save error", err); }
    onSave(lead);
    setSaving(false);
  };

  const card={ background:"#fff", borderRadius:14, padding:"20px 18px", marginBottom:12, boxShadow:"0 2px 10px rgba(26,39,68,.06)" };
  return (
    <div style={{ maxWidth:860, margin:"0 auto", paddingBottom:60 }}>
      <div style={{ display:"flex", justifyContent:"space-between", alignItems:"center", marginBottom:24, flexWrap:"wrap", gap:10 }}>
        <div>
          <h2 style={{ margin:0, fontSize:20, color:C.navy, fontWeight:800 }}>New Inquiry</h2>
          <div style={{ color:C.muted, fontSize:12, marginTop:3 }}>Lead ID: <b>{leadId}</b> · {today} · <b style={{ color:C.teal }}>{currentUser}</b></div>
        </div>
        <button onClick={onCancel} style={{ background:"#F1F5F9", color:C.navy, border:"none", borderRadius:10, padding:"9px 18px", cursor:"pointer", fontWeight:600 }}>✕ Cancel</button>
      </div>
      <form onSubmit={handleSubmit}>
        <div style={card}><Sec title="Lead Identity"><Input label="Lead Type" options={LEAD_TYPES} value={f.leadType} onChange={set("leadType")} required half/><Input label="Source" options={SOURCES} value={f.source} onChange={set("source")} required half/><Input label="Reference By" value={f.refBy} onChange={set("refBy")} placeholder="Name"/></Sec></div>
        <div style={card}><Sec title="Client Details"><Input label="Client Name" value={f.clientName} onChange={set("clientName")} required placeholder="Full name"/><Input label="Contact" type="tel" value={f.contact} onChange={set("contact")} required placeholder="Mobile" half/><Input label="Email" type="email" value={f.email} onChange={set("email")} placeholder="email@example.com" half/><Input label="City" value={f.city} onChange={set("city")} required placeholder="Client city" half/></Sec></div>
        <div style={card}><Sec title="Project Info"><Input label="Project Name" value={f.projectName} onChange={set("projectName")} placeholder="Building name" half/><Input label="Project Type" options={PROJECT_TYPES} value={f.projectType} onChange={set("projectType")} half/><Input label="Address" type="textarea" value={f.address} onChange={set("address")} placeholder="Site address"/><Input label="Site City" value={f.siteCity} onChange={set("siteCity")} placeholder="City of site" half/><Input label="No. of Floors" options={FLOORS} value={f.floors} onChange={set("floors")} half/><Input label="Est. RFT" type="number" value={f.estRft} onChange={set("estRft")} placeholder="Running feet" half/><Input label="Budget Range" options={BUDGET_RANGES} value={f.budgetRange} onChange={set("budgetRange")} half/></Sec></div>
        <div style={card}><Sec title="Timeline"><Input label="Project Stage" options={STAGES} value={f.projectStage} onChange={set("projectStage")} half/><Input label="Urgency" options={URGENCIES} value={f.urgency} onChange={set("urgency")} half/></Sec></div>
        <div style={card}><Sec title="Technical"><Input label="Material" value={f.material} onChange={set("material")} placeholder="SS304, Aluminium, etc."/><Input label="Product Type" value={f.productType} onChange={set("productType")} placeholder="Railing/accessories"/><Input label="Railing Type" value={f.railingType} onChange={set("railingType")} placeholder="Type" half/><Input label="Mounting Type" options={MOUNTING_TYPES} value={f.mountingType} onChange={set("mountingType")} half/><Input label="Finish" options={FINISHES} value={f.finish} onChange={set("finish")} half/><Input label="Glass Spec" value={f.glassSpec} onChange={set("glassSpec")} placeholder="e.g. 12mm clear" half/></Sec></div>
        <div style={card}><Sec title="Stakeholders"><Input label="Architect / Interior" value={f.architect} onChange={set("architect")} placeholder="Name" half/><Input label="Arch. Contact" type="tel" value={f.archContact} onChange={set("archContact")} placeholder="Mobile" half/></Sec></div>
        <div style={card}><Sec title="Sales"><Input label="Assign To" options={ASSIGN_TO} value={f.assignTo} onChange={set("assignTo")} required half/><Input label="Status" options={STATUSES} value={f.status} onChange={set("status")} required half/><Input label="Site Visit Done" type="date" value={f.siteVisit} onChange={set("siteVisit")} half/><Input label="Measurements Done" type="date" value={f.measurements} onChange={set("measurements")} half/></Sec></div>
        <div style={card}><Sec title="Quotation"><Input label="Quotation Status" options={QUOT_STATUSES} value={f.quotationStatus} onChange={set("quotationStatus")} half/><Input label="Amount (₹)" type="number" value={f.amount} onChange={set("amount")} placeholder="Quote amount" half/><Input label="Last Quotation Date" type="date" value={f.lastQuotDate} onChange={set("lastQuotDate")} half/></Sec></div>
        <div style={card}><Sec title="Follow-up"><Input label="Last Follow-Up" type="date" value={f.lastFollowup} onChange={set("lastFollowup")} half/><Input label="Next Follow-Up" type="date" value={f.nextFollowup} onChange={set("nextFollowup")} half/><Input label="Notes" type="textarea" value={f.notes} onChange={set("notes")} placeholder="Conversation notes..."/></Sec></div>
        <div style={card}><Sec title="Closure"><Input label="Final Deal (₹)" type="number" value={f.finalDeal} onChange={set("finalDeal")} placeholder="Confirmed value" half/><Input label="Expected Closure" type="date" value={f.expectedClosure} onChange={set("expectedClosure")} half/>{f.status==="Lost"&&<Input label="Lost Reason" type="textarea" value={f.lostReason} onChange={set("lostReason")} placeholder="Why lost?"/>}</Sec></div>
        <div style={card}><Sec title="Execution"><Input label="JMS Done Date" type="date" value={f.jmsDone} onChange={set("jmsDone")} half/><Input label="Final RFT" type="number" value={f.finalRft} onChange={set("finalRft")} placeholder="Final RFT" half/><Input label="Production Status" options={PROD_STATUSES} value={f.productionStatus} onChange={set("productionStatus")} half/><Input label="Installation Status" options={INSTALL_STATUSES} value={f.installationStatus} onChange={set("installationStatus")} half/><Input label="Billing Status" options={BILLING_STATUSES} value={f.billingStatus} onChange={set("billingStatus")} half/></Sec></div>
        <div style={card}><Sec title="Site Photos"><PhotoUpload photos={f.photos} onChange={updater=>setF(p=>({ ...p, photos:typeof updater==="function"?updater(p.photos):updater }))}/></Sec></div>
        <button type="submit" disabled={saving} style={{ width:"100%", background:saving?"#7A85A3":C.navy, color:"#fff", border:"none", borderRadius:14, padding:"16px 0", fontSize:16, fontWeight:800, cursor:saving?"not-allowed":"pointer" }}>
          {saving?"⏳ Saving to Google Sheet...":"✅ Save Inquiry — "+leadId}
        </button>
      </form>
    </div>
  );
}

function LeadModal({ lead, onClose }) {
  if(!lead) return null;
  const Row=({ label, val })=>val?<div style={{ display:"flex", gap:10, padding:"7px 0", borderBottom:"1px solid #E2E8F0" }}><div style={{ color:C.muted, fontSize:11, fontWeight:600, width:140, flexShrink:0 }}>{label}</div><div style={{ fontSize:13, color:C.text }}>{val}</div></div>:null;
  return (
    <div style={{ position:"fixed", inset:0, background:"rgba(10,20,50,.55)", zIndex:999, display:"flex", alignItems:"flex-start", justifyContent:"flex-end" }} onClick={onClose}>
      <div style={{ background:"#fff", width:440, maxWidth:"100vw", height:"100vh", overflowY:"auto", padding:24, boxShadow:"-8px 0 40px rgba(0,0,0,.15)" }} onClick={e=>e.stopPropagation()}>
        <div style={{ display:"flex", justifyContent:"space-between", alignItems:"flex-start", marginBottom:18 }}>
          <div><div style={{ fontSize:11, color:C.teal, fontWeight:700 }}>{lead["Lead ID"]||lead.leadId}</div><div style={{ fontSize:17, fontWeight:800, color:C.navy, margin:"3px 0" }}>{lead["Client Name"]||lead.clientName}</div><Badge status={lead["Status"]||lead.status}/></div>
          <button onClick={onClose} style={{ background:"#F1F5F9", border:"none", borderRadius:8, padding:"7px 13px", cursor:"pointer", fontWeight:700 }}>✕</button>
        </div>
        <Row label="Lead Type" val={lead["Lead Type"]||lead.leadType}/>
        <Row label="Source" val={lead["Source"]||lead.source}/>
        <Row label="Contact" val={lead["Contact"]||lead.contact}/>
        <Row label="City" val={lead["City"]||lead.city}/>
        <Row label="Project Type" val={lead["Project Type"]||lead.projectType}/>
        <Row label="Floors" val={lead["Floors"]||lead.floors}/>
        <Row label="Material" val={lead["Material"]||lead.material}/>
        <Row label="Product Type" val={lead["Product Type"]||lead.productType}/>
        <Row label="Mounting" val={lead["Mounting Type"]||lead.mountingType}/>
        <Row label="Finish" val={lead["Finish"]||lead.finish}/>
        <Row label="Assigned To" val={lead["Assign To"]||lead.assignTo}/>
        <Row label="Submitted By" val={lead["Submitted By"]||lead.submittedBy}/>
        <Row label="Quotation" val={lead["Quotation Status"]||lead.quotationStatus}/>
        <Row label="Amount" val={fmt(lead["Amount"]||lead.amount)}/>
        <Row label="Final Deal" val={fmt(lead["Final Deal"]||lead.finalDeal)}/>
        <Row label="Status" val={lead["Status"]||lead.status}/>
        <Row label="Notes" val={lead["Notes"]||lead.notes}/>
        <Row label="Lost Reason" val={lead["Lost Reason"]||lead.lostReason}/>
        <Row label="Submitted At" val={lead["Submitted At"]}/>
      </div>
    </div>
  );
}

function Dashboard({ leads }) {
  const isMobile=useIsMobile();
  const won=leads.filter(l=>(l["Status"]||l.status)==="Won");
  const lost=leads.filter(l=>(l["Status"]||l.status)==="Lost");
  const getAmt=l=>Number(l["Amount"]||l.amount)||0;
  const getFinal=l=>Number(l["Final Deal"]||l.finalDeal)||0;
  const pipeline=leads.reduce((s,l)=>s+getAmt(l),0);
  const wonVal=won.reduce((s,l)=>s+getFinal(l),0);
  const getStatus=l=>l["Status"]||l.status||"";
  const statusCounts={};
  STATUSES.forEach(s=>{ statusCounts[s]=leads.filter(l=>getStatus(l)===s).length; });
  const maxCount=Math.max(...Object.values(statusCounts),1);
  const getAssign=l=>l["Assign To"]||l.assignTo||"";
  const sbLeads=leads.filter(l=>getAssign(l)==="Siddharth Bhatt");
  const vvLeads=leads.filter(l=>getAssign(l)==="Viraj Vadodariya");
  return (
    <div>
      <div style={{ display:"grid", gridTemplateColumns:"repeat(auto-fit,minmax(130px,1fr))", gap:12, marginBottom:20 }}>
        <KpiCard label="Total Leads" value={leads.length} color={C.navy}/>
        <KpiCard label="Active" value={leads.filter(l=>!["Won","Lost"].includes(getStatus(l))).length} color={C.teal}/>
        <KpiCard label="Pipeline" value={`₹${(pipeline/100000).toFixed(1)}L`} color="#6366F1"/>
        <KpiCard label="Won Value" value={`₹${(wonVal/100000).toFixed(1)}L`} color="#10B981"/>
        <KpiCard label="Conversion" value={pct(won.length,leads.length)} color={C.gold}/>
        <KpiCard label="Won/Lost" value={`${won.length}/${lost.length}`} color={C.coral}/>
      </div>

      {/* Partner stats */}
      <div style={{ display:"grid", gridTemplateColumns:isMobile?"1fr":"1fr 1fr", gap:12, marginBottom:16 }}>
        {[{ name:"Siddharth Bhatt", data:sbLeads, color:"#6366F1" },{ name:"Viraj Vadodariya", data:vvLeads, color:C.teal }].map(p=>(
          <div key={p.name} style={{ background:"#fff", borderRadius:14, padding:"16px 20px", boxShadow:"0 2px 10px rgba(26,39,68,.07)", borderLeft:`4px solid ${p.color}` }}>
            <div style={{ fontWeight:700, color:C.navy, marginBottom:10 }}>👤 {p.name}</div>
            <div style={{ display:"flex", gap:20 }}>
              <div><div style={{ fontSize:11, color:C.muted }}>Leads</div><div style={{ fontSize:20, fontWeight:800, color:C.navy }}>{p.data.length}</div></div>
              <div><div style={{ fontSize:11, color:C.muted }}>Won</div><div style={{ fontSize:20, fontWeight:800, color:"#10B981" }}>{p.data.filter(l=>getStatus(l)==="Won").length}</div></div>
              <div><div style={{ fontSize:11, color:C.muted }}>Pipeline</div><div style={{ fontSize:20, fontWeight:800, color:p.color }}>₹{(p.data.reduce((s,l)=>s+getAmt(l),0)/100000).toFixed(1)}L</div></div>
            </div>
          </div>
        ))}
      </div>

      <div style={{ background:"#fff", borderRadius:14, padding:20, boxShadow:"0 2px 12px rgba(26,39,68,.07)" }}>
        <div style={{ fontWeight:700, color:C.navy, marginBottom:16, fontSize:14 }}>📊 Status Funnel</div>
        {STATUSES.map(s=>{
          const count=statusCounts[s]||0;
          const c=STATUS_COLORS[s]||{ bg:"#E2E8F0", text:"#475569" };
          return <div key={s} style={{ display:"flex", alignItems:"center", gap:8, marginBottom:9 }}>
            <div style={{ width:isMobile?90:140, fontSize:11, color:C.muted, fontWeight:600, textAlign:"right", flexShrink:0 }}>{s}</div>
            <div style={{ flex:1, background:"#F1F5F9", borderRadius:5, height:20, position:"relative", overflow:"hidden" }}>
              <div style={{ position:"absolute", left:0, top:0, bottom:0, width:`${(count/maxCount)*100}%`, background:c.bg, borderRadius:5 }}/>
            </div>
            <div style={{ width:20, fontSize:12, fontWeight:800, color:c.text }}>{count}</div>
          </div>;
        })}
      </div>
    </div>
  );
}

function LeadsList({ leads, onSelect }) {
  const isMobile=useIsMobile();
  const [search,setSearch]=useState("");
  const [filterStatus,setFilterStatus]=useState("");
  const [filterAssign,setFilterAssign]=useState("");
  const [page,setPage]=useState(1);
  const PER=10;
  const getVal=(l,sheet,local)=>l[sheet]||l[local]||"";
  const filtered=leads.filter(l=>{
    const q=search.toLowerCase();
    const name=getVal(l,"Client Name","clientName").toLowerCase();
    const id=getVal(l,"Lead ID","leadId").toLowerCase();
    const city=getVal(l,"City","city").toLowerCase();
    const contact=getVal(l,"Contact","contact");
    const status=getVal(l,"Status","status");
    const assign=getVal(l,"Assign To","assignTo");
    return(!q||name.includes(q)||id.includes(q)||city.includes(q)||contact.includes(q))&&(!filterStatus||status===filterStatus)&&(!filterAssign||assign===filterAssign);
  });
  const pages=Math.ceil(filtered.length/PER);
  const visible=filtered.slice((page-1)*PER,page*PER);

  if(isMobile) return (
    <div>
      <input placeholder="🔍 Search client, ID, city..." value={search} onChange={e=>{setSearch(e.target.value);setPage(1);}} style={{ width:"100%", padding:"11px 14px", borderRadius:10, border:"1.5px solid #E2E8F0", fontSize:14, marginBottom:10, boxSizing:"border-box" }}/>
      <div style={{ display:"flex", gap:8, marginBottom:10 }}>
        <select value={filterStatus} onChange={e=>{setFilterStatus(e.target.value);setPage(1);}} style={{ flex:1, padding:"9px 10px", borderRadius:9, border:"1.5px solid #E2E8F0", fontSize:12 }}><option value="">All Status</option>{STATUSES.map(s=><option key={s}>{s}</option>)}</select>
        <select value={filterAssign} onChange={e=>{setFilterAssign(e.target.value);setPage(1);}} style={{ flex:1, padding:"9px 10px", borderRadius:9, border:"1.5px solid #E2E8F0", fontSize:12 }}><option value="">All Staff</option>{ASSIGN_TO.map(s=><option key={s}>{s}</option>)}</select>
      </div>
      <div style={{ fontSize:12, color:C.muted, marginBottom:8 }}>{filtered.length} leads</div>
      <div style={{ display:"flex", flexDirection:"column", gap:10 }}>
        {visible.map((l,i)=>{
          const name=getVal(l,"Client Name","clientName");
          const id=getVal(l,"Lead ID","leadId");
          const city=getVal(l,"City","city");
          const contact=getVal(l,"Contact","contact");
          const status=getVal(l,"Status","status");
          const type=getVal(l,"Lead Type","leadType");
          const amount=getVal(l,"Amount","amount");
          return (
            <div key={i} onClick={()=>onSelect(l)} style={{ background:"#fff", borderRadius:13, padding:"14px 16px", boxShadow:"0 2px 8px rgba(26,39,68,.07)", cursor:"pointer" }}>
              <div style={{ display:"flex", justifyContent:"space-between", alignItems:"flex-start" }}>
                <div><div style={{ fontSize:10, color:C.teal, fontWeight:700, fontFamily:"monospace" }}>{id}</div><div style={{ fontSize:15, fontWeight:800, color:C.navy, margin:"2px 0" }}>{name||"—"}</div><div style={{ fontSize:12, color:C.muted }}>{city} · {contact}</div></div>
                <Badge status={status}/>
              </div>
              <div style={{ display:"flex", justifyContent:"space-between", marginTop:10, alignItems:"center" }}>
                <span style={{ background:type==="Project"?"#DBEAFE":"#FEF9C3", color:type==="Project"?"#1E40AF":"#854D0E", padding:"2px 8px", borderRadius:6, fontSize:11, fontWeight:700 }}>{type||"—"}</span>
                <span style={{ fontSize:13, fontWeight:800, color:C.navy }}>{amount?fmt(amount):"—"}</span>
              </div>
            </div>
          );
        })}
        {visible.length===0&&<div style={{ padding:40, textAlign:"center", color:C.muted, background:"#fff", borderRadius:13 }}>No leads found.</div>}
      </div>
      {pages>1&&<div style={{ display:"flex", justifyContent:"center", gap:8, padding:"14px 0" }}>
        <button onClick={()=>setPage(p=>Math.max(1,p-1))} disabled={page===1} style={{ padding:"8px 16px", borderRadius:8, border:"1px solid #E2E8F0", cursor:"pointer", background:"#fff", fontWeight:600 }}>‹</button>
        <span style={{ padding:"8px 12px", fontSize:13, color:C.muted }}>{page}/{pages}</span>
        <button onClick={()=>setPage(p=>Math.min(pages,p+1))} disabled={page===pages} style={{ padding:"8px 16px", borderRadius:8, border:"1px solid #E2E8F0", cursor:"pointer", background:"#fff", fontWeight:600 }}>›</button>
      </div>}
    </div>
  );

  return (
    <div>
      <div style={{ display:"flex", flexWrap:"wrap", gap:10, marginBottom:14 }}>
        <input placeholder="🔍 Search..." value={search} onChange={e=>{setSearch(e.target.value);setPage(1);}} style={{ flex:"1 1 200px", padding:"10px 14px", borderRadius:10, border:"1.5px solid #E2E8F0", fontSize:13 }}/>
        <select value={filterStatus} onChange={e=>{setFilterStatus(e.target.value);setPage(1);}} style={{ padding:"10px 12px", borderRadius:10, border:"1.5px solid #E2E8F0", fontSize:13 }}><option value="">All Status</option>{STATUSES.map(s=><option key={s}>{s}</option>)}</select>
        <select value={filterAssign} onChange={e=>{setFilterAssign(e.target.value);setPage(1);}} style={{ padding:"10px 12px", borderRadius:10, border:"1.5px solid #E2E8F0", fontSize:13 }}><option value="">All Staff</option>{ASSIGN_TO.map(s=><option key={s}>{s}</option>)}</select>
      </div>
      <div style={{ fontSize:12, color:C.muted, marginBottom:8 }}>{filtered.length} leads</div>
      <div style={{ background:"#fff", borderRadius:14, overflow:"hidden", boxShadow:"0 2px 12px rgba(26,39,68,.07)" }}>
        <div style={{ overflowX:"auto" }}>
          <table style={{ width:"100%", borderCollapse:"collapse", fontSize:13 }}>
            <thead><tr style={{ background:C.navy, color:"#fff" }}>{["Lead ID","Client","Contact","City","Type","Amount","Status","Assigned By"].map(h=><th key={h} style={{ padding:"11px 13px", textAlign:"left", fontWeight:700, fontSize:11, whiteSpace:"nowrap" }}>{h}</th>)}</tr></thead>
            <tbody>
              {visible.map((l,i)=>{
                const name=getVal(l,"Client Name","clientName");
                const id=getVal(l,"Lead ID","leadId");
                const city=getVal(l,"City","city");
                const contact=getVal(l,"Contact","contact");
                const status=getVal(l,"Status","status");
                const type=getVal(l,"Lead Type","leadType");
                const amount=getVal(l,"Amount","amount");
                const assign=getVal(l,"Assign To","assignTo");
                return (
                  <tr key={i} onClick={()=>onSelect(l)} style={{ background:i%2?"#FAFBFE":"#fff", cursor:"pointer" }} onMouseEnter={e=>e.currentTarget.style.background="#EEF2FF"} onMouseLeave={e=>e.currentTarget.style.background=i%2?"#FAFBFE":"#fff"}>
                    <td style={{ padding:"10px 13px", color:C.teal, fontWeight:700, fontFamily:"monospace", fontSize:11 }}>{id}</td>
                    <td style={{ padding:"10px 13px", fontWeight:600, color:C.navy }}>{name||"—"}</td>
                    <td style={{ padding:"10px 13px", color:C.muted }}>{contact||"—"}</td>
                    <td style={{ padding:"10px 13px" }}>{city||"—"}</td>
                    <td style={{ padding:"10px 13px" }}><span style={{ background:type==="Project"?"#DBEAFE":"#FEF9C3", color:type==="Project"?"#1E40AF":"#854D0E", padding:"2px 7px", borderRadius:5, fontSize:11, fontWeight:700 }}>{type||"—"}</span></td>
                    <td style={{ padding:"10px 13px", fontWeight:700 }}>{amount?fmt(amount):"—"}</td>
                    <td style={{ padding:"10px 13px" }}><Badge status={status}/></td>
                    <td style={{ padding:"10px 13px", fontSize:12, color:C.muted }}>{assign}</td>
                  </tr>
                );
              })}
              {visible.length===0&&<tr><td colSpan={8} style={{ padding:40, textAlign:"center", color:C.muted }}>No leads found.</td></tr>}
            </tbody>
          </table>
        </div>
        {pages>1&&<div style={{ display:"flex", justifyContent:"center", gap:8, padding:14, borderTop:"1px solid #E2E8F0" }}>
          <button onClick={()=>setPage(p=>Math.max(1,p-1))} disabled={page===1} style={{ padding:"7px 14px", borderRadius:8, border:"1px solid #E2E8F0", cursor:"pointer", background:"#fff", fontWeight:600 }}>‹ Prev</button>
          <span style={{ padding:"7px 12px", fontSize:13, color:C.muted }}>Page {page} of {pages}</span>
          <button onClick={()=>setPage(p=>Math.min(pages,p+1))} disabled={page===pages} style={{ padding:"7px 14px", borderRadius:8, border:"1px solid #E2E8F0", cursor:"pointer", background:"#fff", fontWeight:600 }}>Next ›</button>
        </div>}
      </div>
    </div>
  );
}

// ── Login Screen ───────────────────────────────────────────────
function Login({ onLogin }) {
  return (
    <div style={{ minHeight:"100vh", background:C.navy, display:"flex", alignItems:"center", justifyContent:"center", padding:20 }}>
      <div style={{ background:"#fff", borderRadius:20, padding:"40px 32px", width:"100%", maxWidth:360, textAlign:"center", boxShadow:"0 20px 60px rgba(0,0,0,.3)" }}>
        <div style={{ background:C.teal, color:C.navy, fontWeight:900, fontSize:18, padding:"8px 16px", borderRadius:10, display:"inline-block", marginBottom:16 }}>SV</div>
        <h2 style={{ margin:"0 0 6px", fontSize:22, color:C.navy, fontWeight:800 }}>S&V Railing CRM</h2>
        <p style={{ color:C.muted, fontSize:13, marginBottom:28 }}>Select your name to continue</p>
        <div style={{ display:"flex", flexDirection:"column", gap:12 }}>
          {ASSIGN_TO.map(name=>(
            <button key={name} onClick={()=>onLogin(name)} style={{ background:C.navy, color:"#fff", border:"none", borderRadius:12, padding:"16px 20px", fontSize:16, fontWeight:700, cursor:"pointer", transition:"background .2s" }}
              onMouseEnter={e=>e.currentTarget.style.background=C.teal}
              onMouseLeave={e=>e.currentTarget.style.background=C.navy}>
              👤 {name}
            </button>
          ))}
        </div>
        <p style={{ color:C.muted, fontSize:11, marginTop:20 }}>S V Railing · Rajkot, Gujarat</p>
      </div>
    </div>
  );
}

export default function App() {
  const [currentUser,setCurrentUser]=useState(()=>localStorage.getItem("sv_user")||"");
  const [leads,setLeads]=useState([]);
  const [loading,setLoading]=useState(true);
  const [page,setPage]=useState("dashboard");
  const [selectedLead,setSelectedLead]=useState(null);
  const [menuOpen,setMenuOpen]=useState(false);
  const [lastRefresh,setLastRefresh]=useState(null);
  const isMobile=useIsMobile();

  // ── Load leads from Google Sheet ───────────────────────────
  const fetchLeads=async()=>{
    setLoading(true);
    try {
      const res=await fetch(SCRIPT_URL);
      const data=await res.json();
      if(data.leads) setLeads(data.leads.reverse());
      setLastRefresh(new Date().toLocaleTimeString("en-IN"));
    } catch(e){ console.log("Fetch error",e); }
    setLoading(false);
  };

  useEffect(()=>{ if(currentUser) fetchLeads(); else setLoading(false); },[currentUser]);

  const handleLogin=(name)=>{ localStorage.setItem("sv_user",name); setCurrentUser(name); };
  const handleLogout=()=>{ localStorage.removeItem("sv_user"); setCurrentUser(""); setPage("dashboard"); };
  const handleSave=(lead)=>{ setLeads(prev=>[lead,...prev]); setPage("leads"); };
  const goTo=(id)=>{ setPage(id); setMenuOpen(false); };

  if(!currentUser) return <Login onLogin={handleLogin}/>;

  const navItems=[
    { id:"dashboard", label:"Dashboard", icon:"📊" },
    { id:"leads", label:"All Leads", icon:"📋" },
    { id:"new", label:"New Inquiry", icon:"➕" },
  ];

  return (
    <div style={{ minHeight:"100vh", background:C.bg, fontFamily:"'DM Sans','Segoe UI',sans-serif" }}>
      {/* Topbar */}
      <div style={{ background:C.navy, color:"#fff", padding:"0 16px", display:"flex", alignItems:"center", justifyContent:"space-between", height:54, position:"sticky", top:0, zIndex:100, boxShadow:"0 2px 16px rgba(0,0,0,.18)" }}>
        <div style={{ display:"flex", alignItems:"center", gap:10 }}>
          <div style={{ background:C.teal, color:C.navy, fontWeight:900, fontSize:12, padding:"4px 9px", borderRadius:7 }}>SV</div>
          {!isMobile&&<div><div style={{ fontWeight:800, fontSize:14 }}>S&V Railing CRM</div><div style={{ fontSize:10, opacity:0.6 }}>RAJKOT · GUJARAT</div></div>}
        </div>
        {isMobile?(
          <button onClick={()=>setMenuOpen(o=>!o)} style={{ background:"rgba(255,255,255,.1)", color:"#fff", border:"none", borderRadius:8, padding:"8px 12px", cursor:"pointer", fontSize:18 }}>☰</button>
        ):(
          <nav style={{ display:"flex", gap:4 }}>
            {navItems.map(n=>(
              <button key={n.id} onClick={()=>goTo(n.id)} style={{ background:page===n.id?"rgba(0,201,167,.15)":"transparent", color:page===n.id?C.teal:"rgba(255,255,255,.75)", border:page===n.id?"1px solid rgba(0,201,167,.35)":"1px solid transparent", borderRadius:8, padding:"7px 14px", cursor:"pointer", fontSize:13, fontWeight:700 }}>
                {n.icon} {n.label}
              </button>
            ))}
          </nav>
        )}
        <div style={{ display:"flex", alignItems:"center", gap:10 }}>
          <div style={{ fontSize:11, opacity:0.7, textAlign:"right" }}>
            <div style={{ color:C.teal, fontWeight:700 }}>{currentUser.split(" ")[0]}</div>
            {lastRefresh&&!isMobile&&<div style={{ fontSize:10 }}>↻ {lastRefresh}</div>}
          </div>
          <button onClick={fetchLeads} style={{ background:"rgba(255,255,255,.1)", color:"#fff", border:"none", borderRadius:7, padding:"6px 10px", cursor:"pointer", fontSize:13 }}>↻</button>
          <button onClick={handleLogout} style={{ background:"rgba(255,100,100,.2)", color:"#ffaaaa", border:"none", borderRadius:7, padding:"6px 10px", cursor:"pointer", fontSize:12, fontWeight:600 }}>Exit</button>
        </div>
      </div>

      {isMobile&&menuOpen&&(
        <div style={{ background:"#1e3060", position:"sticky", top:54, zIndex:99, padding:"8px 12px", display:"flex", flexDirection:"column", gap:4 }}>
          {navItems.map(n=>(
            <button key={n.id} onClick={()=>goTo(n.id)} style={{ background:page===n.id?"rgba(0,201,167,.15)":"transparent", color:page===n.id?C.teal:"rgba(255,255,255,.8)", border:"none", borderRadius:8, padding:"11px 14px", cursor:"pointer", fontSize:14, fontWeight:700, textAlign:"left" }}>
              {n.icon} {n.label}
            </button>
          ))}
        </div>
      )}

      <div style={{ padding:isMobile?"14px":"24px 28px", maxWidth:1200, margin:"0 auto" }}>
        {loading?(
          <div style={{ textAlign:"center", padding:"80px 20px" }}>
            <div style={{ fontSize:32, marginBottom:12 }}>⏳</div>
            <div style={{ color:C.muted, fontSize:14 }}>Loading leads from Google Sheet...</div>
          </div>
        ):(
          <>
            {page!=="new"&&<h1 style={{ margin:"0 0 16px", fontSize:isMobile?17:20, color:C.navy, fontWeight:800 }}>{navItems.find(n=>n.id===page)?.label} <span style={{ fontSize:13, color:C.muted, fontWeight:400 }}>({leads.length} leads)</span></h1>}
            {page==="dashboard"&&<Dashboard leads={leads}/>}
            {page==="leads"&&<LeadsList leads={leads} onSelect={setSelectedLead}/>}
            {page==="new"&&<NewLeadForm leads={leads} onSave={handleSave} onCancel={()=>setPage("leads")} currentUser={currentUser}/>}
          </>
        )}
      </div>

      {selectedLead&&<LeadModal lead={selectedLead} onClose={()=>setSelectedLead(null)}/>}
    </div>
  );
}
