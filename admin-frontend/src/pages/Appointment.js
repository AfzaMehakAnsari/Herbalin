import { useState, useEffect, useRef } from "react";
import { useNavigate, Link } from "react-router-dom";
import { FaArrowLeft } from "react-icons/fa";
import {
  FiEye, FiX, FiSend, FiTrash2,
  FiCheckCircle, FiAlertCircle, FiSearch,
  FiChevronDown, FiCalendar
} from "react-icons/fi";
import Sidebar from "../components/Sidebar";

// ── Date helper ──
function isPast(dateStr) {
  if (!dateStr) return false;
  const apptDate = new Date(dateStr + "T00:00:00");
  const today    = new Date();
  today.setHours(0, 0, 0, 0);
  return apptDate < today;
}

// ── Effective status ──
function effectiveStatus(appt) {
  if (["completed", "cancelled", "missed"].includes(appt.status)) return appt.status;
  if (isPast(appt.date)) return "missed";
  return appt.status;
}

// ── STATUS config ──
const STATUS = {
  pending:   { label: "Pending",   bg: "#FEF9EC", color: "#7A5700", border: "#DDB84A", dot: "#DDB84A" },
  confirmed: { label: "Confirmed", bg: "#EEF4FF", color: "#1E40AF", border: "#93C5FD", dot: "#93C5FD" },
  completed: { label: "Completed", bg: "#EDFAF3", color: "#155E35", border: "#3BB06B", dot: "#3BB06B" },
  cancelled: { label: "Cancelled", bg: "#F5F5F5", color: "#555",    border: "#BBB",    dot: "#999"    },
  missed:    { label: "Missed",    bg: "#FFF1F1", color: "#991B1B", border: "#FCA5A5", dot: "#F87171" },
};

function StatusBadge({ status }) {
  const c = STATUS[status] || STATUS.pending;
  return (
    <span style={{ display:"inline-flex", alignItems:"center", gap:5,
      padding:"3px 10px", borderRadius:99, fontSize:11, fontWeight:600,
      border:`1px solid ${c.border}`, background:c.bg, color:c.color }}>
      <span style={{ width:6, height:6, borderRadius:"50%", background:c.dot, display:"inline-block" }}/>
      {c.label}
    </span>
  );
}

function ActionDropdown({ appt, emailSent, onComplete, onCancel, onEmail, onDelete, onView }) {
  const [open, setOpen] = useState(false);
  const ref = useRef(null);
  const es  = emailSent.includes(appt._id);
  const eff = effectiveStatus(appt);
  const isDone = ["completed", "cancelled", "missed"].includes(eff);

  useEffect(() => {
    const handler = (e) => { if (ref.current && !ref.current.contains(e.target)) setOpen(false); };
    document.addEventListener("mousedown", handler);
    return () => document.removeEventListener("mousedown", handler);
  }, []);

  const btn = (label, icon, onClick, disabled = false, variant = "default") => {
    const styles = {
      default: { background:"#fff",    color:"#444",    border:"1px solid #E0E0E0" },
      green:   { background:"#EDFAF3", color:"#155E35", border:"1px solid #3BB06B" },
      grey:    { background:"#F5F5F5", color:"#666",    border:"1px solid #CCC"    },
      red:     { background:"#FFF1F1", color:"#991B1B", border:"1px solid #FCA5A5" },
    };
    const st = styles[variant];
    return (
      <button
        onClick={() => { if (!disabled) { onClick(); setOpen(false); } }}
        disabled={disabled}
        style={{ width:"100%", display:"flex", alignItems:"center", gap:9, padding:"8px 12px",
          fontSize:12, fontWeight:500, cursor:disabled?"not-allowed":"pointer",
          borderRadius:7, border:st.border, background:st.background, color:st.color,
          opacity:disabled?0.4:1 }}
        onMouseEnter={e => { if(!disabled) e.currentTarget.style.filter = "brightness(0.95)"; }}
        onMouseLeave={e => { if(!disabled) e.currentTarget.style.filter = "none"; }}
      >
        {icon} {label}
      </button>
    );
  };

  return (
    <div ref={ref} style={{ position:"relative", display:"inline-block" }}>
      <button
        onClick={() => setOpen(!open)}
        style={{ display:"flex", alignItems:"center", gap:6, padding:"7px 14px",
          fontSize:12, fontWeight:600, borderRadius:8, cursor:"pointer",
          background: open ? "#1B5E44" : "#fff",
          color: open ? "#fff" : "#1B5E44",
          border:"1px solid #1B5E44", transition:"all 0.15s" }}>
        Actions
        <FiChevronDown size={13} style={{ transition:"transform 0.2s", transform: open?"rotate(180deg)":"rotate(0deg)" }}/>
      </button>

      {open && (
        <div style={{ position:"absolute", right:0, top:"calc(100% + 6px)", zIndex:100,
          background:"#fff", border:"1px solid #E8E8E8", borderRadius:10,
          boxShadow:"0 8px 24px rgba(0,0,0,0.10)", padding:6, minWidth:210,
          display:"flex", flexDirection:"column", gap:4 }}>

          {btn("View Details", <FiEye size={13}/>, () => onView(appt), false, "default")}

          {/* Complete — sirf tab jab done na ho */}
          {!isDone && btn("Mark as Complete", <FiCheckCircle size={13}/>, () => onComplete(appt._id), false, "green")}

          {/* Email — sirf tab jab completed/cancelled/missed na ho */}
          {eff !== "completed" && eff !== "cancelled" && eff !== "missed" && btn(
            es ? "Email Sent" : "Send Email",
            es ? <FiCheckCircle size={13}/> : <FiSend size={13}/>,
            () => onEmail(appt._id),
            es,
            es ? "green" : "default"
          )}

          {/* Cancel — sirf tab jab done na ho */}
          {!isDone && btn("Cancel", <FiX size={13}/>, () => onCancel(appt._id), false, "grey")}

          {btn("Delete", <FiTrash2 size={13}/>, () => onDelete(appt._id), false, "red")}
        </div>
      )}
    </div>
  );
}

function Modal({ appt, emailSent, onClose, onComplete, onCancel, onEmail, sending }) {
  if (!appt) return null;
  const es  = emailSent.includes(appt._id);
  const eff = effectiveStatus(appt);
  const isDone = ["completed", "cancelled", "missed"].includes(eff);

  return (
    <div onClick={e => e.target===e.currentTarget && onClose()}
      style={{ position:"fixed", inset:0, background:"rgba(0,0,0,0.35)", zIndex:200,
        display:"flex", alignItems:"center", justifyContent:"center", padding:16 }}>
      <div style={{ background:"#fff", borderRadius:16, width:"100%", maxWidth:400,
        boxShadow:"0 24px 64px rgba(0,0,0,0.18)", overflow:"hidden" }}>

        {/* Header */}
        <div style={{
          background: eff==="missed" ? "#991B1B" : eff==="completed" ? "#155E35" : "#1B5E44",
          padding:"18px 22px", display:"flex", alignItems:"center", justifyContent:"space-between" }}>
          <div>
            <div style={{ color:"#fff", fontWeight:700, fontSize:16 }}>{appt.firstName} {appt.lastName}</div>
            <div style={{ color:"rgba(255,255,255,0.6)", fontSize:12, marginTop:2 }}>Appointment Details</div>
          </div>
          <button onClick={onClose} style={{ background:"rgba(255,255,255,0.15)", border:"none",
            borderRadius:8, width:30, height:30, cursor:"pointer", color:"#fff",
            display:"flex", alignItems:"center", justifyContent:"center" }}>
            <FiX size={15}/>
          </button>
        </div>

        {/* Details */}
        <div style={{ padding:"18px 22px", display:"flex", flexDirection:"column", gap:10 }}>
          {[
            { lbl:"Email",   val:appt.email },
            { lbl:"Contact", val:appt.contact },
            { lbl:"Date",    val:`${appt.day}, ${appt.date}` },
            { lbl:"Time",    val:appt.time },
          ].map(r => (
            <div key={r.lbl} style={{ display:"flex", justifyContent:"space-between",
              alignItems:"center", padding:"9px 14px", background:"#F7F9F8", borderRadius:9 }}>
              <span style={{ fontSize:12, color:"#888", fontWeight:500 }}>{r.lbl}</span>
              <span style={{ fontSize:12, fontWeight:600, color:"#222" }}>{r.val}</span>
            </div>
          ))}
          <div style={{ display:"flex", justifyContent:"space-between", alignItems:"center", padding:"4px 2px" }}>
            <span style={{ fontSize:12, color:"#888" }}>Status</span>
            <StatusBadge status={eff}/>
          </div>
        </div>

        {/* Actions */}
        <div style={{ padding:"0 22px 20px", display:"flex", flexDirection:"column", gap:8 }}>

          {/* Complete + Cancel — sirf jab active ho */}
          {!isDone && (
            <div style={{ display:"grid", gridTemplateColumns:"1fr 1fr", gap:8 }}>
              <button onClick={() => onComplete(appt._id)}
                style={{ padding:10, borderRadius:9, fontSize:13, fontWeight:600, cursor:"pointer",
                  background:"#1B5E44", color:"#fff", border:"none",
                  display:"flex", alignItems:"center", justifyContent:"center", gap:6 }}>
                <FiCheckCircle size={13}/> Complete
              </button>
              <button onClick={() => onCancel(appt._id)}
                style={{ padding:10, borderRadius:9, fontSize:13, fontWeight:600, cursor:"pointer",
                  background:"#F5F5F5", color:"#555", border:"1px solid #CCC",
                  display:"flex", alignItems:"center", justifyContent:"center", gap:6 }}>
                <FiX size={13}/> Cancel
              </button>
            </div>
          )}

          {/* Email — sirf jab completed/cancelled/missed na ho */}
          {eff !== "completed" && eff !== "cancelled" && eff !== "missed" && (
            <button onClick={() => onEmail(appt._id)}
              disabled={es || sending}
              style={{ padding:10, borderRadius:9, fontSize:13, fontWeight:600,
                cursor: es||sending ? "not-allowed" : "pointer",
                background: es ? "#EDFAF3" : "#fff",
                color:      es ? "#155E35" : "#1B5E44",
                border:     `1px solid ${es ? "#3BB06B" : "#1B5E44"}`,
                display:"flex", alignItems:"center", justifyContent:"center", gap:6,
                opacity: sending ? 0.6 : 1 }}>
              {es ? <FiCheckCircle size={13}/> : <FiSend size={13}/>}
              {es ? "Email Sent!" : sending ? "Sending…" : "Send Confirmation Email"}
            </button>
          )}
        </div>
      </div>
    </div>
  );
}

function Toast({ toasts }) {
  return (
    <div style={{ position:"fixed", bottom:24, right:24, zIndex:999,
      display:"flex", flexDirection:"column", gap:8, pointerEvents:"none" }}>
      {toasts.map(t => (
        <div key={t.id} style={{ display:"flex", alignItems:"center", gap:9,
          padding:"11px 16px", borderRadius:10, fontSize:13, fontWeight:500,
          minWidth:260, boxShadow:"0 4px 20px rgba(0,0,0,0.12)",
          background: t.type==="s" ? "#1B5E44" : "#991B1B", color:"#fff" }}>
          {t.type==="s" ? <FiCheckCircle size={15}/> : <FiAlertCircle size={15}/>}
          {t.msg}
        </div>
      ))}
    </div>
  );
}

function StatCard({ label, value, accent, sub }) {
  return (
    <div style={{ background:"#fff", borderRadius:12, padding:"16px 20px",
      border:"1px solid #EBEBEB", borderLeft:`4px solid ${accent}` }}>
      <div style={{ fontSize:26, fontWeight:700, color:"#111" }}>{value}</div>
      <div style={{ fontSize:12, color:"#888", marginTop:4 }}>{label}</div>
      {sub && <div style={{ fontSize:11, color:accent, marginTop:3, fontWeight:600 }}>{sub}</div>}
    </div>
  );
}

export default function AdminAppointments() {
  const [appts, setAppts]               = useState([]);
  const [loading, setLoading]           = useState(true);
  const [search, setSearch]             = useState("");
  const [statusFilter, setStatusFilter] = useState("all");
  const [modal, setModal]               = useState(null);
  const [emailSent, setEmailSent]       = useState([]);
  const [sendingEmail, setSendingEmail] = useState(false);
  const [toasts, setToasts]             = useState([]);

  const toast = (msg, type = "s") => {
    const id = Date.now();
    setToasts(p => [...p, { id, msg, type }]);
    setTimeout(() => setToasts(p => p.filter(t => t.id !== id)), 4000);
  };

  const fetchAppointments = async () => {
    setLoading(true);
    try {
      const res  = await fetch("http://localhost:5000/api/admin/appointments");
      const data = await res.json();
      if (data.success) setAppts(data.appointments);
      else toast("Failed to load appointments", "e");
    } catch {
      toast("Could not connect to server", "e");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => { fetchAppointments(); }, []);

  const updateStatus = (_id, status) => {
    setAppts(prev => prev.map(a => a._id === _id ? { ...a, status } : a));
    setModal(m => m && m._id === _id ? { ...m, status } : m);
  };

  const handleComplete = async (_id) => {
    try {
      const res  = await fetch(`http://localhost:5000/api/admin/appointments/${_id}/complete`, { method:"PATCH" });
      const data = await res.json();
      if (data.success) { updateStatus(_id, "completed"); toast("Appointment marked as completed ✓"); }
      else toast("Failed to complete", "e");
    } catch { toast("Server error", "e"); }
  };

  const handleCancel = async (_id) => {
    try {
      const res  = await fetch(`http://localhost:5000/api/admin/appointments/${_id}/cancel`, { method:"PATCH" });
      const data = await res.json();
      if (data.success) { updateStatus(_id, "cancelled"); toast("Appointment cancelled", "e"); }
      else toast("Failed to cancel", "e");
    } catch { toast("Server error", "e"); }
  };

  const handleDelete = async (_id) => {
    try {
      const res  = await fetch(`http://localhost:5000/api/admin/appointments/${_id}`, { method:"DELETE" });
      const data = await res.json();
      if (data.success) {
        setAppts(prev => prev.filter(a => a._id !== _id));
        if (modal?._id === _id) setModal(null);
        toast("Appointment deleted");
      } else toast("Failed to delete", "e");
    } catch { toast("Server error", "e"); }
  };

  const handleEmail = async (_id) => {
    if (emailSent.includes(_id)) return;
    const a = appts.find(x => x._id === _id);
    if (!a) return;
    const eff = effectiveStatus(a);
    if (["cancelled", "missed", "completed"].includes(eff)) return;
    setSendingEmail(true);
    try {
      const res  = await fetch(`http://localhost:5000/api/admin/appointments/${_id}/send-email`, { method:"POST" });
      const data = await res.json();
      if (data.success) {
        setEmailSent(p => [...p, _id]);
        toast(`Confirmation email sent to ${a.email}`);
      } else toast("Failed to send email", "e");
    } catch { toast("Email send failed", "e"); }
    finally { setSendingEmail(false); }
  };

  const withEffective = appts.map(a => ({ ...a, _eff: effectiveStatus(a) }));

  const filtered = withEffective.filter(a => {
    const q = search.toLowerCase();
    const matchQ = !q ||
      `${a.firstName} ${a.lastName}`.toLowerCase().includes(q) ||
      a.email.toLowerCase().includes(q) ||
      a.contact.includes(q) ||
      a.date.includes(q);
    const matchS = statusFilter === "all" || a._eff === statusFilter;
    return matchQ && matchS;
  });

  const counts = {
    total:     appts.length,
    pending:   withEffective.filter(a => a._eff === "pending").length,
    confirmed: withEffective.filter(a => a._eff === "confirmed").length,
    completed: withEffective.filter(a => a._eff === "completed").length,
    cancelled: withEffective.filter(a => a._eff === "cancelled").length,
    missed:    withEffective.filter(a => a._eff === "missed").length,
  };

  const stats = [
    { label:"Total",     value: counts.total,     accent:"#1B5E44" },
    { label:"Pending",   value: counts.pending,   accent:"#DDB84A" },
    { label:"Confirmed", value: counts.confirmed, accent:"#93C5FD" },
    { label:"Completed", value: counts.completed, accent:"#3BB06B" },
    { label:"Cancelled", value: counts.cancelled, accent:"#BBBBBB" },
    { label:"Missed",    value: counts.missed,    accent:"#F87171", sub: counts.missed > 0 ? "Needs attention" : "" },
  ];

  const inp = {
    padding:"8px 12px", fontSize:13, border:"1px solid #E0E0E0", borderRadius:8,
    background:"#fff", color:"#333", outline:"none", fontFamily:"inherit",
  };

  return (
    <div style={{ display:"flex", minHeight:"100vh", background:"#F4F6F5", fontFamily:"'DM Sans',system-ui,sans-serif" }}>

      {/* ← Tumhara existing Sidebar directly render ho raha hai */}
      <Sidebar />

      <div style={{ marginLeft:256, flex:1, padding:"2rem 2rem 3rem" }}>
<Link
  to="/"
  className="inline-flex items-center gap-3 text-sm font-semibold text-gray-600 mb-4 transition-all duration-200 hover:text-[#1B5E44] group"
>
  <FaArrowLeft className="text-base transition-transform duration-200 group-hover:-translate-x-1" />

  <span>
    Back to Dashboard
  </span>
</Link>
        {/* Top bar */}
        <div style={{ marginBottom:"1.75rem" }}>
          <h1 style={{ fontSize:20, fontWeight:700, color:"#111", margin:0 }}>Appointments</h1>
          <p style={{ fontSize:13, color:"#888", marginTop:4 }}>Dr. Hafsa Abbasi · Admin Panel</p>
        </div>

        {/* Missed alert banner */}
        {counts.missed > 0 && (
          <div style={{ display:"flex", alignItems:"center", gap:12, marginBottom:"1.25rem",
            background:"#FFF1F1", border:"1px solid #FCA5A5", borderRadius:12, padding:"13px 18px" }}>
            <div style={{ width:36, height:36, borderRadius:"50%", background:"#FEE2E2",
              display:"flex", alignItems:"center", justifyContent:"center", flexShrink:0 }}>
              <FiCalendar size={16} color="#991B1B"/>
            </div>
            <div style={{ flex:1 }}>
              <div style={{ fontSize:13, fontWeight:700, color:"#991B1B" }}>
                {counts.missed} Missed Appointment{counts.missed > 1 ? "s" : ""}
              </div>
              <div style={{ fontSize:12, color:"#B91C1C", marginTop:2 }}>
                These appointments were not completed before their scheduled date.
              </div>
            </div>
            <button onClick={() => setStatusFilter("missed")}
              style={{ padding:"7px 14px", borderRadius:8, fontSize:12, fontWeight:600,
                background:"#991B1B", color:"#fff", border:"none", cursor:"pointer", whiteSpace:"nowrap" }}>
              View Missed
            </button>
          </div>
        )}

        {/* Stats */}
        <div style={{ display:"grid", gridTemplateColumns:"repeat(auto-fit,minmax(140px,1fr))", gap:14, marginBottom:"1.75rem" }}>
          {stats.map(s => <StatCard key={s.label} {...s}/>)}
        </div>

        {/* Filters */}
        <div style={{ display:"flex", gap:10, marginBottom:14, flexWrap:"wrap" }}>
          <div style={{ position:"relative", flex:1, minWidth:200 }}>
            <FiSearch size={13} style={{ position:"absolute", left:11, top:"50%", transform:"translateY(-50%)", color:"#AAA" }}/>
            <input
              style={{ ...inp, width:"100%", paddingLeft:32, boxSizing:"border-box" }}
              placeholder="Search name, email, contact…"
              value={search}
              onChange={e => setSearch(e.target.value)}
            />
          </div>
          <select style={{ ...inp, cursor:"pointer", minWidth:150 }}
            value={statusFilter} onChange={e => setStatusFilter(e.target.value)}>
            <option value="all">All Status</option>
            <option value="pending">Pending</option>
            <option value="confirmed">Confirmed</option>
            <option value="completed">Completed</option>
            <option value="cancelled">Cancelled</option>
            <option value="missed">Missed</option>
          </select>
        </div>

        {/* Table */}
        <div style={{ background:"#fff", border:"1px solid #EBEBEB", borderRadius:14, overflow:"hidden" }}>
          <div style={{ overflowX:"auto" }}>
            <table style={{ width:"100%", borderCollapse:"collapse", fontSize:13, minWidth:700 }}>
              <thead>
                <tr style={{ background:"#F7F8F7", borderBottom:"1px solid #EBEBEB" }}>
                  {["Patient","Contact","Date & Time","Status","Actions"].map(h => (
                    <th key={h} style={{ textAlign:"left", padding:"11px 16px",
                      fontSize:11, fontWeight:700, color:"#888",
                      textTransform:"uppercase", letterSpacing:"0.07em" }}>{h}</th>
                  ))}
                </tr>
              </thead>
              <tbody>
                {loading ? (
                  <tr><td colSpan={5} style={{ textAlign:"center", padding:"3rem", color:"#AAA", fontSize:14 }}>
                    Loading appointments…
                  </td></tr>
                ) : filtered.length === 0 ? (
                  <tr><td colSpan={5} style={{ textAlign:"center", padding:"3rem", color:"#BBB", fontSize:14 }}>
                    No appointments found
                  </td></tr>
                ) : filtered.map((a, i) => (
                  <tr key={a._id} style={{
                    borderBottom: i < filtered.length-1 ? "1px solid #F2F2F2" : "none",
                    background: a._eff === "missed" ? "#FFFAFA" : "transparent",
                  }}>
                    <td style={{ padding:"13px 16px" }}>
                      <div style={{ display:"flex", alignItems:"center", gap:10 }}>
                        <div style={{ width:34, height:34, borderRadius:"50%",
                          background: a._eff==="missed" ? "#FEE2E2" : a._eff==="completed" ? "#EDFAF3" : "#E6F4EE",
                          color: a._eff==="missed" ? "#991B1B" : "#1B5E44",
                          fontSize:12, fontWeight:700,
                          display:"flex", alignItems:"center", justifyContent:"center", flexShrink:0 }}>
                          {a.firstName?.[0]}{a.lastName?.[0]}
                        </div>
                        <div>
                          <div style={{ fontWeight:600, color:"#111" }}>{a.firstName} {a.lastName}</div>
                          <div style={{ fontSize:11, color:"#999", marginTop:1 }}>{a.email}</div>
                        </div>
                      </div>
                    </td>
                    <td style={{ padding:"13px 16px", color:"#444", fontWeight:500 }}>{a.contact}</td>
                    <td style={{ padding:"13px 16px" }}>
                      <div style={{ fontWeight:600, color: a._eff==="missed" ? "#991B1B" : "#222" }}>
                        {a.day}, {a.date}
                      </div>
                      <div style={{ fontSize:11, color:"#999", marginTop:2 }}>{a.time}</div>
                    </td>
                    <td style={{ padding:"13px 16px" }}>
                      <StatusBadge status={a._eff}/>
                    </td>
                    <td style={{ padding:"13px 16px" }}>
                      <ActionDropdown
                        appt={a}
                        emailSent={emailSent}
                        onView={() => setModal(a)}
                        onComplete={handleComplete}
                        onCancel={handleCancel}
                        onEmail={handleEmail}
                        onDelete={handleDelete}
                      />
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>

          {/* Table footer */}
          <div style={{ padding:"10px 16px", borderTop:"1px solid #F2F2F2",
            display:"flex", alignItems:"center", justifyContent:"space-between", flexWrap:"wrap", gap:8 }}>
            <span style={{ fontSize:12, color:"#AAA" }}>
              Showing <b style={{color:"#555"}}>{filtered.length}</b> of <b style={{color:"#555"}}>{appts.length}</b> appointments
            </span>
            <div style={{ display:"flex", gap:6, flexWrap:"wrap" }}>
              {["pending","confirmed","completed","cancelled","missed"].map(st => <StatusBadge key={st} status={st}/>)}
            </div>
          </div>
        </div>
      </div>

      <Modal
        appt={modal}
        emailSent={emailSent}
        sending={sendingEmail}
        onClose={() => setModal(null)}
        onComplete={handleComplete}
        onCancel={handleCancel}
        onEmail={handleEmail}
      />

      <Toast toasts={toasts}/>
    </div>
  );
}