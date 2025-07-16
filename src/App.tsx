import { useState } from "react";
import { Layout } from "@/layout/Layout";
import { UpcomingAppointments } from "@/pages/UpcomingAppointments";
import { Clients } from "@/pages/Clients";
import { AppointmentForm } from "@/pages/AppointmentForm";

function App() {
  const [activeView, setActiveView] = useState("Dashboard");
  const [showAppointmentForm, setShowAppointmentForm] = useState(false);

  const handleViewChange = (view: string) => {
    if (view === "Appointments") {
      setShowAppointmentForm(true);
    } else {
      setActiveView(view);
      setShowAppointmentForm(false);
    }
  };

  const renderPage = () => {
    switch (activeView) {
      case "Clients":
        return <Clients />;
      case "Dashboard":
      default:
        return <UpcomingAppointments />;
    }
  };

  return (
    <Layout activeView={activeView} onViewChange={handleViewChange}>
      {renderPage()}
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
