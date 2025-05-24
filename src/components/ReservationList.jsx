import axios from "axios";
import { useEffect, useState } from "react";
import { motion } from "framer-motion";
import { Eye, EyeOff, X } from "lucide-react";
import { MapContainer, TileLayer, Marker } from "react-leaflet";
import "leaflet/dist/leaflet.css";
import L from "leaflet";
import { Link } from "react-router-dom";

delete L.Icon.Default.prototype._getIconUrl;
L.Icon.Default.mergeOptions({
  iconUrl: "https://unpkg.com/leaflet@1.9.4/dist/images/marker-icon.png",
  iconRetinaUrl:
    "https://unpkg.com/leaflet@1.9.4/dist/images/marker-icon-2x.png",
  shadowUrl: "https://unpkg.com/leaflet@1.9.4/dist/images/marker-shadow.png",
});

export default function ReservationList() {
  const [reservations, setReservations] = useState([]);
  const [selectedReservation, setSelectedReservation] = useState(null);
  const [showProof, setShowProof] = useState(false);

  const fetchReservationDetail = (id) => {
    axios
      .get(`http://localhost:5000/api/reservations/${id}`)
      .then((res) => {
        setSelectedReservation(res.data);
        setShowProof(false);
      })
      .catch((err) => {
        console.error("Failed to fetch reservation:", err);
      });
  };

  const fileUrl = selectedReservation?.slip
    ? `data:application/octet-stream;base64,${selectedReservation.slip}`
    : null;

  const isImage = selectedReservation?.slip_filename?.match(
    /\.(jpeg|jpg|png|gif)$/i
  );

  useEffect(() => {
    const fetchReservations = () => {
      axios
        .get("http://localhost:5000/api/reservations")
        .then((res) => {
          setReservations(res.data);
        })
        .catch((err) => console.error("Failed to fetch reservations:", err));
    };

    fetchReservations();
    const interval = setInterval(fetchReservations, 10000);
    return () => clearInterval(interval);
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

      {/* Main Content */}
      <main className="flex-1 p-6 overflow-y-auto flex">
        {/* Reservation List */}
        <div className="w-1/2 pr-4">
          <h2 className="text-3xl font-bold text-[#9C5C15] mb-6">
            LIST OF RESERVATIONS
          </h2>
          <ul role="list" className="divide-y divide-gray-100">
            {reservations.map((r, index) => (
              <li
                key={r.id}
                className="flex justify-between gap-x-6 py-5 cursor-pointer"
                onClick={() => fetchReservationDetail(r.id)}
              >
                <div className="min-w-0 flex-auto">
                  <p className="text-xl text-gray-900 hover:text-[#9C5C15]">
                    RESERVATION {index + 1}
                  </p>
                </div>
              </li>
            ))}
          </ul>
        </div>

        {/* Reservation Details */}
        {selectedReservation && (
          <motion.div
            initial={{ opacity: 0, x: 50 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.4 }}
            className="relative w-1/2 p-4 border rounded bg-white shadow"
          >
            {/* Close Button */}
            <button
              onClick={() => setSelectedReservation(null)}
              className="absolute top-2 right-2 text-gray-500 hover:text-red-600"
            >
              <X size={24} />
            </button>

            <h3 className="text-2xl font-bold text-[#9C5C15] mb-4">
              RESERVATION DETAILS
            </h3>
            <p>
              <strong>Name:</strong> {selectedReservation.name}
            </p>
            <p>
              <strong>Phone:</strong> {selectedReservation.phone}
            </p>
            <p>
              <strong>Location:</strong> {selectedReservation.location}
            </p>

            {selectedReservation.coordinates && (
              <div className="mt-4">
                <strong>Location Map:</strong>
                <div className="h-64 mt-2 rounded overflow-hidden">
                  <MapContainer
                    center={[
                      selectedReservation.coordinates.lat,
                      selectedReservation.coordinates.lng,
                    ]}
                    zoom={15}
                    scrollWheelZoom={false}
                    className="h-full w-full z-0"
                  >
                    <TileLayer
                      url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
                      attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a>'
                    />
                    <Marker
                      position={[
                        selectedReservation.coordinates.lat,
                        selectedReservation.coordinates.lng,
                      ]}
                    />
                  </MapContainer>
                </div>
              </div>
            )}

            <p className="mt-4">
              <strong>Date:</strong> {selectedReservation.date}
            </p>
            <p>
              <strong>Time:</strong> {selectedReservation.time}
            </p>

            {/* Proof Box */}
            {selectedReservation.slip && selectedReservation.slip_filename && (
              <div className="mt-4">
                {showProof && (
                  <div className="mb-2 p-4 border rounded bg-gray-50 shadow-inner">
                    {isImage && (
                      <img
                        src={fileUrl}
                        alt="Proof"
                        className="border rounded w-48 max-h-48 object-contain mx-auto"
                      />
                    )}
                    <a
                      href={fileUrl}
                      download={selectedReservation.slip_filename}
                      className="mt-2 block text-center text-blue-600 underline"
                    >
                      DOWNLOAD THE PROOF
                    </a>
                  </div>
                )}
                <div className="flex items-center gap-2">
                  <strong>Proof File:</strong>
                  <button
                    onClick={() => setShowProof(!showProof)}
                    className="text-blue-600"
                  >
                    {showProof ? <EyeOff size={20} /> : <Eye size={20} />}
                  </button>
                </div>
              </div>
            )}
          </motion.div>
        )}
      </main>
    </div>
  );
}