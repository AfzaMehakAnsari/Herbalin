import { useState } from "react";
import { FaChevronLeft, FaChevronRight } from "react-icons/fa";

// ── Date helper (same as AdminAppointments) ──
function isPast(dateStr) {
  if (!dateStr) return false;
  const apptDate = new Date(dateStr + "T00:00:00");
  const today    = new Date();
  today.setHours(0, 0, 0, 0);
  return apptDate < today;
}

function effectiveStatus(appt) {
  if (["completed", "cancelled", "missed"].includes(appt.status)) return appt.status;
  if (isPast(appt.date)) return "missed";
  return appt.status;
}

// ── Status badge config ──
const STATUS = {
  pending:   { label: "Pending",   bg: "#FEF9EC", color: "#7A5700", dot: "#DDB84A", border: "#DDB84A" },
  confirmed: { label: "Confirmed", bg: "#EDFAF3", color: "#155E35", dot: "#3BB06B", border: "#3BB06B" },
  completed: { label: "Completed", bg: "#EEF4FF", color: "#1E40AF", dot: "#93C5FD", border: "#93C5FD" },
  cancelled: { label: "Cancelled", bg: "#F5F5F5", color: "#555",    dot: "#BBB",    border: "#BBB"    },
  missed:    { label: "Missed",    bg: "#FFF1F1", color: "#991B1B", dot: "#F87171", border: "#FCA5A5" },
};

function StatusBadge({ status }) {
  const c = STATUS[status] || STATUS.pending;
  return (
    <span style={{
      display: "inline-flex", alignItems: "center", gap: 4,
      padding: "2px 8px", borderRadius: 99, fontSize: 10, fontWeight: 600,
      background: c.bg, color: c.color, border: `1px solid ${c.border}`,
    }}>
      <span style={{ width: 5, height: 5, borderRadius: "50%", background: c.dot, display: "inline-block" }} />
      {c.label}
    </span>
  );
}

// ── Dot color for calendar day ──
function getDotColor(status) {
  return STATUS[status]?.dot || STATUS.pending.dot;
}

export default function Calendar({ appointments = [] }) {
  const today = new Date();

  const [currentMonth, setCurrentMonth] = useState(today.getMonth());
  const [currentYear, setCurrentYear]   = useState(today.getFullYear());
  const [selectedDate, setSelectedDate] = useState(today.getDate());

  const monthNames = [
    "January","February","March","April","May","June",
    "July","August","September","October","November","December",
  ];
  const weekDays = ["Sun","Mon","Tue","Wed","Thu","Fri","Sat"];

  const changeMonth = (dir) => {
    let newMonth = currentMonth + dir;
    if (newMonth < 0)  { newMonth = 11; setCurrentYear(y => y - 1); }
    if (newMonth > 11) { newMonth = 0;  setCurrentYear(y => y + 1); }
    setCurrentMonth(newMonth);
  };

  const firstDayOfMonth = new Date(currentYear, currentMonth, 1).getDay();
  const daysInMonth     = new Date(currentYear, currentMonth + 1, 0).getDate();

  const days = [];
  for (let i = 0; i < firstDayOfMonth; i++) days.push(null);
  for (let d = 1; d <= daysInMonth; d++)    days.push(d);

  // ── Appointments with effective status ──
  const apptWithStatus = appointments.map(a => ({ ...a, _eff: effectiveStatus(a) }));

  // ── Group by date for dots on calendar ──
  const apptsByDay = {};
  apptWithStatus.forEach(a => {
    const d = new Date(a.date + "T00:00:00");
    if (d.getMonth() === currentMonth && d.getFullYear() === currentYear) {
      const day = d.getDate();
      if (!apptsByDay[day]) apptsByDay[day] = [];
      apptsByDay[day].push(a);
    }
  });

  // ── Selected day appointments ──
  const todaysAppointments = apptWithStatus.filter(a => {
    const d = new Date(a.date + "T00:00:00");
    return (
      d.getDate()     === selectedDate &&
      d.getMonth()    === currentMonth &&
      d.getFullYear() === currentYear
    );
  });

  return (
    <div className="bg-white p-6 rounded-xl shadow">

      {/* HEADER */}
      <div className="flex justify-between items-center mb-5">
        <span className="font-bold text-[#1B5E44] text-lg">
          {monthNames[currentMonth]} {currentYear}
        </span>
        <div className="flex items-center gap-2">
          <button onClick={() => changeMonth(-1)}
            className="w-10 h-10 rounded-full flex items-center justify-center hover:bg-gray-100 hover:scale-110 transition text-[#1B5E44]">
            <FaChevronLeft />
          </button>
          <button onClick={() => changeMonth(1)}
            className="w-10 h-10 rounded-full flex items-center justify-center hover:bg-gray-100 hover:scale-110 transition text-[#1B5E44]">
            <FaChevronRight />
          </button>
        </div>
      </div>

      {/* WEEK DAYS */}
      <div className="grid grid-cols-7 text-center text-xs font-semibold text-gray-500 mb-2">
        {weekDays.map(day => <div key={day}>{day}</div>)}
      </div>

      {/* DAYS GRID */}
      <div className="grid grid-cols-7 gap-1 text-center">
        {days.map((day, i) => {
          if (!day) return <div key={i} />;

          const isToday =
            day === today.getDate() &&
            currentMonth === today.getMonth() &&
            currentYear  === today.getFullYear();

          const isSelected = selectedDate === day;
          const dayAppts   = apptsByDay[day] || [];

          // max 3 dots show karo
          const dots = dayAppts.slice(0, 3);

          return (
            <div
              key={i}
              onClick={() => setSelectedDate(day)}
              className="flex flex-col items-center cursor-pointer"
              style={{ gap: 2 }}
            >
              <div className={`w-9 h-9 flex items-center justify-center rounded-full transition
                ${isSelected ? "bg-[#1B5E44] text-white" : "text-gray-700 hover:bg-gray-100"}
                ${isToday && !isSelected ? "border border-[#1B5E44]" : ""}
              `}>
                {day}
              </div>

              {/* Status dots */}
              {dots.length > 0 && (
                <div style={{ display: "flex", gap: 2, justifyContent: "center" }}>
                  {dots.map((a, idx) => (
                    <span key={idx} style={{
                      width: 5, height: 5, borderRadius: "50%",
                      background: getDotColor(a._eff),
                      display: "inline-block",
                    }} />
                  ))}
                </div>
              )}
            </div>
          );
        })}
      </div>

      {/* APPOINTMENTS LIST */}
      <div className="mt-5">
        <h3 className="font-semibold mb-3 text-gray-800">
          {selectedDate} {monthNames[currentMonth]} — Appointments
        </h3>

        {todaysAppointments.length ? (
          <div style={{ display: "flex", flexDirection: "column", gap: 8 }}>
            {todaysAppointments.map(a => {
              const c = STATUS[a._eff] || STATUS.pending;
              return (
                <div key={a._id} style={{
                  background: c.bg,
                  border: `1px solid ${c.border}`,
                  borderLeft: `4px solid ${c.dot}`,
                  borderRadius: 10,
                  padding: "10px 14px",
                  display: "flex",
                  justifyContent: "space-between",
                  alignItems: "center",
                  gap: 8,
                }}>
                  <div>
                    <p style={{ fontWeight: 600, fontSize: 13, color: "#111", margin: 0 }}>
                      {a.firstName} {a.lastName}
                    </p>
                    <p style={{ fontSize: 11, color: "#888", margin: "3px 0 0" }}>
                      {a.time}
                    </p>
                  </div>
                  <StatusBadge status={a._eff} />
                </div>
              );
            })}
          </div>
        ) : (
          <p className="text-gray-400 text-sm">No appointments on this day</p>
        )}
      </div>

    </div>
  );
}