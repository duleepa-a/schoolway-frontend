"use client";

import React, { useEffect, useState } from "react";
import { useParams } from "next/navigation";
import { User, School, MapPin, Truck, Phone, Mail, AlertCircle } from "lucide-react";
import Image from "next/image";
import Footer from "@/app/components/Footer";

interface ChildData {
  id: number;
  name: string;
  age: number;
  grade: number;
  profilePicture: string;
  pickupAddress: string;
  specialNotes?: string;
  qrCode?: string;
  School?: {
    schoolName: string;
    address: string;
  };
  Van?: {
    registrationNumber: string;
    makeAndModel: string;
    photoUrl: string;
    UserProfile_Van_assignedDriverIdToUserProfile?: {
      firstname: string;
      lastname: string;
      email: string;
      mobile: string;
      dp: string;
      DriverProfile?: {
        averageRating: number;
      };
    };
    Assistant?: {
      name: string;
      contact: string;
      nic: string;
      profilePic: string;
    };
    UserProfile?: {
      firstname: string;
      lastname: string;
      email: string;
      mobile: string;
      dp: string;
    };
  };
  UserProfile?: {
    firstname: string;
    lastname: string;
    email: string;
    mobile: string;
    dp: string;
  };
}

interface ApiResponse {
  success: boolean;
  child: ChildData;
  attendance: any;
  error?: string | null;
}

const ChildInfoPage: React.FC = () => {
  const { id } = useParams();
  const [child, setChild] = useState<ChildData | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchChild = async () => {
      try {
        const res = await fetch(`/api/child/childView/${id}`);
        const data: ApiResponse = await res.json();

        if (data.success && data.child) {
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
  const assistant = child.Van?.Assistant;
  const parent = child.UserProfile;
  const vanOwner = child.Van?.UserProfile;

  return (
    <div className="min-h-screen bg-[var(--color-background)]">
      <div className="max-w-5xl mx-auto py-8 px-4 md:px-6">
        {/* Child Profile Card with Parent Info */}
        <div
          className="rounded-2xl shadow-sm p-8 mb-6"
          style={{
            background: "var(--color-textwhite)",
            border: "1px solid #e5e7eb",
          }}
        >
          <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
            {/* Child Photo */}
            <div className="md:col-span-1 flex flex-col items-center justify-start">
              <div className="w-[140px] h-[140px] rounded-full overflow-hidden shadow-sm mb-4">
                {child.profilePicture ? (
                  <Image
                    src={child.profilePicture}
                    alt={child.name}
                    width={140}
                    height={140}
                    className="w-full h-full object-cover"
                  />
                ) : (
                  <div
                    className="w-full h-full flex items-center justify-center"
                    style={{ background: "var(--blue-shade-light)15" }}
                  >
                    <User className="w-14 h-14" style={{ color: "var(--blue-shade-dark)" }} />
                  </div>
                )}
              </div>
            </div>

            {/* Child & Parent Info */}
            <div className="md:col-span-3">
              {/* Child Info */}
              <div className="mb-6">
                <h1
                  className="text-3xl font-bold mb-1"
                  style={{ color: "var(--blue-shade-dark)" }}
                >
                  {child.name}
                </h1>
                <p
                  className="text-sm font-semibold"
                  style={{ color: "var(--color-textgreydark)" }}
                >
                  Grade {child.grade}
                </p>
              </div>

              {/* Address & School */}
              <div className="space-y-3 mb-6 pb-6 border-b" style={{ borderColor: "#e5e7eb" }}>
                <div className="flex items-start gap-3">
                  <MapPin className="w-4 h-4 flex-shrink-0 mt-1" style={{ color: "var(--blue-shade-light)" }} />
                  <div>
                    <p style={{ color: "var(--color-textgreydark)" }} className="text-xs font-semibold">
                      Pickup Address
                    </p>
                    <p style={{ color: "var(--color-textblack)" }} className="text-sm">
                      {child.pickupAddress}
                    </p>
                  </div>
                </div>

                {child.School && (
                  <div className="flex items-start gap-3">
                    <School className="w-4 h-4 flex-shrink-0 mt-1" style={{ color: "var(--green-shade-light)" }} />
                    <div>
                      <p style={{ color: "var(--color-textgreydark)" }} className="text-xs font-semibold">
                        School
                      </p>
                      <p style={{ color: "var(--color-textblack)" }} className="text-sm font-medium">
                        {child.School.schoolName}
                      </p>
                      <p style={{ color: "var(--color-textgreydark)" }} className="text-xs">
                        {child.School.address}
                      </p>
                    </div>
                  </div>
                )}
              </div>

              {/* Parent/Guardian Info - Sleek */}
              {parent && (
                <div className="flex items-center gap-4">
                  <div className="w-[80px] h-[80px] rounded-full overflow-hidden flex-shrink-0">
                    {parent.dp ? (
                      <Image
                        src={parent.dp}
                        alt={`${parent.firstname} ${parent.lastname}`}
                        width={80}
                        height={80}
                        className="w-full h-full object-cover"
                      />
                    ) : (
                      <div
                        className="w-full h-full flex items-center justify-center"
                        style={{ background: "var(--green-shade-light)15" }}
                      >
                        <User className="w-8 h-8" style={{ color: "var(--green-shade-dark)" }} />
                      </div>
                    )}
                  </div>
                  <div className="flex-grow">
                    <p style={{ color: "var(--color-textgreydark)" }} className="text-xs font-semibold mb-1">
                      PARENT / GUARDIAN
                    </p>
                    <p style={{ color: "var(--color-textblack)" }} className="font-bold text-sm mb-2">
                      {parent.firstname} {parent.lastname}
                    </p>
                    <div className="flex gap-2">
                      <a
                        href={`tel:${parent.mobile}`}
                        className="px-3 py-1 rounded text-xs font-semibold flex items-center gap-1 hover:shadow-sm transition-shadow"
                        style={{
                          background: "var(--green-shade-light)20",
                          color: "var(--green-shade-dark)",
                        }}
                      >
                        <Phone className="w-3 h-3" /> {parent.mobile}
                      </a>
                      <a
                        href={`mailto:${parent.email}`}
                        className="px-3 py-1 rounded text-xs font-semibold flex items-center gap-1 hover:shadow-sm transition-shadow"
                        style={{
                          background: "var(--green-shade-light)20",
                          color: "var(--green-shade-dark)",
                        }}
                      >
                        <Mail className="w-3 h-3" />
                      </a>
                    </div>
                  </div>
                </div>
              )}
            </div>
          </div>
        </div>

        {/* Emergency Action Required */}
        <div
          className="rounded-xl p-6 mb-8"
          style={{
            borderColor: "#fca5a5",
            background: "#fee2e2",
            border: "1px solid",
          }}
        >
          <p style={{ color: "#991b1b" }} className="font-bold mb-3 flex items-center gap-2">
            <AlertCircle className="w-5 h-5" />
            EMERGENCY ACTION REQUIRED
          </p>
          <ul style={{ color: "#991b1b" }} className="text-sm space-y-1 list-disc list-inside">
            <li>Contact the parent/guardian IMMEDIATELY</li>
            <li>If unable to reach parent, contact the driver or van assistant</li>
            <li>Contact local authorities if child is in danger or distress</li>
            <li>Do not leave the child unattended</li>
          </ul>
        </div>

        {/* Transport Information */}
        {child.Van && (
          <div
            className="rounded-2xl shadow-sm p-8 mb-8"
            style={{
              background: "var(--color-textwhite)",
              border: "1px solid #e5e7eb",
            }}
          >
            <h2
              className="text-2xl font-bold mb-6 flex items-center gap-2"
              style={{ color: "var(--blue-shade-dark)" }}
            >
              <Truck className="w-6 h-6" />
              Transport Information
            </h2>

            <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
              {/* Left Column - Van Card */}
              <div
                className="lg:col-span-1 p-5 rounded-xl hover:shadow-sm transition-shadow"
                style={{
                  background: "var(--color-background)",
                  border: "1px solid #e5e7eb",
                }}
              >
                <h3 style={{ color: "var(--blue-shade-dark)" }} className="font-bold text-sm mb-3">
                  Van Details
                </h3>
                {child.Van.photoUrl && (
                  <Image
                    src={child.Van.photoUrl}
                    alt="Van"
                    width={150}
                    height={100}
                    className="w-full h-32 object-cover rounded-lg mb-4"
                  />
                )}
                <div className="space-y-3">
                  <div>
                    <p style={{ color: "var(--color-textgreydark)" }} className="text-xs font-semibold">
                      Model
                    </p>
                    <p style={{ color: "var(--color-textblack)" }} className="text-sm font-medium">
                      {child.Van.makeAndModel}
                    </p>
                  </div>
                  <div>
                    <p style={{ color: "var(--color-textgreydark)" }} className="text-xs font-semibold">
                      Registration
                    </p>
                    <p style={{ color: "var(--color-textblack)" }} className="text-sm font-medium">
                      {child.Van.registrationNumber}
                    </p>
                  </div>

                  {/* Service Provider inside Van Card */}
                  {vanOwner && (
                    <div className="pt-4 mt-4 border-t" style={{ borderColor: "#e5e7eb" }}>
                      <p style={{ color: "var(--blue-shade-light)" }} className="text-xs font-semibold mb-2">
                        SERVICE PROVIDER
                      </p>
                      <div className="space-y-2">
                        <div>
                          <p style={{ color: "var(--color-textgreydark)" }} className="text-xs">
                            {vanOwner.firstname} {vanOwner.lastname}
                          </p>
                        </div>
                        <a
                          href={`tel:${vanOwner.mobile}`}
                          className="flex items-center gap-2 px-2 py-1 rounded text-xs font-semibold hover:shadow-sm transition-shadow w-full"
                          style={{
                            background: "var(--blue-shade-light)15",
                            color: "var(--blue-shade-light)",
                          }}
                        >
                          <Phone className="w-3 h-3 flex-shrink-0" /> 
                          <span className="truncate">{vanOwner.mobile}</span>
                        </a>
                        <a
                          href={`mailto:${vanOwner.email}`}
                          className="flex items-center gap-2 px-2 py-1 rounded text-xs font-semibold hover:shadow-sm transition-shadow w-full"
                          style={{
                            background: "var(--blue-shade-light)15",
                            color: "var(--blue-shade-light)",
                          }}
                        >
                          <Mail className="w-3 h-3 flex-shrink-0" />
                          <span className="truncate text-xs">{vanOwner.email}</span>
                        </a>
                      </div>
                    </div>
                  )}
                </div>
              </div>

              {/* Right Column - Driver & Assistant Cards (Stacked) */}
              <div className="lg:col-span-2 space-y-4">
                {/* Driver Card */}
                {driver && (
                  <div
                    className="p-4 rounded-xl hover:shadow-sm transition-shadow"
                    style={{
                      background: "var(--color-background)",
                      border: "1px solid #e5e7eb",
                    }}
                  >
                    <h3 style={{ color: "var(--green-shade-dark)" }} className="font-bold text-sm mb-3">
                      Driver
                    </h3>
                    <div className="flex items-center gap-3">
                      <div className="w-[70px] h-[70px] rounded-full overflow-hidden flex-shrink-0">
                        {driver.dp ? (
                          <Image
                            src={driver.dp}
                            alt={`${driver.firstname} ${driver.lastname}`}
                            width={70}
                            height={70}
                            className="w-full h-full object-cover"
                          />
                        ) : (
                          <div
                            className="w-full h-full flex items-center justify-center"
                            style={{ background: "var(--green-shade-light)15" }}
                          >
                            <User className="w-8 h-8" style={{ color: "var(--green-shade-dark)" }} />
                          </div>
                        )}
                      </div>
                      <div className="flex-grow">
                        <p style={{ color: "var(--color-textblack)" }} className="font-bold text-sm">
                          {driver.firstname} {driver.lastname}
                        </p>
                        <a
                          href={`tel:${driver.mobile}`}
                          className="inline-block px-2 py-0.5 rounded text-xs font-semibold mt-1"
                          style={{
                            background: "var(--green-shade-light)15",
                            color: "var(--green-shade-dark)",
                          }}
                        >
                          {driver.mobile}
                        </a>
                      </div>
                    </div>
                  </div>
                )}

                {/* Assistant Card */}
                {assistant && (
                  <div
                    className="p-4 rounded-xl hover:shadow-sm transition-shadow"
                    style={{
                      background: "var(--color-background)",
                      border: "1px solid #e5e7eb",
                    }}
                  >
                    <h3 style={{ color: "#d97706" }} className="font-bold text-sm mb-3">
                      Van Assistant
                    </h3>
                    <div className="flex items-center gap-3">
                      <div className="w-[70px] h-[70px] rounded-full overflow-hidden flex-shrink-0">
                        {assistant.profilePic ? (
                          <Image
                            src={assistant.profilePic}
                            alt={assistant.name}
                            width={70}
                            height={70}
                            className="w-full h-full object-cover"
                          />
                        ) : (
                          <div
                            className="w-full h-full flex items-center justify-center"
                            style={{ background: "#f59e0b15" }}
                          >
                            <User className="w-8 h-8" style={{ color: "#d97706" }} />
                          </div>
                        )}
                      </div>
                      <div className="flex-grow">
                        <p style={{ color: "var(--color-textblack)" }} className="font-bold text-sm">
                          {assistant.name}
                        </p>
                        <a
                          href={`tel:${assistant.contact}`}
                          className="inline-block px-2 py-0.5 rounded text-xs font-semibold mt-1"
                          style={{
                            background: "#f59e0b15",
                            color: "#d97706",
                          }}
                        >
                          {assistant.contact}
                        </a>
                      </div>
                    </div>
                  </div>
                )}
              </div>
            </div>
          </div>
        )}
      </div>

      <Footer />
    </div>
  );
};

export default ChildInfoPage;
