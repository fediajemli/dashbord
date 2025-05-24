import { FaCalendarCheck } from "react-icons/fa";

export default function StatsCard({ count }) {
  return (
    <div className="bg-white p-4 rounded-xl shadow flex items-center space-x-4">
      <FaCalendarCheck size={36} className="text-[#9C5C15]" />
      <div>
        <p className="text-2xl font-bold">{count}</p>
        <p className="text-gray-600">TOTAL RESERVATIONS</p>
      </div>
    </div>
  );
}