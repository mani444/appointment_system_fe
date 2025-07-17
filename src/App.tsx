import { useState } from "react";
import { Routes, Route, Navigate, useLocation } from "react-router-dom";
import { Layout } from "@/layout/Layout";
import { UpcomingAppointments } from "@/pages/UpcomingAppointments";
import { Clients } from "@/pages/Clients";
import { AppointmentForm } from "@/pages/AppointmentForm";

function App() {
  const location = useLocation();
  const [showAppointmentForm, setShowAppointmentForm] = useState(false);

  // Get the current active view based on the current path
  const getActiveView = () => {
    switch (location.pathname) {
      case "/clients":
        return "Clients";
      case "/appointments":
      case "/":
        return "Appointments";
      default:
        return "Appointments";
    }
  };

  return (
    <Layout activeView={getActiveView()}>
      <Routes>
        <Route path="/" element={<Navigate to="/appointments" replace />} />
        <Route path="/appointments" element={<UpcomingAppointments />} />
        <Route path="/clients" element={<Clients />} />
      </Routes>
      {showAppointmentForm && (
        <AppointmentForm
          open={showAppointmentForm}
          onOpenChange={setShowAppointmentForm}
        />
      )}
    </Layout>
  );
}

export default App;
