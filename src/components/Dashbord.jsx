import { useEffect, useState } from "react";
import axios from "axios";
import StatsCard from "./StatsCard";
import { Link } from "react-router-dom";

const Dashboard = () => {
  const [reservations, setReservations] = useState([]);
  const [selected, setSelected] = useState(null);

  useEffect(() => {
    const fetchReservations = () => {
      axios
        .get("http://localhost:5000/api/reservations")
        .then((res) => setReservations(res.data));
    };
    fetchReservations();
    const interval = setInterval(fetchReservations, 10000);
    return () => clearInterval(interval);
  }, []);

  const handleSelect = (id) => {
    axios
      .get(`http://localhost:5000/api/reservations/${id}`)
      .then((res) => setSelected(res.data));
  };

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

      {/* Main Content */}
      <main className="flex-1 p-6 overflow-y-auto bg-[url('/Capture1.PNG')] bg-cover bg-center bg-no-repeat">
        <h1 className="text-3xl font-bold text-white mb-6">DASHBOARD</h1>

        {/* Horizontal layout with StatsCard and ReservationDetails */}
        <div className="flex gap-6 mt-40">
          <div className="flex-1">
            <StatsCard count={reservations.length} />
          </div>
        </div>
      </main>
    </div>
  );
};

export default Dashboard;

