"use client";

import React, { useEffect, useState } from "react";
import { useParams } from "next/navigation";
import { User, School, MapPin, Clock, Truck, Star } from "lucide-react";
import Image from "next/image";
import Footer from "@/app/components/Footer";

interface ChildData {
  id: number;
  name: string;
  age: number;
  grade: number;
  schoolStartTime: string;
  schoolEndTime: string;
  profilePicture: string;
  pickupAddress: string;
  specialNotes?: string;
  School?: {
    schoolName: string;
  };
  Van?: {
    registrationNumber: string;
    makeAndModel: string;
    photoUrl: string;
    UserProfile_Van_assignedDriverIdToUserProfile?: {
      firstname: string;
      lastname: string;
      dp: string;
      DriverProfile?: {
        averageRating: number;
      };
    };
  };
  UserProfile?: {
    firstname: string;
    lastname: string;
  };
}

interface ApiResponse {
  success: boolean;
  child: ChildData;
  attendance: any;
}

const ChildInfoPage: React.FC = () => {
  const { id } = useParams();
  const [child, setChild] = useState<ChildData | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchChild = async () => {
      try {
        console.log(`Fetching child data for ID: ${id}`);
        const res = await fetch(`/api/child/childView/${id}`);
        const data: ApiResponse = await res.json();

        console.log("API Response:", data);

        if (data.success && data.child) {
          console.log("Setting child data:", data.child);
          setChild(data.child);
        } else {
          setError(data.error || "Failed to fetch child info");
        }
      } catch (err) {
        console.error("Error fetching child info:", err);
        setError("An error occurred while fetching data");
      } finally {
        setLoading(false);
      }
    };

    if (id) {
      fetchChild();
    }
  }, [id]);

  if (loading) {
    return (
      <div className="flex justify-center items-center min-h-screen bg-[var(--color-background)]">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary mx-auto mb-4"></div>
          <p style={{ color: "var(--color-textgreydark)" }}>
            Loading child information...
          </p>
        </div>
      </div>
    );
  }

  if (error || !child) {
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
            <p style={{ color: "#991b1b" }} className="font-medium">
              {error || "Child not found."}
            </p>
          </div>
        </div>
      </div>
    );
  }

  const driver = child.Van?.UserProfile_Van_assignedDriverIdToUserProfile;
  const driverRating = driver?.DriverProfile?.averageRating || 0;

  return (
    <div className="min-h-screen bg-[var(--color-background)]">
      <div className="max-w-5xl mx-auto py-8 px-4 md:px-6">
        {/* Child Profile Card */}
        <div
          className="rounded-2xl shadow-lg p-8 mb-8"
          style={{ background: "var(--color-textwhite)" }}
        >
          {/* Profile Picture */}
          <div className="flex justify-center mb-6">
            <div className="w-[150px] h-[150px] rounded-full overflow-hidden shadow-lg">
              {child.profilePicture ? (
                <Image
                  src={child.profilePicture}
                  alt={child.name}
                  width={150}
                  height={150}
                  className="w-full h-full object-cover"
                />
              ) : (
                <div
                  className="w-full h-full flex items-center justify-center"
                  style={{ background: "var(--blue-shade-light)20" }}
                >
                  <User className="w-16 h-16" style={{ color: "var(--blue-shade-dark)" }} />
                </div>
              )}
            </div>
          </div>

          {/* Child Info */}
          <div className="text-center mb-8">
            <h1
              className="text-4xl font-bold mb-2"
              style={{ color: "var(--blue-shade-dark)" }}
            >
              {child.name}
            </h1>
            <p style={{ color: "var(--color-textgreydark)" }} className="text-sm mb-4">
              Grade {child.grade} | Age {child.age}
            </p>
            {child.specialNotes && (
              <div
                className="inline-block px-4 py-2 rounded-full text-sm font-semibold"
                style={{
                  background: "var(--green-shade-light)20",
                  color: "var(--green-shade-dark)",
                }}
              >
                {child.specialNotes}
              </div>
            )}
          </div>

          {/* Details Grid */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-8">
            <div
              className="flex items-start gap-4 p-4 rounded-lg"
              style={{ background: "var(--color-background)" }}
            >
              <School className="w-6 h-6 flex-shrink-0" style={{ color: "var(--blue-shade-light)" }} />
              <div>
                <p style={{ color: "var(--color-textgreydark)" }} className="text-xs font-semibold mb-1">
                  School
                </p>
                <p style={{ color: "var(--color-textblack)" }} className="font-medium">
                  {child.School?.schoolName || "N/A"}
                </p>
              </div>
            </div>

            <div
              className="flex items-start gap-4 p-4 rounded-lg"
              style={{ background: "var(--color-background)" }}
            >
              <Clock className="w-6 h-6 flex-shrink-0" style={{ color: "var(--green-shade-light)" }} />
              <div>
                <p style={{ color: "var(--color-textgreydark)" }} className="text-xs font-semibold mb-1">
                  School Hours
                </p>
                <p style={{ color: "var(--color-textblack)" }} className="font-medium">
                  {child.schoolStartTime} - {child.schoolEndTime}
                </p>
              </div>
            </div>

            <div
              className="flex items-start gap-4 p-4 rounded-lg md:col-span-2"
              style={{ background: "var(--color-background)" }}
            >
              <MapPin className="w-6 h-6 flex-shrink-0" style={{ color: "var(--blue-shade-light)" }} />
              <div>
                <p style={{ color: "var(--color-textgreydark)" }} className="text-xs font-semibold mb-1">
                  Pickup Address
                </p>
                <p style={{ color: "var(--color-textblack)" }} className="font-medium">
                  {child.pickupAddress}
                </p>
              </div>
            </div>
          </div>
        </div>

        {/* Van & Driver Info */}
        {child.Van && (
          <div
            className="rounded-2xl shadow-lg p-8 mb-8"
            style={{ background: "var(--color-textwhite)" }}
          >
            <h2
              className="text-2xl font-bold mb-6 flex items-center gap-2"
              style={{ color: "var(--blue-shade-dark)" }}
            >
              <Truck className="w-6 h-6" />
              Transport Details
            </h2>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
              {/* Van Info */}
              <div
                className="p-6 rounded-xl border-2"
                style={{
                  borderColor: "var(--blue-shade-light)",
                  background: "var(--color-background)",
                }}
              >
                <h3 style={{ color: "var(--blue-shade-dark)" }} className="font-bold text-lg mb-4">
                  Van Information
                </h3>
                {child.Van.photoUrl && (
                  <Image
                    src={child.Van.photoUrl}
                    alt="Van"
                    width={200}
                    height={150}
                    className="w-full h-40 object-cover rounded-lg mb-4"
                  />
                )}
                <div className="space-y-3">
                  <div>
                    <p style={{ color: "var(--color-textgreydark)" }} className="text-xs font-semibold">
                      Model
                    </p>
                    <p style={{ color: "var(--color-textblack)" }} className="font-medium">
                      {child.Van.makeAndModel}
                    </p>
                  </div>
                  <div>
                    <p style={{ color: "var(--color-textgreydark)" }} className="text-xs font-semibold">
                      Registration Number
                    </p>
                    <p style={{ color: "var(--color-textblack)" }} className="font-medium">
                      {child.Van.registrationNumber}
                    </p>
                  </div>
                </div>
              </div>

              {/* Driver Info */}
              {driver && (
                <div
                  className="p-6 rounded-xl border-2"
                  style={{
                    borderColor: "var(--green-shade-light)",
                    background: "var(--color-background)",
                  }}
                >
                  <h3 style={{ color: "var(--green-shade-dark)" }} className="font-bold text-lg mb-4">
                    Driver Information
                  </h3>
                  <div className="flex justify-center mb-4">
                    <div className="w-[100px] h-[100px] rounded-full overflow-hidden">
                      {driver.dp ? (
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
                          style={{ background: "var(--green-shade-light)20" }}
                        >
                          <User className="w-12 h-12" style={{ color: "var(--green-shade-dark)" }} />
                        </div>
                      )}
                    </div>
                  </div>
                  <div className="text-center space-y-3">
                    <div>
                      <p style={{ color: "var(--color-textblack)" }} className="font-bold text-lg">
                        {driver.firstname} {driver.lastname}
                      </p>
                    </div>
                    {driverRating > 0 && (
                      <div className="flex items-center justify-center gap-1">
                        <Star className="w-4 h-4 fill-yellow-400" style={{ color: "var(--green-shade-light)" }} />
                        <span style={{ color: "var(--color-textblack)" }} className="font-medium">
                          {driverRating.toFixed(1)}
                        </span>
                      </div>
                    )}
                  </div>
                </div>
              )}
            </div>
          </div>
        )}

        {/* Safety Notice */}
        <div
          className="rounded-xl border-2 p-6 mb-8"
          style={{
            borderColor: "#fca5a5",
            background: "#fee2e2",
          }}
        >
          <p style={{ color: "#991b1b" }} className="font-medium text-center">
            ⚠️ If this child seems to be in distress or needs help, please contact
            the nearest authority or their registered guardian immediately.
          </p>
        </div>
      </div>

      <Footer />
    </div>
  );
};

export default ChildInfoPage;
