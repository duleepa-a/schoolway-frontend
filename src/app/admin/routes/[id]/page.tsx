import TopBar from "@/app/dashboardComponents/TopBar";
import RoutesDetails from "./RoutesDetails";
import VanDetailsClient from "./VanDetailsClient";

export default function RoutesPage({ params }: { params: { id: string } }) {
  const { id } = params;

  return (
    <div>
      <section className="p-5 md:p-10 min-h-screen w-full">
        <TopBar heading={`View Van ${id}`} />

        <div className="mb-8">
          <VanDetailsClient vanId={id} />
        </div>

        <RoutesDetails vanId={id} />
      </section>
    </div>
  );
}
