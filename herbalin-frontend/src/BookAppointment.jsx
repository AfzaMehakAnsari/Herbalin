import { useState, useCallback } from "react";
import {
  FiUser, FiPhone, FiMail, FiChevronLeft, FiChevronRight,
  FiClock, FiCheck, FiAlertCircle, FiCalendar, FiX
} from "react-icons/fi";

const MONTHS = ["January","February","March","April","May","June","July","August","September","October","November","December"];
const WEEKDAYS = ["Su","Mo","Tu","We","Th","Fr","Sa"];
const TIME_SLOTS = [
  "2:00 PM","3:00 PM","4:00 PM","5:00 PM","6:00 PM","7:00 PM",
  "8:00 PM","9:00 PM","10:00 PM","11:00 PM","12:00 AM","1:00 AM",
];
const INITIAL_FORM = { firstName:"", lastName:"", contact:"", email:"" };

export default function BookAppointment() {
  const today = new Date();
  const [form, setForm] = useState(INITIAL_FORM);
  const [curMonth, setCurMonth] = useState(today.getMonth());
  const [curYear, setCurYear] = useState(today.getFullYear());
  const [selectedDay, setSelectedDay] = useState(null);
  const [selectedTime, setSelectedTime] = useState(null);
  const [bookedSlots, setBookedSlots] = useState({});
  const [sending, setSending] = useState(false);
  const [booked, setBooked] = useState(false);
  const [showToast, setShowToast] = useState(false);
  const [error, setError] = useState("");

  const changeMonth = (dir) => {
    let m = curMonth + dir, y = curYear;
    if (m < 0) { m = 11; y--; }
    if (m > 11) { m = 0; y++; }
    setCurMonth(m); setCurYear(y);
  };

  const getDateKey = (d, m, y) =>
    `${y}-${String(m+1).padStart(2,"0")}-${String(d).padStart(2,"0")}`;

  const handleDayClick = async (d) => {
    if (booked) return;
    const key = getDateKey(d, curMonth, curYear);
    setSelectedDay({ d, m: curMonth, y: curYear, key });
    setSelectedTime(null);
    try {
      const res = await fetch(`http://localhost:5000/api/book-appointment/slots?date=${key}`);
      const data = await res.json();
      if (data.success) setBookedSlots(p => ({ ...p, [key]: data.bookedTimes }));
    } catch {}
  };

  const resetAll = useCallback(() => {
    setForm(INITIAL_FORM);
    setSelectedDay(null);
    setSelectedTime(null);
    setBooked(false);
    setShowToast(false);
    setError("");
  }, []);

  const confirm = async () => {
    if (sending || booked) return;
    setError("");
    const { firstName, lastName, contact, email } = form;
    if (!firstName || !lastName || !contact || !email)
      return setError("Please fill in all patient details.");
    if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email))
      return setError("Please enter a valid email address.");
    if (!selectedDay) return setError("Please select a date.");
    if (!selectedTime) return setError("Please select a time slot.");

    setSending(true);
    try {
      const DAY_NAMES = ["Sun","Mon","Tue","Wed","Thu","Fri","Sat"];
      const res = await fetch("http://localhost:5000/api/book-appointment", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          ...form,
          date: selectedDay.key,
          day: DAY_NAMES[new Date(selectedDay.y, selectedDay.m, selectedDay.d).getDay()],
          time: selectedTime,
        }),
      });
      const data = await res.json();
      if (data.success) {
        setBooked(true);
        setTimeout(() => setShowToast(true), 1800);
      } else if (res.status === 409) {
        setError(data.message || "This slot is already booked. Choose another.");
      } else {
        setError("Something went wrong. Please try again.");
      }
    } catch {
      setError("Could not connect to server. Please try again.");
    } finally {
      setSending(false);
    }
  };

  const firstDay = new Date(curYear, curMonth, 1).getDay();
  const daysInMonth = new Date(curYear, curMonth + 1, 0).getDate();
  const fullSlots = selectedDay ? (bookedSlots[selectedDay.key] || []) : [];

  return (
    <div className="min-h-screen px-4 sm:px-8 py-10 font-sans">

      {/* ── Doctor Header ── */}
      <div className="max-w-6xl mx-auto mb-8">
        <div className="inline-flex items-center gap-4 px-6 pt-4">
          <div className="relative">
            <img
              src="https://i.imgur.com/WxNkK7J.png"
              alt="Doctor"
              className="w-14 h-14 rounded-full object-cover ring-2 ring-[#0B5D3B] ring-offset-2"
            />
            <span className="absolute bottom-0 right-0 w-3.5 h-3.5 bg-green-400 rounded-full border-2 border-white" />
          </div>
          <div className="text-left">
            <p className="font-bold text-gray-900 text-lg leading-tight">Dr. Hafsa Abbasi</p>
            <p className="text-sm text-gray-500">Dermatology &amp; Skin Wellness</p>
          </div>
        </div>
      </div>

      {/* ── Main Card ── */}
      <div className="max-w-6xl mx-auto bg-white rounded-3xl shadow-lg border border-gray-100 overflow-hidden">

        {/* 3-col grid → stacks on mobile */}
        <div className="grid grid-cols-1 lg:grid-cols-3 divide-y lg:divide-y-0 lg:divide-x divide-gray-100">

          {/* ── COL 1: Patient Details ── */}
          <div className="p-6 sm:p-8">
            <div className="flex items-center gap-2 mb-5">
              <FiUser className="text-[#0B5D3B]" size={16} />
              <h3 className="text-sm font-bold text-gray-800 uppercase tracking-widest">Patient Details</h3>
            </div>

            <div className="space-y-3">
              <div className="grid grid-cols-2 gap-3">
                <input
                  placeholder="First name"
                  value={form.firstName}
                  onChange={e => setForm({...form, firstName: e.target.value})}
                  className="w-full pl-3 pr-3 py-2.5 text-sm border border-gray-200 rounded-xl focus:outline-none focus:border-[#0B5D3B] focus:ring-2 focus:ring-green-100 transition-all placeholder-gray-400 text-gray-800 font-medium"
                />
                <input
                  placeholder="Last name"
                  value={form.lastName}
                  onChange={e => setForm({...form, lastName: e.target.value})}
                  className="w-full pl-3 pr-3 py-2.5 text-sm border border-gray-200 rounded-xl focus:outline-none focus:border-[#0B5D3B] focus:ring-2 focus:ring-green-100 transition-all placeholder-gray-400 text-gray-800 font-medium"
                />
              </div>

              <div className="relative">
                <FiPhone className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" size={14} />
                <input
                  placeholder="Contact number"
                  value={form.contact}
                  onChange={e => setForm({...form, contact: e.target.value})}
                  className="w-full pl-9 pr-3 py-2.5 text-sm border border-gray-200 rounded-xl focus:outline-none focus:border-[#0B5D3B] focus:ring-2 focus:ring-green-100 transition-all placeholder-gray-400 text-gray-800 font-medium"
                />
              </div>

              <div className="relative">
                <FiMail className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" size={14} />
                <input
                  placeholder="Email address"
                  value={form.email}
                  onChange={e => setForm({...form, email: e.target.value})}
                  className="w-full pl-9 pr-3 py-2.5 text-sm border border-gray-200 rounded-xl focus:outline-none focus:border-[#0B5D3B] focus:ring-2 focus:ring-green-100 transition-all placeholder-gray-400 text-gray-800 font-medium"
                />
              </div>
            </div>

            {/* Info note */}
            <div className="mt-6 bg-green-50 border border-green-100 rounded-xl p-3.5">
              <p className="text-[11px] text-green-800 leading-relaxed">
                <strong>Note:</strong> Appointments available Mon–Thu, Sat–Sun only.
                Fridays are unavailable. Hours: 2:00 PM – 1:00 AM.
              </p>
            </div>
          </div>

          {/* ── COL 2: Calendar ── */}
          <div className="p-6 sm:p-8">
            <div className="flex items-center gap-2 mb-5">
              <FiCalendar className="text-[#0B5D3B]" size={16} />
              <h3 className="text-sm font-bold text-gray-800 uppercase tracking-widest">Select Date</h3>
            </div>

            {/* Month nav */}
            <div className="flex justify-between items-center mb-4">
              <button
                onClick={() => changeMonth(-1)}
                className="w-8 h-8 rounded-lg border border-gray-200 text-gray-600 hover:bg-green-50 hover:border-green-300 flex items-center justify-center transition-all"
              >
                <FiChevronLeft size={16} />
              </button>
              <span className="text-sm font-bold text-gray-800">
                {MONTHS[curMonth]} {curYear}
              </span>
              <button
                onClick={() => changeMonth(1)}
                className="w-8 h-8 rounded-lg border border-gray-200 text-gray-600 hover:bg-green-50 hover:border-green-300 flex items-center justify-center transition-all"
              >
                <FiChevronRight size={16} />
              </button>
            </div>

            {/* Weekday headers — bold & visible */}
            <div className="grid grid-cols-7 text-center mb-2">
              {WEEKDAYS.map((d, i) => (
                <div
                  key={d}
                  className={`text-[12px] font-bold py-1
                    ${i === 5 ? "text-red-400" : "text-gray-700"}`}
                >
                  {d}
                </div>
              ))}
            </div>

            {/* Day cells */}
            <div className="grid grid-cols-7 gap-0.5">
              {Array(firstDay).fill(null).map((_, i) => <div key={i} />)}
              {Array.from({ length: daysInMonth }, (_, i) => i + 1).map(d => {
                const cell = new Date(curYear, curMonth, d);
                const isFri = cell.getDay() === 5;
                const isPast = cell < new Date(today.getFullYear(), today.getMonth(), today.getDate());
                const isToday = d === today.getDate() && curMonth === today.getMonth() && curYear === today.getFullYear();
                const isSel = selectedDay?.d === d && selectedDay?.m === curMonth && selectedDay?.y === curYear;
                const disabled = isFri || isPast;
                return (
                  <button
                    key={d}
                    onClick={() => !disabled && handleDayClick(d)}
                    disabled={disabled}
                    className={`
                      aspect-square flex items-center justify-center rounded-full text-[12px] font-semibold transition-all duration-150
                      ${disabled ? "text-gray-200 cursor-not-allowed" : "cursor-pointer"}
                      ${isSel ? "bg-[#0B5D3B] text-white shadow-md scale-105" : ""}
                      ${isToday && !isSel ? "ring-2 ring-[#0B5D3B] text-[#0B5D3B]" : ""}
                      ${!disabled && !isSel ? "hover:bg-green-100 hover:text-[#0B5D3B] text-gray-700" : ""}
                    `}
                  >
                    {d}
                  </button>
                );
              })}
            </div>

            {/* Legend */}
            <div className="flex items-center gap-4 mt-4 text-[11px] text-gray-500">
              <span className="flex items-center gap-1.5">
                <span className="w-2 h-2 rounded-full ring-2 ring-[#0B5D3B] inline-block" />
                Today
              </span>
              <span className="flex items-center gap-1.5">
                <span className="w-2 h-2 rounded-full bg-[#0B5D3B] inline-block" />
                Selected
              </span>
              <span className="flex items-center gap-1.5">
                <span className="w-2 h-2 rounded-full bg-gray-200 inline-block" />
                Unavailable
              </span>
            </div>
          </div>

          {/* ── COL 3: Time Slots ── */}
          <div className="p-6 sm:p-8">
            <div className="flex items-center gap-2 mb-1">
              <FiClock className="text-[#0B5D3B]" size={16} />
              <h3 className="text-sm font-bold text-gray-800 uppercase tracking-widest">Select Time</h3>
            </div>
            <p className="text-[12px] text-gray-500 mb-4 min-h-[18px] font-medium">
              {selectedDay
                ? `${MONTHS[selectedDay.m]} ${selectedDay.d}, ${selectedDay.y}`
                : "Choose a date first"}
            </p>

            <div className="grid grid-cols-2 gap-2">
              {TIME_SLOTS.map(t => {
                const full = fullSlots.includes(t);
                const sel = selectedTime === t;
                return (
                  <button
                    key={t}
                    disabled={full || !selectedDay || booked}
                    onClick={() => setSelectedTime(t)}
                    className={`
                      py-2.5 text-[12px] font-semibold rounded-xl border transition-all duration-150
                      ${full
                        ? "line-through text-gray-300 bg-gray-50 border-gray-100 cursor-not-allowed"
                        : !selectedDay || booked
                          ? "text-gray-300 border-gray-100 cursor-not-allowed"
                          : sel
                            ? "bg-[#0B5D3B] text-white border-[#0B5D3B] shadow-md scale-[1.03]"
                            : "border-gray-200 hover:border-[#0B5D3B] hover:bg-green-50 hover:text-[#0B5D3B] text-gray-700"
                      }
                    `}
                  >
                    {t}
                    {full && <span className="block text-[9px] font-normal">Full</span>}
                  </button>
                );
              })}
            </div>

            <div className="flex gap-4 mt-4 text-[11px] text-gray-500">
              <span className="flex items-center gap-1.5">
                <span className="w-2 h-2 rounded-full bg-[#0B5D3B] inline-block" />
                Selected
              </span>
              <span className="flex items-center gap-1.5">
                <span className="w-2 h-2 rounded-full bg-gray-200 inline-block" />
                Full
              </span>
            </div>
          </div>
        </div>

        {/* ── Bottom Bar ── */}
        <div className="border-t border-gray-100 bg-gray-50/60 px-6 sm:px-8 py-5">

          {/* Toast */}
          {showToast && (
            <div className="flex items-center gap-3 bg-[#0B5D3B] rounded-2xl px-5 py-3 mb-4 max-w-lg mx-auto shadow-md">
              <div className="w-6 h-6 rounded-full bg-green-400/20 flex items-center justify-center flex-shrink-0">
                <FiCheck size={13} className="text-green-300" />
              </div>
              <p className="text-green-100 text-xs flex-1 font-medium">
                Appointment booked! Want to schedule another?
              </p>
              <button
                onClick={resetAll}
                className="text-[11px] font-semibold bg-white/15 text-green-100 px-3 py-1.5 rounded-full hover:bg-white/25 transition"
              >
                Book again
              </button>
              <button onClick={() => setShowToast(false)} className="text-green-400 hover:text-green-200 transition ml-1">
                <FiX size={14} />
              </button>
            </div>
          )}

          {/* Error */}
          {error && (
            <div className="flex items-center gap-2 bg-red-50 border border-red-100 rounded-xl px-4 py-2.5 mb-4 max-w-lg mx-auto">
              <FiAlertCircle size={14} className="text-red-400 flex-shrink-0" />
              <p className="text-xs text-red-600 font-medium">{error}</p>
            </div>
          )}

          {/* Confirm Button — centered */}
          <div className="flex justify-center">
            <button
              onClick={confirm}
              disabled={sending || booked}
              className={`
                inline-flex items-center gap-2.5 px-10 py-3.5 rounded-full text-white text-sm font-bold
                transition-all duration-200 shadow-sm
                ${booked
                  ? "bg-green-700 cursor-default"
                  : "bg-[#0B5D3B] hover:bg-[#094d31] hover:shadow-md active:scale-95"
                }
              `}
            >
              {sending ? (
                <>
                  <svg className="animate-spin h-4 w-4" fill="none" viewBox="0 0 24 24">
                    <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
                    <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8v8H4z" />
                  </svg>
                  Booking...
                </>
              ) : booked ? (
                <>
                  <FiCheck size={16} />
                  Appointment Confirmed
                </>
              ) : (
                <>
                  <FiCalendar size={15} />
                  Confirm Appointment
                </>
              )}
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}