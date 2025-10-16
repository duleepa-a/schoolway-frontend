import TopBar from "@/app/dashboardComponents/TopBar";
import RoutesPageContent from "./RoutesPageContent";

const RoutesPage = () => {
  return (
    <div>
      <section className="p-5 md:p-10 min-h-screen w-full">
        <TopBar heading="View Routes" />
        <RoutesPageContent />
      </section>
    </div>
  );
};

export default RoutesPage;

