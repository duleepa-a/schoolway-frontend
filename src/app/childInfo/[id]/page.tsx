"use client";

import React, { useEffect, useState } from "react";
import { useParams } from "next/navigation";
import { User, School, MapPin, Truck, Star, Phone, Mail, AlertCircle } from "lucide-react";
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
    };
    UserProfile_Van_ownerIdToUserProfile?: {
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
  const driverRating = driver?.DriverProfile?.averageRating || 0;
  const assistant = child.Van?.Assistant;
  const parent = child.UserProfile;
  const vanOwner = child.Van?.UserProfile_Van_ownerIdToUserProfile;

  return (
    <div className="min-h-screen bg-[var(--color-background)]">
      <div className="max-w-5xl mx-auto py-8 px-4 md:px-6">
        {/* Emergency Alert Banner */}
        <div
          className="rounded-xl border-2 p-4 mb-8 flex items-start gap-3"
          style={{
            borderColor: "#fca5a5",
            background: "#fee2e2",
          }}
        >
          <AlertCircle className="w-6 h-6 flex-shrink-0 mt-0.5" style={{ color: "#991b1b" }} />
          <div>
            <p style={{ color: "#991b1b" }} className="font-bold mb-1">
              Child Information Card
            </p>
            <p style={{ color: "#991b1b" }} className="text-sm">
              If you found this child or have information about them, please contact the parent or guardian immediately.
            </p>
          </div>
        </div>

        {/* Child Profile Card */}
        <div
          className="rounded-2xl shadow-lg p-8 mb-8"
          style={{ background: "var(--color-textwhite)" }}
        >
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {/* Child Photo & QR Code */}
            <div className="flex flex-col items-center">
              <div className="w-[150px] h-[150px] rounded-full overflow-hidden shadow-lg mb-4">
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
              {child.qrCode && (
                <div className="p-3 bg-white border-2 rounded-lg" style={{ borderColor: "var(--blue-shade-light)" }}>
                  <img src={child.qrCode} alt="QR Code" width={120} height={120} className="rounded" />
                </div>
              )}
            </div>

            {/* Child Info */}
            <div className="md:col-span-2">
              <h1
                className="text-4xl font-bold mb-3"
                style={{ color: "var(--blue-shade-dark)" }}
              >
                {child.name}
              </h1>
              <div className="flex flex-wrap gap-3 mb-6">
                <span
                  className="px-4 py-2 rounded-full font-semibold text-sm"
                  style={{
                    background: "var(--blue-shade-light)20",
                    color: "var(--blue-shade-dark)",
                  }}
                >
                  Age: {child.age}
                </span>
                <span
                  className="px-4 py-2 rounded-full font-semibold text-sm"
                  style={{
                    background: "var(--blue-shade-light)20",
                    color: "var(--blue-shade-dark)",
                  }}
                >
                  Grade: {child.grade}
                </span>
                {child.specialNotes && (
                  <span
                    className="px-4 py-2 rounded-full font-semibold text-sm"
                    style={{
                      background: "var(--green-shade-light)20",
                      color: "var(--green-shade-dark)",
                    }}
                  >
                    {child.specialNotes}
                  </span>
                )}
              </div>

              {/* Address */}
              <div className="space-y-3">
                <div className="flex items-start gap-3">
                  <MapPin className="w-5 h-5 flex-shrink-0 mt-1" style={{ color: "var(--blue-shade-light)" }} />
                  <div>
                    <p style={{ color: "var(--color-textgreydark)" }} className="text-xs font-semibold mb-1">
                      Pickup Address
                    </p>
                    <p style={{ color: "var(--color-textblack)" }} className="font-medium">
                      {child.pickupAddress}
                    </p>
                  </div>
                </div>

                {child.School && (
                  <div className="flex items-start gap-3">
                    <School className="w-5 h-5 flex-shrink-0 mt-1" style={{ color: "var(--green-shade-light)" }} />
                    <div>
                      <p style={{ color: "var(--color-textgreydark)" }} className="text-xs font-semibold mb-1">
                        School
                      </p>
                      <p style={{ color: "var(--color-textblack)" }} className="font-medium">
                        {child.School.schoolName}
                      </p>
                      <p style={{ color: "var(--color-textgreydark)" }} className="text-sm">
                        {child.School.address}
                      </p>
                    </div>
                  </div>
                )}
              </div>
            </div>
          </div>
        </div>

        {/* Parent/Guardian Contact - PRIMARY */}
        {parent && (
          <div
            className="rounded-2xl shadow-lg p-8 mb-8 border-4"
            style={{
              background: "var(--color-textwhite)",
              borderColor: "var(--green-shade-light)",
            }}
          >
            <div className="flex items-center gap-3 mb-6">
              <div
                className="p-2 rounded-full"
                style={{ background: "var(--green-shade-light)20" }}
              >
                <Phone className="w-6 h-6" style={{ color: "var(--green-shade-dark)" }} />
              </div>
              <h2
                className="text-2xl font-bold"
                style={{ color: "var(--green-shade-dark)" }}
              >
                Parent / Guardian (PRIMARY CONTACT)
              </h2>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              {/* Photo */}
              <div className="flex flex-col items-center">
                <div className="w-[120px] h-[120px] rounded-full overflow-hidden shadow-lg mb-3">
                  {parent.dp ? (
                    <Image
                      src={parent.dp}
                      alt={`${parent.firstname} ${parent.lastname}`}
                      width={120}
                      height={120}
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
                <p style={{ color: "var(--color-textblack)" }} className="font-bold text-center">
                  {parent.firstname} {parent.lastname}
                </p>
              </div>

              {/* Contact Info */}
              <div className="md:col-span-2 space-y-4">
                <a
                  href={`tel:${parent.mobile}`}
                  className="flex items-center gap-4 p-4 rounded-lg hover:shadow-md transition-shadow cursor-pointer"
                  style={{
                    background: "var(--color-background)",
                    borderLeft: "4px solid var(--green-shade-light)",
                  }}
                >
                  <Phone className="w-6 h-6 flex-shrink-0" style={{ color: "var(--green-shade-light)" }} />
                  <div>
                    <p style={{ color: "var(--color-textgreydark)" }} className="text-xs font-semibold">
                      Phone
                    </p>
                    <p style={{ color: "var(--color-textblack)" }} className="font-bold text-lg">
                      {parent.mobile}
                    </p>
                  </div>
                </a>

                <a
                  href={`mailto:${parent.email}`}
                  className="flex items-center gap-4 p-4 rounded-lg hover:shadow-md transition-shadow cursor-pointer"
                  style={{
                    background: "var(--color-background)",
                    borderLeft: "4px solid var(--green-shade-light)",
                  }}
                >
                  <Mail className="w-6 h-6 flex-shrink-0" style={{ color: "var(--green-shade-light)" }} />
                  <div>
                    <p style={{ color: "var(--color-textgreydark)" }} className="text-xs font-semibold">
                      Email
                    </p>
                    <p style={{ color: "var(--color-textblack)" }} className="font-bold break-all">
                      {parent.email}
                    </p>
                  </div>
                </a>
              </div>
            </div>
          </div>
        )}

        {/* Transport Details */}
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
              Transport Information
            </h2>

            {/* Van Card */}
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 mb-6">
              <div
                className="p-6 rounded-xl border-2"
                style={{
                  borderColor: "var(--blue-shade-light)",
                  background: "var(--color-background)",
                }}
              >
                <h3 style={{ color: "var(--blue-shade-dark)" }} className="font-bold text-lg mb-4">
                  Van Details
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
                <div className="space-y-2">
                  <div>
                    <p style={{ color: "var(--color-textgreydark)" }} className="text-xs font-semibold">
                      Model
                    </p>
                    <p style={{ color: "var(--color-textblack)" }} className="font-bold">
                      {child.Van.makeAndModel}
                    </p>
                  </div>
                  <div>
                    <p style={{ color: "var(--color-textgreydark)" }} className="text-xs font-semibold">
                      Registration Number
                    </p>
                    <p style={{ color: "var(--color-textblack)" }} className="font-bold">
                      {child.Van.registrationNumber}
                    </p>
                  </div>
                </div>
              </div>

              {/* Driver Card */}
              {driver && (
                <div
                  className="p-6 rounded-xl border-2"
                  style={{
                    borderColor: "var(--green-shade-light)",
                    background: "var(--color-background)",
                  }}
                >
                  <h3 style={{ color: "var(--green-shade-dark)" }} className="font-bold text-lg mb-4">
                    Driver
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
                  <div className="text-center space-y-2">
                    <p style={{ color: "var(--color-textblack)" }} className="font-bold">
                      {driver.firstname} {driver.lastname}
                    </p>
                    {driverRating > 0 && (
                      <div className="flex items-center justify-center gap-1">
                        <Star className="w-4 h-4 fill-yellow-400" style={{ color: "#fbbf24" }} />
                        <span style={{ color: "var(--color-textblack)" }} className="font-medium text-sm">
                          {driverRating.toFixed(1)} Rating
                        </span>
                      </div>
                    )}
                    <a
                      href={`tel:${driver.mobile}`}
                      className="inline-block mt-2 px-3 py-1 rounded text-sm font-semibold"
                      style={{
                        background: "var(--green-shade-light)20",
                        color: "var(--green-shade-dark)",
                      }}
                    >
                      {driver.mobile}
                    </a>
                  </div>
                </div>
              )}

              {/* Assistant Card (if exists) */}
              {assistant && (
                <div
                  className="p-6 rounded-xl border-2"
                  style={{
                    borderColor: "#f59e0b",
                    background: "var(--color-background)",
                  }}
                >
                  <h3 style={{ color: "#d97706" }} className="font-bold text-lg mb-4">
                    Van Assistant
                  </h3>
                  <div className="space-y-3">
                    <div>
                      <p style={{ color: "var(--color-textgreydark)" }} className="text-xs font-semibold">
                        Name
                      </p>
                      <p style={{ color: "var(--color-textblack)" }} className="font-bold">
                        {assistant.name}
                      </p>
                    </div>
                    <a
                      href={`tel:${assistant.contact}`}
                      className="flex items-center gap-2 px-3 py-2 rounded text-sm font-semibold"
                      style={{
                        background: "#f59e0b20",
                        color: "#d97706",
                      }}
                    >
                      <Phone className="w-4 h-4" />
                      {assistant.contact}
                    </a>
                  </div>
                </div>
              )}
            </div>

            {/* Van Owner (Service Provider) */}
            {vanOwner && (
              <div
                className="p-6 rounded-xl border-2"
                style={{
                  borderColor: "var(--blue-shade-light)30",
                  background: "var(--color-background)",
                }}
              >
                <h3 style={{ color: "var(--color-textgreydark)" }} className="font-bold text-base mb-4">
                  Service Provider Contact
                </h3>
                <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                  <div>
                    <p style={{ color: "var(--color-textgreydark)" }} className="text-xs font-semibold mb-1">
                      Name
                    </p>
                    <p style={{ color: "var(--color-textblack)" }} className="font-medium">
                      {vanOwner.firstname} {vanOwner.lastname}
                    </p>
                  </div>
                  <a
                    href={`tel:${vanOwner.mobile}`}
                    className="flex items-center gap-2 p-2 rounded cursor-pointer hover:shadow-md transition-shadow"
                    style={{ background: "var(--blue-shade-light)10" }}
                  >
                    <Phone className="w-4 h-4" style={{ color: "var(--blue-shade-light)" }} />
                    <p style={{ color: "var(--color-textblack)" }} className="font-medium text-sm">
                      {vanOwner.mobile}
                    </p>
                  </a>
                  <a
                    href={`mailto:${vanOwner.email}`}
                    className="flex items-center gap-2 p-2 rounded cursor-pointer hover:shadow-md transition-shadow"
                    style={{ background: "var(--blue-shade-light)10" }}
                  >
                    <Mail className="w-4 h-4" style={{ color: "var(--blue-shade-light)" }} />
                    <p style={{ color: "var(--color-textblack)" }} className="font-medium text-sm break-all">
                      {vanOwner.email}
                    </p>
                  </a>
                </div>
              </div>
            )}
          </div>
        )}

        {/* Important Notice */}
        <div
          className="rounded-xl border-2 p-6 mb-8"
          style={{
            borderColor: "#fca5a5",
            background: "#fee2e2",
          }}
        >
          <p style={{ color: "#991b1b" }} className="font-bold mb-2">
            🚨 EMERGENCY ACTION REQUIRED
          </p>
          <ul style={{ color: "#991b1b" }} className="text-sm space-y-1 list-disc list-inside">
            <li>Contact the parent/guardian IMMEDIATELY</li>
            <li>If unable to reach parent, contact the driver or van assistant</li>
            <li>Contact local authorities if child is in danger or distress</li>
            <li>Do not leave the child unattended</li>
          </ul>
        </div>
      </div>

      <Footer />
    </div>
  );
};

export default ChildInfoPage;
