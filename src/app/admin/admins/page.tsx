import React from "react";
import TopBar from "@/app/dashboardComponents/TopBar";
import AddAdminForm from "./AddAdminForm";

export default function DriverApplicationsPage() {
  return (
    <section className="p-5 md:p-10 min-h-screen w-full">
      <TopBar heading="Admin Management" />
      <AddAdminForm />
    </section>
  );
}
