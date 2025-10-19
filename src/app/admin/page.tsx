import TopBar from "@/app/dashboardComponents/TopBar";
import AdminDashboardPageContent from "./AdminDashboardPageContent";

const AdminDashboardPage = () => {
  return (
    <div>
      <section className="p-5 md:p-10 min-h-screen w-full">
        {/*Top bar with profile icon and the heading*/}
        <TopBar heading="Admin Dashboard" />
        <AdminDashboardPageContent />
      </section>
    </div>
  );
};

export default AdminDashboardPage;
