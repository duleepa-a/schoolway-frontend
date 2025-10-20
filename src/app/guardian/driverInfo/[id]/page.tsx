"use client";

import { useEffect, useState } from "react";
import { useParams } from "next/navigation";
import { useRouter } from "next/navigation";
import Image from "next/image";
import { MapPin, Users, Truck, ArrowRight } from "lucide-react";
import Footer from "@/app/components/Footer";

export default function DriverInfoPage() {
  const { id } = useParams();
  const router = useRouter();
  const driverId = id;
  const [data, setData] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    if (!driverId) return;

    const fetchData = async () => {
      try {
        const res = await fetch(`/api/guardian/driver/${driverId}`);
        const json = await res.json();

        if (!json.success) {
          // Check if it's an authorization error
          if (res.status === 401) {
            // Redirect to public driver profile
            router.push(`/driver-profile/${driverId}`);
            return;
          }
          setError(json.message || "Failed to fetch driver information");
        } else {
          setData(json);
        }
      } catch (err) {
        console.error("Fetch error:", err);
        setError("An error occurred while fetching data");
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, [driverId, router]);

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-screen bg-[var(--color-background)]">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary mx-auto mb-4"></div>
          <p style={{ color: "var(--color-textgreydark)" }} className="text-sm">
            Loading driver information...
          </p>
        </div>
      </div>
    );
  }

  if (error || !data?.success) {
    return (
      <div className="min-h-screen bg-[var(--color-background)]">
        <div className="max-w-4xl mx-auto py-10 px-6">
          <div
            className="rounded-lg p-6 text-center"
            style={{
              background: "#fee2e2",
              borderColor: "#fca5a5",
              border: "1px solid",
            }}
          >
            <p style={{ color: "#991b1b" }} className="font-medium text-sm">
              {error || data?.message || "Error loading data"}
            </p>
          </div>
        </div>
      </div>
    );
  }

  const { driver, van, students } = data;

  return (
    <div className="min-h-screen bg-[var(--color-background)]">
      <div className="max-w-5xl mx-auto py-8 px-4 md:px-6">
        {/* Driver Header Card */}
        <div
          className="rounded-2xl shadow-lg p-6 mb-8"
          style={{ background: "var(--color-textwhite)" }}
        >
          <div className="flex flex-col md:flex-row items-start md:items-center gap-6">
            {/* Driver Photo */}
            <div className="flex-shrink-0">
              <div className="w-[100px] h-[100px] rounded-full overflow-hidden shadow-md flex-shrink-0">
                {driver?.dp ? (
                  <Image
                    src={driver.dp}
                    alt={`${driver.firstname} ${driver.lastname}`}
                    width={100}
                    height={100}
                    className="w-full h-full object-cover"
                  />
                ) : (
                  <div
                    className="w-full h-full flex items-center justify-center"
                    style={{ background: "var(--blue-shade-light)20" }}
                  >
                    <Users className="w-12 h-12" style={{ color: "var(--blue-shade-dark)" }} />
                  </div>
                )}
              </div>
            </div>

            {/* Driver Info */}
            <div className="flex-grow">
              <h1
                className="text-3xl font-bold mb-3"
                style={{ color: "var(--blue-shade-dark)" }}
              >
                {driver?.firstname} {driver?.lastname}
              </h1>
              <div className="flex flex-wrap gap-4">
                <div className="flex items-center gap-2">
                  <Truck className="w-5 h-5" style={{ color: "var(--blue-shade-light)" }} />
                  <div>
                    <p
                      className="text-sm font-medium"
                      style={{ color: "var(--color-textblack)" }}
                    >
                      {van?.makeAndModel}
                    </p>
                    <p
                      className="text-xs"
                      style={{ color: "var(--color-textgreydark)" }}
                    >
                      {van?.registrationNumber}
                    </p>
                  </div>
                </div>
              </div>
            </div>

            {/* Van Photo */}
            {van?.photoUrl && (
              <div className="flex-shrink-0">
                <Image
                  src={van.photoUrl}
                  alt="Van"
                  width={120}
                  height={80}
                  className="rounded-lg shadow-sm object-cover"
                />
              </div>
            )}
          </div>
        </div>

        {/* Today's Pickups Section */}
        <div
          className="rounded-2xl shadow-lg p-6"
          style={{ background: "var(--color-textwhite)" }}
        >
          <h2
            className="text-2xl font-bold mb-6 flex items-center gap-2"
            style={{ color: "var(--blue-shade-dark)" }}
          >
            <Users className="w-6 h-6" />
            Today's Pickups
          </h2>

          {students && students.length > 0 ? (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">
              {students.map((child: any, index: number) => (
                <div
                  key={child.id}
                  className="rounded-xl border-2 overflow-hidden hover:shadow-lg transition-shadow flex flex-col"
                  style={{
                    borderColor: "var(--blue-shade-light)",
                    background: "var(--color-background)",
                  }}
                >
                  <div className="p-5 flex-grow">
                    {/* Student Photo */}
                    <div className="flex justify-center mb-4">
                      <div className="w-[90px] h-[90px] rounded-full overflow-hidden flex-shrink-0">
                        {child.profilePicture ? (
                          <Image
                            src={child.profilePicture}
                            alt={child.name}
                            width={90}
                            height={90}
                            className="w-full h-full object-cover"
                          />
                        ) : (
                          <div
                            className="w-full h-full flex items-center justify-center"
                            style={{
                              background: "var(--green-shade-light)20",
                            }}
                          >
                            <Users
                              className="w-10 h-10"
                              style={{ color: "var(--green-shade-dark)" }}
                            />
                          </div>
                        )}
                      </div>
                    </div>

                    {/* Student Info */}
                    <div className="text-center mb-4">
                      <h3
                        className="text-lg font-bold mb-1"
                        style={{ color: "var(--color-textblack)" }}
                      >
                        {child.name}
                      </h3>
                      <div className="flex items-center justify-center gap-2 flex-wrap">
                        <span
                          className="px-3 py-1 rounded-full text-xs font-semibold"
                          style={{
                            background: "var(--blue-shade-light)20",
                            color: "var(--blue-shade-dark)",
                          }}
                        >
                          Grade {child.grade}
                        </span>
                        <span
                          className="px-3 py-1 rounded-full text-xs font-semibold"
                          style={{
                            background: "var(--green-shade-light)20",
                            color: "var(--green-shade-dark)",
                          }}
                        >
                          #{index + 1}
                        </span>
                      </div>
                    </div>

                    {/* Home Address and Gate */}
                    <div
                      className="space-y-3 pt-4 border-t"
                      style={{ borderColor: "var(--blue-shade-light)30" }}
                    >
                      <div className="flex items-start gap-3">
                        <MapPin
                          className="w-5 h-5 flex-shrink-0 mt-1"
                          style={{ color: "var(--green-shade-light)" }}
                        />
                        <div className="flex-1">
                          <p
                            className="text-xs font-semibold mb-1"
                            style={{ color: "var(--color-textgreydark)" }}
                          >
                            Home Address
                          </p>
                          <p
                            className="text-sm font-medium"
                            style={{ color: "var(--color-textblack)" }}
                          >
                            {child.pickupAddress}
                          </p>
                        </div>
                      </div>
                      <div className="flex items-start gap-3">
                        <MapPin
                          className="w-5 h-5 flex-shrink-0 mt-1"
                          style={{ color: "var(--blue-shade-light)" }}
                        />
                        <div className="flex-1">
                          <p
                            className="text-xs font-semibold mb-1"
                            style={{ color: "var(--color-textgreydark)" }}
                          >
                            Gate
                          </p>
                          <p
                            className="text-sm font-medium"
                            style={{ color: "var(--color-textblack)" }}
                          >
                            {child.gate}
                          </p>
                        </div>
                      </div>
                    </div>
                  </div>

                  {/* View More Button */}
                  <div className="px-5 pb-5 pt-0">
                    <button
                      onClick={() => router.push(`/childInfo/${child.id}`)}
                      className="w-full py-2 px-4 rounded-lg font-semibold transition-all flex items-center justify-center gap-2 hover:gap-3"
                      style={{
                        background: "linear-gradient(90deg, var(--blue-shade-dark) 0%, var(--blue-shade-light) 60%, var(--green-shade-light) 100%)",
                        color: "var(--color-textwhite)",
                        border: "none",
                      }}
                    >
                      View More Info
                      <ArrowRight className="w-4 h-4" />
                    </button>
                  </div>
                </div>
              ))}
            </div>
          ) : (
            <div className="text-center py-12">
              <Users className="w-12 h-12 mx-auto mb-3" style={{ color: "var(--color-textgreydark)30" }} />
              <p style={{ color: "var(--color-textgreydark)" }} className="font-medium text-sm">
                No pickups scheduled for today
              </p>
            </div>
          )}
        </div>
      </div>

      <Footer />
    </div>
  );
}
