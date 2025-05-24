import Calendar from "react-calendar";
import "react-calendar/dist/Calendar.css";
import { useEffect, useState } from "react";
import axios from "axios";
import { Link } from "react-router-dom";

export default function CalendarView() {
  const [reservedDates, setReservedDates] = useState([]);

  useEffect(() => {
    axios
      .get("http://localhost:5000/api/reserved-dates")
      .then((res) => setReservedDates(res.data.map((d) => new Date(d))));
  }, []);

  return (
    <div className="flex h-screen bg-gray-100">
      {/* Sidebar */}
      <aside className="bg-[#C0E0CF] text-white w-64 p-6 space-y-6">
        <img src="/Capture.PNG" alt="Logo" className="h-25 mx-auto" />
        <nav className="space-y-2 text-center">
          <Link to="/" className="block hover:bg-[#9C5C15] rounded px-2 py-1">
            DASHBOARD
          </Link>
          <Link
            to="/calendar"
            className="block hover:bg-[#9C5C15] rounded px-2 py-1"
          >
            SCHEDULE OF RESERVATION
          </Link>
          <Link
            to="/reservations"
            className="block hover:bg-[#9C5C15] rounded px-2 py-1"
          >
            LIST OF RESERVATIONS
          </Link>
        </nav>
      </aside>

      {/* Main content */}
      <main className=" flex-1 p-6 overflow-y-auto ">
        <h2 className="text-3xl font-bold text-[#9C5C15] mb-6">
          SCHEDULE OF RESERVATION
        </h2>
        <div className="flex flex-col items-center justify-center">
          <Calendar
            className="custom-calendar"
            tileClassName={({ date }) =>
              reservedDates.find(
                (d) => d.toDateString() === date.toDateString()
              )
                ? "reserved-date"
                : ""
            }
          />
        </div>
      </main>
    </div>
  );
}
