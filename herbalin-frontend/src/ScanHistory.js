import { useEffect, useState, useRef } from "react";
import { FaPlus, FaSignOutAlt, FaTrash, FaBars, FaEllipsisH, FaLayerGroup, FaFilePdf, FaEnvelope } from "react-icons/fa";
import { useNavigate } from "react-router-dom";
import { Pie } from "react-chartjs-2";
import logo from "./assets/herbalin_logo.png";
import { Chart as ChartJS, ArcElement, Tooltip } from "chart.js";
import { generateFullTreatmentReport, getFullReportBase64 } from "./Generatereport";
ChartJS.register(ArcElement, Tooltip);

/* ── helpers ── */
function detectType(items) {
  if (!items || items.length === 0) return "remedy";
  const precautionKeywords = ["apply","do not","don't","refrain","prevent","stay away","limit","reduce","stop","never","caution","warning","excessive","cold","chilled","humid","scratch"];
  const combined = items.join(" ").toLowerCase();
  const hits = precautionKeywords.filter(k => combined.includes(k)).length;
  return hits >= 2 ? "remedy" : "precaution";
}
const getSeverityPercent = s => ({ Mild:25, Moderate:60, Severe:90, Normal:100 }[s] || 0);
const getSeverityColor   = s => ({ Mild:"text-green-600", Moderate:"text-yellow-500", Severe:"text-red-600", Normal:"text-green-600" }[s] || "text-gray-600");
const getSeverityMeaning = s => ({ Mild:"Low risk condition requiring minor care.", Moderate:"Needs proper monitoring and treatment.", Severe:"Immediate dermatologist attention required.", Normal:"No skin issue detected." }[s] || "");
const getSeverityChart   = s => {
  const pct = getSeverityPercent(s);
  return { datasets:[{ data:[pct,100-pct], backgroundColor:[s==="Mild"?"#22c55e":s==="Moderate"?"#facc15":s==="Severe"?"#ef4444":"#22c55e","#e5e7eb"], borderWidth:0 }] };
};
const getLayerText = layer => {
  if (!layer) return "—";
  const l = String(layer).toLowerCase();
  if (l.includes("epidermis")||l==="1") return "Epidermis (1st Layer)";
  if (l.includes("dermis")||l==="2")    return "Dermis (2nd Layer)";
  if (l.includes("subcutaneous")||l==="3") return "Subcutaneous (3rd Layer)";
  return layer;
};
const getLayerMeaning = layer => {
  if (!layer) return "";
  const l = String(layer).toLowerCase();
  if (l.includes("epidermis")||l==="1") return "This condition affects the outermost skin layer.";
  if (l.includes("dermis")||l==="2")    return "This condition affects deeper skin structure.";
  if (l.includes("subcutaneous")||l==="3") return "This condition affects the deepest fat layer.";
  return "Skin layer information not clearly available.";
};
const getTemperamentMeaning = t => {
  if (!t) return "";
  const tl = t.toLowerCase();
  if (tl.includes("sanguine")||tl.includes("dam"))      return "Warm & moist nature. Active, social, and optimistic temperament.";
  if (tl.includes("choleric")||tl.includes("safra"))    return "Warm & dry nature. Energetic, assertive, and quick-tempered.";
  if (tl.includes("melancholic")||tl.includes("sauda")) return "Cold & dry nature. Thoughtful, analytical, and sensitive.";
  if (tl.includes("phlegmatic")||tl.includes("balgham"))return "Cold & moist nature. Calm, steady, and slow to react.";
  return "Unani body constitution type affecting treatment response.";
};

export default function ScanHistory() {
  const [history, setHistory]                 = useState([]);
  const [selected, setSelected]               = useState(null);
  const [showProfileMenu, setShowProfileMenu] = useState(false);
  const [search, setSearch]                   = useState("");
  const [sidebarOpen, setSidebarOpen]         = useState(true);
  const [menuOpen, setMenuOpen]               = useState(null);
  const [mounted, setMounted]                 = useState(false);
  const [scanActions, setScanActions]         = useState({});
  // toast: { id, message, type: "success"|"error"|"info" }
  const [toasts, setToasts]                   = useState([]);

  const navigate     = useNavigate();
  const profileRef   = useRef();
  const mainPanelRef = useRef();

  const storedUser = localStorage.getItem("user");
  const user       = storedUser ? JSON.parse(storedUser) : null;

  /* ── toast helper ── */
  const showToast = (message, type = "info") => {
    const id = Date.now();
    setToasts(prev => [...prev, { id, message, type }]);
    setTimeout(() => setToasts(prev => prev.filter(t => t.id !== id)), 3500);
  };

  /* ── delete confirm state ── */
  const [confirmDelete, setConfirmDelete] = useState(null); // scanId to delete

  const setScanAction = (id, patch) =>
    setScanActions(prev => ({ ...prev, [id]: { ...prev[id], ...patch } }));

  const buildReportParams = (item) => ({
    userName:    user?.name  || "Patient",
    disease:     item.disease,
    severity:    item.severity,
    layer:       item.layer,
    temperament: item.temperament,
    date:        new Date(item.createdAt).toLocaleDateString("en-PK", { year:"numeric", month:"long", day:"numeric" }),
    remedies:    item.remedies,
  });

  const handleDownloadScan = (item) => {
    setScanAction(item._id, { downloading: true });
    try {
      generateFullTreatmentReport(buildReportParams(item));
      showToast("PDF downloaded successfully!", "success");
    } catch (e) {
      console.error(e);
      showToast("Failed to generate PDF.", "error");
    } finally {
      setScanAction(item._id, { downloading: false });
      setMenuOpen(null);
    }
  };

  const handleEmailScan = async (item) => {
    const toEmail = user?.email;
    if (!toEmail) { showToast("No email found. Please log in again.", "error"); return; }
    setScanAction(item._id, { sending: true });
    setMenuOpen(null);
    try {
      const base64 = getFullReportBase64(buildReportParams(item));
      const res = await fetch("http://localhost:5000/api/send-report", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          toEmail,
          userName:  user?.name || "Patient",
          disease:   item.disease,
          severity:  item.severity,
          layer:     item.layer,
          pdfBase64: base64,
        }),
      });
      if (res.ok) {
        setScanAction(item._id, { sending: false, sent: true });
        showToast("Report sent to your email!", "success");
      } else {
        setScanAction(item._id, { sending: false });
        showToast("Failed to send email. Try again.", "error");
      }
    } catch (e) {
      console.error(e);
      setScanAction(item._id, { sending: false });
      showToast("Error sending email.", "error");
    }
  };

  useEffect(() => { if (!user) { navigate("/"); return; } fetchHistory(); }, [navigate]);

  useEffect(() => {
    if (selected) {
      setMounted(false);
      // scroll main panel back to top whenever a new scan is selected
      if (mainPanelRef.current) mainPanelRef.current.scrollTop = 0;
      const t = setTimeout(() => setMounted(true), 50);
      return () => clearTimeout(t);
    }
  }, [selected?._id]);

  const fetchHistory = async () => {
    try {
      const res  = await fetch(`http://localhost:5000/api/analysis/user/${user.id}`);
      const data = await res.json();
      if (res.ok) setHistory(data.data);
    } catch(e) { console.error(e); }
  };

  const handleLogout = () => { localStorage.removeItem("user"); navigate("/"); };

  const deleteScan = async id => {
    try {
      const res = await fetch(`http://localhost:5000/api/analysis/${id}`, { method:"DELETE" });
      if (res.ok) {
        setHistory(prev => prev.filter(i => i._id !== id));
        if (selected?._id === id) setSelected(null);
        showToast("Scan deleted.", "success");
      } else {
        showToast("Delete failed. Try again.", "error");
      }
    } catch {
      showToast("Server error while deleting.", "error");
    } finally {
      setConfirmDelete(null);
    }
  };

  const filteredHistory = history.filter(item =>
    item.disease.toLowerCase().includes(search.toLowerCase())
  );

  // Close profile menu on outside click
  useEffect(() => {
    const handler = e => {
      if (profileRef.current && !profileRef.current.contains(e.target)) {
        setShowProfileMenu(false);
      }
    };
    document.addEventListener("mousedown", handler);
    return () => document.removeEventListener("mousedown", handler);
  }, []);

  /* remedy / diet */
  const firstPlan   = selected?.remedies?.[0];
  const remedyItems = firstPlan
    ? [1,2,3,4,5].map(n => firstPlan[`Remedy/Precaution(${n})`]).filter(Boolean)
    : [];
  const isRemedy = detectType(remedyItems) === "remedy";
  const dietRows = firstPlan
    ? [
        { label:"Breakfast",      key:"Diet(Breakfast)" },
        { label:"Lunch & Dinner", key:"Diet(Lunch and Dinner)" },
        { label:"Fruits",         key:"Diet(Fruits)" },
        { label:"Salad",          key:"Diet(Salad)" },
        { label:"Drinks",         key:"Diet(Drinks)" },
        { label:"Qahwa",          key:"Diet(Qahwa)" },
        { label:"Spices",         key:"Diet(Spices)" },
      ].filter(({ key }) => firstPlan[key])
    : [];

  const fullParagraph =
    selected?.disease === "Acne"
      ? "Acne is a common skin condition that occurs when hair follicles become clogged with oil, dead skin cells, and bacteria. It can cause a variety of blemishes, including pimples, blackheads, whiteheads, and sometimes painful cysts or nodules. Proper skincare, topical treatments, and medical guidance can help reduce flare-ups and prevent scarring."
      : selected?.disease === "Eczema"
      ? "Eczema is a chronic skin condition that causes red, itchy, and inflamed patches of skin. It can appear on various parts of the body and may flare up periodically, often triggered by allergens, irritants, or stress. Consulting a dermatologist can help in controlling symptoms and preventing complications."
      : "";

  return (
    /* ROOT: use 100dvh via style to guarantee full viewport even if a parent navbar exists */
    <div
      className="flex bg-gray-100 overflow-hidden"
      style={{ height: "100dvh", maxHeight: "100dvh" }}
    >

      {/* mobile hamburger */}
      <div className="md:hidden fixed top-4 left-4 z-50">
        <button
          onClick={() => setSidebarOpen(!sidebarOpen)}
          className="text-xl text-gray-700 bg-white shadow-md rounded-lg p-2"
        >
          <FaBars />
        </button>
      </div>

      {/* mobile backdrop */}
      {sidebarOpen && (
        <div
          className="md:hidden fixed inset-0 bg-black/30 z-30"
          onClick={() => setSidebarOpen(false)}
        />
      )}

      {/* ══════════════════════════════════════
          SIDEBAR
          Flex column:
            [header]  — flex-shrink-0, no scroll
            [list]    — flex-1, overflow-y-auto   ← only this scrolls
            [footer]  — flex-shrink-0, no scroll
      ══════════════════════════════════════ */}
      <div
        className={`
          fixed md:relative z-40 w-72 bg-white
          flex flex-col
          transform transition-transform duration-300
          ${sidebarOpen ? "translate-x-0" : "-translate-x-full"} md:translate-x-0
        `}
        style={{ height:"100dvh", boxShadow:"2px 0 16px rgba(0,0,0,0.07)" }}
      >
        {/* ── HEADER (never scrolls) ─────────────────── */}
        <div className="flex-shrink-0 px-5 pt-4 pb-3 flex flex-col gap-3">
          <div className="flex justify-center items-center border-b border-gray-100 pb-3">
            <img
              src={logo}
              alt="logo"
              className="w-40 mx-auto cursor-pointer hover:opacity-80 transition-opacity"
              onClick={() => navigate("/")}
              title="Go to Home"
            />
          </div>

          <div
            onClick={() => navigate("/scan")}
            className="flex items-center justify-center gap-2 p-3 rounded-lg cursor-pointer font-semibold text-[#1B5E44] border border-[#1B5E44] hover:bg-[#e6f4ef] transition text-sm"
          >
            <FaPlus size={11} /> New Scan
          </div>

          <input
            type="text"
            placeholder="Search scans..."
            className="w-full p-2 rounded-lg border border-gray-300 focus:outline-none focus:ring-2 focus:ring-[#1B5E44] text-sm"
            onChange={e => setSearch(e.target.value)}
          />

          <hr className="border-gray-200" />
          <p className="text-gray-400 font-semibold text-xs uppercase tracking-widest">Your Scans</p>
        </div>

        {/* ── LIST (scrolls independently) ────────────── */}
        <div className="flex-1 min-h-0 overflow-y-auto px-5 pb-3 space-y-1.5">
          {filteredHistory.length === 0 ? (
            <p className="text-gray-400 text-sm px-2">No scans found</p>
          ) : filteredHistory.map(item => (
            <div
              key={item._id}
              className={`
                p-2.5 rounded-lg cursor-pointer hover:bg-gray-50 transition
                flex justify-between items-center relative
                ${selected?._id === item._id
                  ? "bg-[#e6f4ef] border-l-4 border-[#1B5E44]"
                  : "bg-white shadow-sm border border-gray-100"}
              `}
            >
              <div
                className="flex-1 min-w-0"
                onClick={() => {
                  setSelected(item);
                  if (window.innerWidth < 768) setSidebarOpen(false);
                }}
              >
                <p className={`truncate text-sm font-medium ${selected?._id === item._id ? "text-[#1B5E44]" : "text-gray-700"}`}>
                  {item.disease || "Scan " + item._id.slice(-4)}
                </p>
                <p className="text-xs text-gray-400 mt-0.5">
                  {new Date(item.createdAt).toLocaleDateString("en-PK",{ day:"numeric", month:"short", year:"numeric" })}
                </p>
              </div>

              <div className="relative">
                <FaEllipsisH
                  className="text-gray-400 cursor-pointer hover:text-gray-600 ml-2"
                  size={12}
                  onClick={e => { e.stopPropagation(); setMenuOpen(menuOpen === item._id ? null : item._id); }}
                />
                {menuOpen === item._id && (
                  <div className="absolute right-0 mt-2 w-44 bg-white shadow-xl rounded-xl z-20 overflow-hidden border border-gray-100">

                    {/* Download PDF */}
                    <div
                      onClick={e => { e.stopPropagation(); handleDownloadScan(item); }}
                      className="flex items-center gap-2.5 px-4 py-2.5 hover:bg-green-50 cursor-pointer text-sm text-gray-700 hover:text-[#1B5E44] transition-colors"
                    >
                      {scanActions[item._id]?.downloading
                        ? <svg className="animate-spin w-3.5 h-3.5 text-[#1B5E44]" viewBox="0 0 24 24" fill="none"><circle cx="12" cy="12" r="9" stroke="currentColor" strokeWidth="2.5" strokeDasharray="28" strokeDashoffset="10"/></svg>
                        : <FaFilePdf size={12} className="text-[#1B5E44]" />
                      }
                      {scanActions[item._id]?.downloading ? "Generating..." : "Download PDF"}
                    </div>

                    {/* Send Email */}
                    <div
                      onClick={e => { e.stopPropagation(); if (!scanActions[item._id]?.sent) handleEmailScan(item); }}
                      className={`flex items-center gap-2.5 px-4 py-2.5 text-sm transition-colors
                        ${scanActions[item._id]?.sent
                          ? "text-green-600 cursor-default bg-green-50/60"
                          : "hover:bg-sky-50 cursor-pointer text-gray-700 hover:text-sky-600"
                        }`}
                    >
                      {scanActions[item._id]?.sending
                        ? <svg className="animate-spin w-3.5 h-3.5 text-sky-500" viewBox="0 0 24 24" fill="none"><circle cx="12" cy="12" r="9" stroke="currentColor" strokeWidth="2.5" strokeDasharray="28" strokeDashoffset="10"/></svg>
                        : scanActions[item._id]?.sent
                          ? <svg width="13" height="13" viewBox="0 0 24 24" fill="none"><path d="M5 13l4 4L19 7" stroke="#16a34a" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round"/></svg>
                          : <FaEnvelope size={12} className="text-sky-500" />
                      }
                      {scanActions[item._id]?.sending ? "Sending..." : scanActions[item._id]?.sent ? "Email Sent!" : "Send via Email"}
                    </div>

                    <div className="border-t border-gray-100" />

                    {/* Delete */}
                    <div
                      onClick={e => { e.stopPropagation(); setConfirmDelete(item._id); setMenuOpen(null); }}
                      className="flex items-center gap-2.5 px-4 py-2.5 hover:bg-red-50 cursor-pointer text-red-500 text-sm transition-colors"
                    >
                      <FaTrash size={11} /> Delete
                    </div>
                  </div>
                )}
              </div>
            </div>
          ))}
        </div>

        {/* ── FOOTER (never scrolls, logout anchored here) ── */}
        {/* FIX 2: relative so logout popup positions relative to this div, not viewport */}
        <div ref={profileRef} className="flex-shrink-0 px-4 py-3 border-t border-gray-100 bg-white relative">

          {/* FIX 3: logout popup — bottom-full = floats above footer, never overlaps list */}
          {showProfileMenu && (
            <div className="absolute bottom-full left-4 mb-1 w-40 bg-white rounded-xl shadow-lg border border-gray-100 overflow-hidden z-50">
              <div
                onClick={handleLogout}
                className="flex items-center gap-2 px-4 py-3 hover:bg-gray-50 cursor-pointer text-sm text-gray-700"
              >
                <FaSignOutAlt size={12} className="text-gray-500" /> Logout
              </div>
            </div>
          )}

          <div
            onClick={() => setShowProfileMenu(!showProfileMenu)}
            className="flex items-center gap-3 cursor-pointer p-2 rounded-lg hover:bg-gray-50 transition"
          >
            <div className="bg-[#1B5E44] text-white w-9 h-9 rounded-full flex items-center justify-center font-bold text-sm flex-shrink-0">
              {user?.name?.charAt(0) || "U"}
            </div>
            <div>
              <p className="font-semibold text-[#1B5E44] text-sm">{user?.name || "User"}</p>
              <p className="text-xs text-gray-400">Member</p>
            </div>
          </div>
        </div>
      </div>

      {/* ══════════════════════════════════════
          MAIN PANEL
          FIX 4: flex-1 + overflow-y-auto — scrolls independently from sidebar
      ══════════════════════════════════════ */}
      <div
        ref={mainPanelRef}
        className="flex-1 overflow-y-auto bg-white"
        style={{ fontFamily:"'Outfit','Segoe UI',sans-serif", height:"100dvh" }}
      >
        {selected ? (
          <>
            <div className="max-w-6xl mx-auto px-4 sm:px-6 pt-5 pb-2 flex items-center justify-between gap-4 pl-14 md:pl-6">
              <div>
                <h1 className="text-xl sm:text-2xl font-bold text-[#1B5E44] leading-tight">Result</h1>
                <p className="text-xs text-gray-400 mt-0.5">Herbalin · AI Skin Care</p>
              </div>
            </div>

            <div className="max-w-6xl mx-auto px-4 sm:px-6 pb-6 space-y-5">

              {/* HERO CARD */}
              <div
                className="bg-white rounded-3xl overflow-hidden shadow-lg border border-gray-100 flex flex-col md:flex-row"
                style={{ opacity:mounted?1:0, transform:mounted?"translateY(0)":"translateY(20px)", transition:"opacity 0.5s ease, transform 0.5s ease" }}
              >
                <div className="md:w-64 lg:w-72 flex-shrink-0 relative">
                  {selected.image
                    ? <img src={selected.image} alt="Skin" className="w-full h-full object-cover" style={{ minHeight:260 }} />
                    : <div className="w-full bg-gradient-to-br from-green-50 to-emerald-100 flex items-center justify-center" style={{ minHeight:260 }}>
                        <span className="text-7xl opacity-20">🩺</span>
                      </div>
                  }
                  <div className="absolute bottom-3 left-3">
                    <span className="bg-black/50 backdrop-blur-sm text-white text-xs px-3 py-1 rounded-full font-medium tracking-wide">AI Analysis</span>
                  </div>
                </div>

                <div className="flex-1 p-6 sm:p-7">
                  <h2 className="text-2xl sm:text-3xl font-bold text-gray-900 tracking-tight mb-1">{selected.disease || "Skin Condition"}</h2>
                  {fullParagraph && (
                    <p className="text-sm text-gray-500 leading-relaxed mt-2 mb-5 pb-5 border-b border-dashed border-gray-200">{fullParagraph}</p>
                  )}

                  <div className="flex flex-col sm:flex-row items-stretch gap-3 sm:gap-4 mt-5">

                    <div className="flex items-center gap-3 sm:gap-4 bg-white p-4 sm:p-5 rounded-2xl shadow-md flex-1">
                      <div className="relative w-16 h-16 sm:w-20 sm:h-20 flex-shrink-0">
                        <Pie data={getSeverityChart(selected.severity)} options={{ cutout:"70%", plugins:{ legend:{ display:false }, tooltip:{ enabled:false } } }} />
                        <span className="absolute inset-0 flex items-center justify-center font-bold text-xs sm:text-sm">{getSeverityPercent(selected.severity)}%</span>
                      </div>
                      <div className="min-w-0">
                        <p className="text-[10px] font-bold text-gray-400 uppercase tracking-widest mb-1">Severity</p>
                        <p className={`text-base sm:text-lg font-bold ${getSeverityColor(selected.severity)}`}>{selected.severity || "—"}</p>
                        <p className="text-xs text-gray-500 mt-0.5 leading-snug">{getSeverityMeaning(selected.severity)}</p>
                      </div>
                    </div>

                    <div className="bg-white p-4 sm:p-5 rounded-2xl shadow-md flex-1 flex flex-col justify-center">
                      <div className="flex items-center gap-2 text-[#1B5E44] mb-1">
                        <FaLayerGroup size={14} />
                        <p className="text-[10px] font-bold text-gray-400 uppercase tracking-widest">Skin Layer</p>
                      </div>
                      <p className="font-bold text-sm sm:text-base text-gray-800">{getLayerText(selected.layer)}</p>
                      <p className="text-xs text-gray-500 mt-1 leading-snug">{getLayerMeaning(selected.layer)}</p>
                    </div>

                    {selected.temperament && (
                      <div className="bg-white p-4 sm:p-5 rounded-2xl shadow-md flex-1 flex flex-col justify-center">
                        <p className="text-[10px] font-bold text-gray-400 uppercase tracking-widest mb-1">Body Temperament</p>
                        <p className="font-bold text-base sm:text-lg text-[#1B5E44]">{selected.temperament}</p>
                        <p className="text-xs text-gray-500 mt-1 leading-snug">{getTemperamentMeaning(selected.temperament)}</p>
                      </div>
                    )}
                  </div>
                </div>
              </div>

              {/* BOTTOM GRID */}
              {(remedyItems.length > 0 || dietRows.length > 0) && (
                <div className="grid grid-cols-1 md:grid-cols-2 gap-5">

                  {remedyItems.length > 0 && (
                    <div
                      className="bg-white rounded-3xl border border-gray-100 shadow-md overflow-hidden"
                      style={{ opacity:mounted?1:0, transform:mounted?"translateY(0)":"translateY(24px)", transition:"opacity 0.55s ease 0.1s, transform 0.55s ease 0.1s" }}
                    >
                      <div className={`px-6 py-4 flex items-center gap-3 ${isRemedy?"bg-emerald-50 border-b border-emerald-100":"bg-amber-50 border-b border-amber-100"}`}>
                        <div className={`w-10 h-10 rounded-xl flex items-center justify-center ${isRemedy?"bg-emerald-100":"bg-amber-100"}`}>
                          {isRemedy
                            ? <svg width="22" height="22" viewBox="0 0 24 24" fill="none"><path d="M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2z" fill="#059669" opacity="0.15"/><path d="M7 12c0-2.76 2.24-5 5-5s5 2.24 5 5-2.24 5-5 5" stroke="#059669" strokeWidth="2" strokeLinecap="round"/><circle cx="12" cy="12" r="1.5" fill="#059669"/></svg>
                            : <svg width="20" height="20" viewBox="0 0 24 24" fill="none"><path d="M12 2L2 19h20L12 2z" fill="#d97706" opacity="0.15"/><path d="M12 9v5M12 16.5v.5" stroke="#d97706" strokeWidth="2" strokeLinecap="round"/></svg>
                          }
                        </div>
                        <div>
                          <h3 className={`font-bold text-base ${isRemedy?"text-emerald-800":"text-amber-800"}`}>{isRemedy?"Herbal Remedies":"Precautions"}</h3>
                          <p className={`text-xs ${isRemedy?"text-emerald-600":"text-amber-600"}`}>{isRemedy?"Natural treatment recommendations":"Important things to avoid"}</p>
                        </div>
                      </div>
                      <div className="p-5 space-y-3">
                        {remedyItems.map((item, idx) => (
                          <div key={idx} className={`flex gap-3 p-3 rounded-2xl transition-all duration-200 hover:scale-[1.015] hover:shadow-sm ${isRemedy?"bg-emerald-50/60 border border-emerald-100":"bg-amber-50/60 border border-amber-100"}`}>
                            <div className={`w-7 h-7 rounded-lg flex items-center justify-center flex-shrink-0 mt-0.5 text-xs font-bold ${isRemedy?"bg-emerald-100 text-emerald-700":"bg-amber-100 text-amber-700"}`}>{idx+1}</div>
                            <p className="text-sm text-gray-700 leading-relaxed">{item}</p>
                          </div>
                        ))}
                      </div>
                    </div>
                  )}

                  {dietRows.length > 0 && (
                    <div
                      className="bg-white rounded-3xl border border-gray-100 shadow-md overflow-hidden"
                      style={{ opacity:mounted?1:0, transform:mounted?"translateY(0)":"translateY(24px)", transition:"opacity 0.55s ease 0.2s, transform 0.55s ease 0.2s" }}
                    >
                      <div className="px-6 py-4 flex items-center gap-3 bg-sky-50 border-b border-sky-100">
                        <div className="w-10 h-10 rounded-xl bg-sky-100 flex items-center justify-center">
                          <svg width="22" height="22" viewBox="0 0 24 24" fill="none"><path d="M12 2C8 2 4 5 4 9c0 5 8 13 8 13s8-8 8-13c0-4-4-7-8-7z" fill="#0ea5e9" opacity="0.2"/><path d="M9 12l2 2 4-4" stroke="#0ea5e9" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/></svg>
                        </div>
                        <div>
                          <h3 className="font-bold text-base text-sky-800">Recommended Diet</h3>
                          <p className="text-xs text-sky-600">Tailored to your temperament</p>
                        </div>
                      </div>
                      <div className="p-5 space-y-2.5">
                        {dietRows.map(({ label, key }) => (
                          <div key={key} className="flex gap-3 items-start p-3 rounded-2xl bg-sky-50/40 border border-sky-100/60 transition-all duration-200 hover:scale-[1.015] hover:shadow-sm">
                            <span className="text-[10px] font-bold text-sky-600 uppercase tracking-wider bg-sky-100 px-2 py-1.5 rounded-lg flex-shrink-0 min-w-[76px] text-center leading-tight">{label}</span>
                            <p className="text-sm text-gray-700 leading-relaxed">{firstPlan[key]}</p>
                          </div>
                        ))}
                      </div>
                    </div>
                  )}
                </div>
              )}

              <div className="text-center py-5">
                <p className="text-xs text-gray-400 tracking-widest uppercase">Herbalin · AI Skin Care · Personalized Treatment Report</p>
              </div>
            </div>
          </>
        ) : (
          <div className="h-full flex flex-col items-center justify-center text-center gap-3 text-gray-400">
            {/* <div className="w-16 h-16 rounded-2xl bg-gray-100 flex items-center justify-center text-3xl">🩺</div> */}
            <p className="font-semibold text-gray-500">Select a scan from the sidebar</p>
            <p className="text-sm text-gray-400 max-w-xs">Your full analysis and treatment plan will appear here.</p>
          </div>
        )}
      </div>

      {/* ══ TOAST STACK ══ */}
      <div className="fixed bottom-5 left-1/2 -translate-x-1/2 flex flex-col gap-2 z-[999] pointer-events-none">
        {toasts.map(t => (
          <div
            key={t.id}
            className={`
              flex items-center gap-3 px-4 py-3 rounded-2xl shadow-lg text-sm font-medium
              pointer-events-auto animate-fade-in-up min-w-[220px] max-w-xs
              ${t.type === "success" ? "bg-[#1B5E44] text-white"
                : t.type === "error" ? "bg-red-500 text-white"
                : "bg-gray-800 text-white"}
            `}
            style={{ animation:"fadeInUp 0.25s ease" }}
          >
            {t.type === "success" && (
              <svg width="16" height="16" viewBox="0 0 24 24" fill="none"><path d="M5 13l4 4L19 7" stroke="white" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round"/></svg>
            )}
            {t.type === "error" && (
              <svg width="16" height="16" viewBox="0 0 24 24" fill="none"><path d="M6 18L18 6M6 6l12 12" stroke="white" strokeWidth="2.5" strokeLinecap="round"/></svg>
            )}
            {t.type === "info" && (
              <svg width="16" height="16" viewBox="0 0 24 24" fill="none"><circle cx="12" cy="12" r="9" stroke="white" strokeWidth="2"/><path d="M12 8v4M12 16h.01" stroke="white" strokeWidth="2" strokeLinecap="round"/></svg>
            )}
            {t.message}
          </div>
        ))}
      </div>

      {/* ══ DELETE CONFIRM DIALOG ══ */}
      {confirmDelete && (
        <div className="fixed inset-0 bg-black/40 z-[998] flex items-center justify-center px-4">
          <div className="bg-white rounded-2xl shadow-2xl p-6 w-full max-w-sm">
            <div className="flex items-center gap-3 mb-3">
              <div className="w-10 h-10 rounded-full bg-red-100 flex items-center justify-center flex-shrink-0">
                <FaTrash size={14} className="text-red-500" />
              </div>
              <div>
                <p className="font-semibold text-gray-800 text-sm">Delete Scan?</p>
                <p className="text-xs text-gray-400 mt-0.5">This action cannot be undone.</p>
              </div>
            </div>
            <div className="flex gap-2 mt-4">
              <button
                onClick={() => setConfirmDelete(null)}
                className="flex-1 py-2 rounded-xl border border-gray-200 text-sm text-gray-600 hover:bg-gray-50 transition"
              >
                Cancel
              </button>
              <button
                onClick={() => deleteScan(confirmDelete)}
                className="flex-1 py-2 rounded-xl bg-red-500 text-white text-sm font-semibold hover:bg-red-600 transition"
              >
                Delete
              </button>
            </div>
          </div>
        </div>
      )}

      <style>{`
        @keyframes fadeInUp {
          from { opacity: 0; transform: translateY(12px); }
          to   { opacity: 1; transform: translateY(0); }
        }
      `}</style>
    </div>
  );
}