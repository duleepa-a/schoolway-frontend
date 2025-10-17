import TopBar from "@/app/dashboardComponents/TopBar";
import RoutesDetails from "./RoutesDetails";
import { Truck } from "lucide-react";

export default function RoutesPage({ params }: { params: { id: string } }) {
  const { id } = params;

  // Static structure to show van details (replace with real data if available)
  const staticVan = {
    id,
    registrationNumber: "NA-1234",
    makeAndModel: "Toyota Hiace 2020",
    seatingCapacity: 14,
    ownerName: "John Owner",
    driverName: "Mike Driver",
    status: "Pending",
  };

  return (
    <div>
      <section className="p-5 md:p-10 min-h-screen w-full">
        <TopBar heading={`View Van ${id}`} />

        <div className="mb-8">
          <div className="bg-white rounded-xl shadow-lg border border-gray-200 p-6">
            <h3 className="text-xl font-bold mb-6 flex items-center gap-3 text-[#0099cc]">
              <Truck className="h-6 w-6" />
              Van Summary
            </h3>

            <div className="grid grid-cols-1 sm:grid-cols-3 gap-x-10 gap-y-6 text-gray-700">
              {[
                { label: "Registration", value: staticVan.registrationNumber },
                { label: "Make & Model", value: staticVan.makeAndModel },
                { label: "Driver Name", value: staticVan.driverName ?? "N/A" },
                { label: "Seating Capacity", value: staticVan.seatingCapacity },

                {
                  label: "Status",
                  value: staticVan.status,
                  valueClass:
                    staticVan.status === "Active"
                      ? "text-green-600"
                      : staticVan.status === "Inactive"
                      ? "text-red-600"
                      : "text-yellow-600",
                },
                { label: "Owner", value: staticVan.ownerName },
              ].map(({ label, value, valueClass }) => (
                <div key={label} className="flex flex-col">
                  <p className="uppercase text-xs tracking-wide text-[#0099cc] mb-1 text-md font-semibold">
                    {label}
                  </p>
                  <p className={` text-md ${valueClass || "text-gray-800"}`}>
                    {value}
                  </p>
                  <div className="mt-1 h-1 w-10 bg-[#0099cc] rounded-full"></div>
                </div>
              ))}
            </div>
          </div>
        </div>

        <RoutesDetails vanId={id} />
      </section>
    </div>
  );
}
