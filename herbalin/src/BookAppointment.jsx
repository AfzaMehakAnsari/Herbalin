import { useState } from "react";

export default function BookAppointment() {
  const [form, setForm] = useState({
    firstName: "",
    lastName: "",
    contact: "",
    email: "",
    day: "Tue",
    time: "12:00 - 07:00",
    date: "",
  });

  const [sending, setSending] = useState(false); // ✅ sending state
  const [booked, setBooked] = useState(false);   // ✅ booked state

  const handleChange = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const bookAppointment = async () => {
    setSending(true);
    try {
      const res = await fetch("http://localhost:5000/api/book-appointment", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(form),
      });

      const data = await res.json();
      if (data.success) {
        setBooked(true);   // ✅ Appointment booked
      } else {
        console.error("Something went wrong"); // handle error silently
      }
    } catch (err) {
      console.error("Failed to book appointment:", err);
    } finally {
      setSending(false);
    }
  };

  return (
    <div className="min-h-screen bg-white-100 flex items-start justify-center px-4 pt-16">
      <div className="bg-gray-50 rounded-2xl shadow-xl p-6 w-full max-w-md">

        {/* HEADER */}
        <h2 className="text-center font-extrabold text-2xl mb-6">
          Book Appointment
        </h2>

        {/* DOCTOR */}
        <div className="flex flex-col items-center">
          <img
            src="https://i.imgur.com/WxNkK7J.png"
            alt="Doctor"
            className="w-24 h-24 rounded-full bg-green-200"
          />
          <h3 className="mt-2 font-bold text-green-900">
            Dr. Hafsa Abbasi
          </h3>

          <div className="flex text-yellow-400 text-sm">
            ★★★★★
          </div>

          <p className="text-xs text-center text-gray-600 mt-2">
            Dr. Hafsa Abbasi is a dedicated skin and wellness specialist,
            providing patient-centered dermatology care with accurate diagnosis
            and effective treatment.
          </p>
        </div>

        {/* USER DETAILS */}
        <h4 className="font-semibold text-sm mb-2">User Details</h4>

        <input
          name="firstName"
          placeholder="Full Name"
          className="input"
          onChange={handleChange}
        />
        <input
          name="lastName"
          placeholder="Last Name"
          className="input"
          onChange={handleChange}
        />
        <input
          name="contact"
          placeholder="Contact Number"
          className="input"
          onChange={handleChange}
        />
        <input
          name="email"
          placeholder="Email"
          className="input"
          onChange={handleChange}
        />

        {/* SLOTS */}
        <h4 className="font-semibold text-sm mt-4 mb-2">Available Slots</h4>
        <div className="grid grid-cols-4 gap-2 text-xs">
          {["Mon", "Tue", "Sat", "Sun"].map((d) => (
            <button
              key={d}
              onClick={() => setForm({ ...form, day: d })}
              className={`border rounded-lg py-2 ${
                form.day === d ? "bg-green-900 text-white" : "bg-white"
              }`}
            >
              {d}<br />09:00
            </button>
          ))}
        </div>

        {/* DATE */}
        <h4 className="font-semibold text-sm mt-4 mb-2">Date Pick</h4>
        <input
          type="date"
          name="date"
          className="input"
          onChange={handleChange}
        />

        {/* CONFIRM BUTTON */}
        <button
          onClick={bookAppointment}
          disabled={sending || booked} // disable while sending or booked
          className={`w-full py-3 rounded-full mt-6 text-white ${
            booked ? "bg-green-600 cursor-default" : "bg-green-900 hover:bg-green-800 transition"
          } flex items-center justify-center gap-2`}
        >
          {sending && (
            <svg
              className="animate-spin h-5 w-5 text-white"
              xmlns="http://www.w3.org/2000/svg"
              fill="none"
              viewBox="0 0 24 24"
            >
              <circle
                className="opacity-25"
                cx="12"
                cy="12"
                r="10"
                stroke="currentColor"
                strokeWidth="4"
              ></circle>
              <path
                className="opacity-75"
                fill="currentColor"
                d="M4 12a8 8 0 018-8v8H4z"
              ></path>
            </svg>
          )}
          {booked ? "Appointment Booked" : sending ? "Booking..." : "Confirm Appointment"}
        </button>
      </div>
    </div>
  );
}
