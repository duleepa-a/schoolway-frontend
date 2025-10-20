"use client";

import { useEffect, useState } from "react";
import { useParams } from "next/navigation";
import Image from "next/image";
import {
  MapPin,
  Phone,
  Star,
  MessageSquare,
  Truck,
  Award,
  Calendar,
  Users,
} from "lucide-react";
import Footer from "@/app/components/Footer";

interface DriverData {
  driver: {
    id: string;
    firstname: string;
    lastname: string;
    dp: string;
    mobile: string;
    address: string;
    bio: string;
    languages: string[];
    licenseType: string[];
    averageRating: number;
    totalReviews: number;
    startedDriving: string;
    reviews: Array<{
      id: string;
      rating: number;
      comment: string;
      createdAt: string;
      Child: { name: string };
    }>;
  };
  van: {
    id: number;
    registrationNumber: string;
    licensePlateNumber: string;
    makeAndModel: string;
    seatingCapacity: number;
    acCondition: boolean;
    photoUrl: string;
    averageRating: number;
    totalReviews: number;
    reviews: Array<{
      id: string;
      rating: number;
      comment: string;
      createdAt: string;
      Child: { name: string };
    }>;
  } | null;
  vanService: {
    id: string;
    serviceName: string;
    contactNo: string;
    averageRating: number;
    totalReviews: number;
  } | null;
}

export default function PublicDriverProfilePage() {
  const { id } = useParams();
  const [data, setData] = useState<DriverData | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    if (!id) return;

    const fetchDriverProfile = async () => {
      try {
        const res = await fetch(`/api/driver/public_profile?driverId=${id}`);
        const json = await res.json();

        if (!json.success) {
          setError(json.message || "Failed to fetch driver information");
        } else {
          setData(json.data);
        }
      } catch (err) {
        console.error("Fetch error:", err);
        setError("An error occurred while fetching data");
      } finally {
        setLoading(false);
      }
    };

    fetchDriverProfile();
  }, [id]);

  const renderStars = (rating: number) => {
    return (
      <div className="flex gap-1">
        {[1, 2, 3, 4, 5].map((star) => (
          <Star
            key={star}
            size={16}
            className={`${
              star <= Math.round(rating)
                ? "fill-yellow-400"
                : "fill-gray-200"
            }`}
            style={{
              color: star <= Math.round(rating) ? "#fbbf24" : "#e5e7eb",
            }}
          />
        ))}
      </div>
    );
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-screen bg-[var(--color-background)]">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary mx-auto mb-4"></div>
          <p style={{ color: "var(--color-textgreydark)" }}>
            Loading driver profile...
          </p>
        </div>
      </div>
    );
  }

  if (error || !data) {
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
              {error || "Error loading driver profile"}
            </p>
          </div>
        </div>
      </div>
    );
  }

  const { driver, van, vanService } = data;

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
              <div className="w-[120px] h-[120px] rounded-full overflow-hidden shadow-md">
                {driver?.dp ? (
                  <Image
                    src={driver.dp}
                    alt={`${driver.firstname} ${driver.lastname}`}
                    width={120}
                    height={120}
                    className="w-full h-full object-cover"
                  />
                ) : (
                  <div
                    className="w-full h-full flex items-center justify-center"
                    style={{ background: "var(--blue-shade-light)20" }}
                  >
                    <Users className="w-16 h-16" style={{ color: "var(--blue-shade-dark)" }} />
                  </div>
                )}
              </div>
            </div>

            {/* Driver Info */}
            <div className="flex-grow">
              <h1
                className="text-4xl font-bold mb-3"
                style={{ color: "var(--blue-shade-dark)" }}
              >
                {driver?.firstname} {driver?.lastname}
              </h1>

              {/* Rating */}
              <div className="flex items-center gap-3 mb-4">
                <div className="flex items-center gap-2">
                  {renderStars(driver?.averageRating || 0)}
                  <span
                    className="text-lg font-bold"
                    style={{ color: "var(--blue-shade-dark)" }}
                  >
                    {driver?.averageRating || "N/A"}
                  </span>
                </div>
                <span style={{ color: "var(--color-textgreydark)" }}>
                  ({driver?.totalReviews || 0} reviews)
                </span>
              </div>

              {/* Contact & Location */}
              <div className="space-y-2">
                {driver?.mobile && (
                  <div className="flex items-center gap-2">
                    <Phone className="w-4 h-4" style={{ color: "var(--green-shade-light)" }} />
                    <p style={{ color: "var(--color-textblack)" }}>
                      {driver.mobile}
                    </p>
                  </div>
                )}
                {driver?.address && (
                  <div className="flex items-center gap-2">
                    <MapPin className="w-4 h-4" style={{ color: "var(--green-shade-light)" }} />
                    <p style={{ color: "var(--color-textblack)" }}>
                      {driver.address}
                    </p>
                  </div>
                )}
              </div>
            </div>

            {/* Van Photo */}
            {van?.photoUrl && (
              <div className="flex-shrink-0">
                <Image
                  src={van.photoUrl}
                  alt="Van"
                  width={140}
                  height={100}
                  className="rounded-lg shadow-sm object-cover"
                />
              </div>
            )}
          </div>
        </div>

        {/* Bio Section */}
        {driver?.bio && (
          <div
            className="rounded-2xl shadow-lg p-6 mb-8"
            style={{ background: "var(--color-textwhite)" }}
          >
            <h2
              className="text-xl font-bold mb-3"
              style={{ color: "var(--blue-shade-dark)" }}
            >
              About
            </h2>
            <p style={{ color: "var(--color-textblack)" }}>{driver.bio}</p>
          </div>
        )}

        {/* Driver Details Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-8">
          {/* Experience Card */}
          {driver?.startedDriving && (
            <div
              className="rounded-2xl shadow-lg p-6"
              style={{ background: "var(--color-textwhite)" }}
            >
              <div className="flex items-center gap-3 mb-3">
                <Calendar
                  className="w-6 h-6"
                  style={{ color: "var(--blue-shade-light)" }}
                />
                <h3
                  className="text-lg font-bold"
                  style={{ color: "var(--blue-shade-dark)" }}
                >
                  Driving Experience
                </h3>
              </div>
              <p style={{ color: "var(--color-textblack)" }} className="text-sm">
                Since {new Date(driver.startedDriving).getFullYear()}
              </p>
            </div>
          )}

          {/* Languages Card */}
          {driver?.languages && driver.languages.length > 0 && (
            <div
              className="rounded-2xl shadow-lg p-6"
              style={{ background: "var(--color-textwhite)" }}
            >
              <div className="flex items-center gap-3 mb-3">
                <MessageSquare
                  className="w-6 h-6"
                  style={{ color: "var(--blue-shade-light)" }}
                />
                <h3
                  className="text-lg font-bold"
                  style={{ color: "var(--blue-shade-dark)" }}
                >
                  Languages
                </h3>
              </div>
              <div className="flex flex-wrap gap-2">
                {driver.languages.map((lang, index) => (
                  <span
                    key={index}
                    className="px-3 py-1 rounded-full text-sm font-medium"
                    style={{
                      background: "var(--blue-shade-light)20",
                      color: "var(--blue-shade-dark)",
                    }}
                  >
                    {lang}
                  </span>
                ))}
              </div>
            </div>
          )}
        </div>

        {/* Van Information */}
        {van && (
          <div
            className="rounded-2xl shadow-lg p-6 mb-8"
            style={{ background: "var(--color-textwhite)" }}
          >
            <h2
              className="text-2xl font-bold mb-6 flex items-center gap-2"
              style={{ color: "var(--blue-shade-dark)" }}
            >
              <Truck className="w-6 h-6" />
              Van Information
            </h2>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div>
                <p
                  className="text-sm font-semibold mb-2"
                  style={{ color: "var(--color-textgreydark)" }}
                >
                  Registration Number
                </p>
                <p
                  className="text-lg font-bold"
                  style={{ color: "var(--blue-shade-dark)" }}
                >
                  {van.registrationNumber}
                </p>
              </div>

              <div>
                <p
                  className="text-sm font-semibold mb-2"
                  style={{ color: "var(--color-textgreydark)" }}
                >
                  License Plate
                </p>
                <p
                  className="text-lg font-bold"
                  style={{ color: "var(--blue-shade-dark)" }}
                >
                  {van.licensePlateNumber}
                </p>
              </div>

              <div>
                <p
                  className="text-sm font-semibold mb-2"
                  style={{ color: "var(--color-textgreydark)" }}
                >
                  Make & Model
                </p>
                <p style={{ color: "var(--color-textblack)" }}>
                  {van.makeAndModel}
                </p>
              </div>

              <div>
                <p
                  className="text-sm font-semibold mb-2"
                  style={{ color: "var(--color-textgreydark)" }}
                >
                  Seating Capacity
                </p>
                <p style={{ color: "var(--color-textblack)" }}>
                  {van.seatingCapacity} seats
                </p>
              </div>

              <div>
                <p
                  className="text-sm font-semibold mb-2"
                  style={{ color: "var(--color-textgreydark)" }}
                >
                  AC Condition
                </p>
                <span
                  className="px-3 py-1 rounded-full text-sm font-semibold"
                  style={{
                    background: van.acCondition
                      ? "var(--green-shade-light)20"
                      : "var(--blue-shade-light)20",
                    color: van.acCondition
                      ? "var(--green-shade-dark)"
                      : "var(--blue-shade-dark)",
                  }}
                >
                  {van.acCondition ? "Available" : "Not Available"}
                </span>
              </div>

              <div>
                <p
                  className="text-sm font-semibold mb-2"
                  style={{ color: "var(--color-textgreydark)" }}
                >
                  Van Rating
                </p>
                <div className="flex items-center gap-2">
                  {renderStars(van.averageRating)}
                  <span
                    className="font-bold"
                    style={{ color: "var(--blue-shade-dark)" }}
                  >
                    {van.averageRating || "N/A"}
                  </span>
                  <span style={{ color: "var(--color-textgreydark)" }}>
                    ({van.totalReviews})
                  </span>
                </div>
              </div>
            </div>
          </div>
        )}

        {/* Van Service Information */}
        {vanService && (
          <div
            className="rounded-2xl shadow-lg p-6 mb-8"
            style={{ background: "var(--color-textwhite)" }}
          >
            <h2
              className="text-2xl font-bold mb-6 flex items-center gap-2"
              style={{ color: "var(--blue-shade-dark)" }}
            >
              <Award className="w-6 h-6" />
              Van Service
            </h2>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div>
                <p
                  className="text-sm font-semibold mb-2"
                  style={{ color: "var(--color-textgreydark)" }}
                >
                  Service Name
                </p>
                <p
                  className="text-lg font-bold"
                  style={{ color: "var(--blue-shade-dark)" }}
                >
                  {vanService.serviceName}
                </p>
              </div>

              <div>
                <p
                  className="text-sm font-semibold mb-2"
                  style={{ color: "var(--color-textgreydark)" }}
                >
                  Contact Number
                </p>
                <p style={{ color: "var(--color-textblack)" }}>
                  {vanService.contactNo}
                </p>
              </div>

              <div className="md:col-span-2">
                <p
                  className="text-sm font-semibold mb-2"
                  style={{ color: "var(--color-textgreydark)" }}
                >
                  Service Rating
                </p>
                <div className="flex items-center gap-2">
                  {renderStars(vanService.averageRating)}
                  <span
                    className="font-bold"
                    style={{ color: "var(--blue-shade-dark)" }}
                  >
                    {vanService.averageRating || "N/A"}
                  </span>
                  <span style={{ color: "var(--color-textgreydark)" }}>
                    ({vanService.totalReviews} reviews)
                  </span>
                </div>
              </div>
            </div>
          </div>
        )}

        {/* Driver Reviews */}
        {driver?.reviews && driver.reviews.length > 0 && (
          <div
            className="rounded-2xl shadow-lg p-6 mb-8"
            style={{ background: "var(--color-textwhite)" }}
          >
            <h2
              className="text-2xl font-bold mb-6 flex items-center gap-2"
              style={{ color: "var(--blue-shade-dark)" }}
            >
              <MessageSquare className="w-6 h-6" />
              Driver Reviews
            </h2>

            <div className="space-y-4">
              {driver.reviews.map((review) => (
                <div
                  key={review.id}
                  className="p-4 rounded-lg"
                  style={{ background: "var(--color-background)" }}
                >
                  <div className="flex justify-between items-start mb-2">
                    <p
                      className="font-semibold"
                      style={{ color: "var(--color-textblack)" }}
                    >
                      {review.Child.name}
                    </p>
                    <span style={{ color: "var(--color-textgreydark)" }}>
                      {new Date(review.createdAt).toLocaleDateString()}
                    </span>
                  </div>
                  <div className="mb-2">{renderStars(review.rating)}</div>
                  {review.comment && (
                    <p style={{ color: "var(--color-textblack)" }}>
                      {review.comment}
                    </p>
                  )}
                </div>
              ))}
            </div>
          </div>
        )}
      </div>

      <Footer />
    </div>
  );
}