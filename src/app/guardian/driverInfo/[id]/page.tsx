"use client";

import { useEffect, useState } from "react";
import { useParams } from "next/navigation";
import Image from "next/image";

export default function DriverInfoPage() {
  const { id} = useParams();
  const driverId  = id;
  const [data, setData] = useState<any>(null);
  const [loading, setLoading] = useState(true);

  console.log(driverId)

  useEffect(() => {
    
    console.log("hello");
    console.log(driverId);

    if (!driverId) return;

    const fetchData = async () => {
      try {

        const res = await fetch(`/api/guardian/driver/${driverId}`);
        const json = await res.json();
        setData(json);
      } catch (err) {
        console.error("Fetch error:", err);
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, [driverId]);

  if (loading) return <p className="text-center py-8">Loading...</p>;
  if (!data?.success)
    return <p className="text-center py-8 text-red-500">{data?.message || "Error"}</p>;

  const { driver, van, students } = data;

  return (
    <div className="max-w-4xl mx-auto py-10 px-6">
      <div className="flex items-center gap-4 mb-8 border-b pb-4">
        {driver?.dp ? (
          <Image
            src={driver.dp}
            alt="Driver"
            width={70}
            height={70}
            className="rounded-full border shadow-sm"
          />
        ) : (
          <div className="w-[70px] h-[70px] rounded-full bg-gray-200 flex items-center justify-center text-gray-500 text-sm">
            No Photo
          </div>
        )}
        <div>
          <h1 className="text-2xl font-semibold text-gray-800">
            {driver?.firstname} {driver?.lastname}
          </h1>
          <p className="text-sm text-gray-600">
            <strong>Van:</strong> {van?.makeAndModel} ({van?.registrationNumber})
          </p>
        </div>
      </div>

      <h2 className="text-xl font-semibold mb-4 text-gray-700">
        Students for Evening Drop-off ({students?.length || 0})
      </h2>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {students?.map((child: any) => (
          <div
            key={child.id}
            className="border rounded-lg shadow-sm p-4 flex flex-col items-center bg-white"
          >
            {child.profilePicture ? (
              <Image
                src={child.profilePicture}
                alt={child.name}
                width={100}
                height={100}
                className="rounded-full border mb-3"
              />
            ) : (
              <div className="w-[100px] h-[100px] rounded-full bg-gray-200 mb-3 flex items-center justify-center text-gray-500 text-sm">
                No Photo
              </div>
            )}
            <h3 className="text-lg font-medium">{child.name}</h3>
            <p className="text-sm text-gray-500 mb-1">Grade {child.grade}</p>
            <p className="text-sm text-gray-600">Gate: {child.gate}</p>
            <p className="text-sm text-gray-600">Pickup: {child.pickupAddress}</p>
          </div>
        ))}
      </div>
    </div>
  );
}
