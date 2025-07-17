import { useState } from "react";
import { Layout } from "@/layout/Layout";
import { UpcomingAppointments } from "@/pages/UpcomingAppointments";
import { Clients } from "@/pages/Clients";
import { AppointmentForm } from "@/pages/AppointmentForm";

function App() {
  const [activeView, setActiveView] = useState("Appointments");
  const [showAppointmentForm, setShowAppointmentForm] = useState(false);

  const handleViewChange = (view: string) => {
    setActiveView(view);
    setShowAppointmentForm(false);
  };

  const renderPage = () => {
    switch (activeView) {
      case "Clients":
        return <Clients />;
      case "Appointments":
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
