import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import Dashboard from "./components/Dashboard";
import CalendarView from "./components/CalendarView";
import ReservationList from "./components/ReservationList";

function App() {
  return (
    <Router>
      <Routes>
        <Route path="/" element={<Dashboard />} />
        <Route path="/calendar" element={<CalendarView />} />
        <Route path="/reservations" element={<ReservationList />} />
      </Routes>
    </Router>
  );
}

export default App;
