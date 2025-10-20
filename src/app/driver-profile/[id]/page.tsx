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
  Zap,
  Languages,
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

  const renderStars = (rating: number, size: number = 16) => {
    return (
      <div className="flex gap-1">
        {[1, 2, 3, 4, 5].map((star) => (
          <Star
            key={star}
            size={size}
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
          <p style={{ color: "var(--color-textgreydark)" }} className="text-sm">
            Loading driver profile...
          </p>
        </div>
      </div>
    );
  }

  if (error || !data) {
    return (
      <div className="min-h-screen bg-[var(--color-background)]">
        <div className="max-w-5xl mx-auto py-10 px-6">
          <div
            className="rounded-lg p-6 text-center"
            style={{
              background: "#fee2e2",
              borderColor: "#fca5a5",
              border: "1px solid",
            }}
          >
            <p style={{ color: "#991b1b" }} className="font-medium text-sm">
              {error || "Error loading driver profile"}
            </p>
          </div>
        </div>
      </div>
    );
  }

  const { driver, van, vanService } = data;
  const yearsExperience = driver?.startedDriving
    ? new Date().getFullYear() - new Date(driver.startedDriving).getFullYear()
    : 0;

  return (
    <div className="min-h-screen bg-[var(--color-background)]">
      <div className="max-w-5xl mx-auto py-8 px-4 md:px-6">
        {/* Hero Header Card */}
        <div
          className="shadow-lg p-6 md:p-8 mb-6 relative overflow-hidden"
          style={{
            background: "linear-gradient(135deg, var(--blue-shade-dark) 0%, var(--blue-shade-light) 100%)",
            borderRadius: "90px",
          }}
        >
          {/* Background Accent */}
          <div
            className="absolute top-0 right-0 w-96 h-96 opacity-10 rounded-full"
            style={{ background: "var(--color-textwhite)" }}
          />

          <div className="relative z-10">
            <div className="flex flex-col md:flex-row items-start md:items-end gap-4 md:gap-6">
              {/* Driver Photo */}
              <div className="flex-shrink-0">
                <div
                  className="w-[110px] h-[110px] overflow-hidden shadow-lg border-4 border-white"
                  style={{ borderRadius: "50%" }}
                >
                  {driver?.dp ? (
                    <Image
                      src={driver.dp}
                      alt={`${driver.firstname} ${driver.lastname}`}
                      width={110}
                      height={110}
                      className="w-full h-full object-cover"
                    />
                  ) : (
                    <div
                      className="w-full h-full flex items-center justify-center"
                      style={{ background: "var(--blue-shade-light)40" }}
                    >
                      <Users className="w-14 h-14 text-white" />
                    </div>
                  )}
                </div>
              </div>

              {/* Driver Name & Rating */}
              <div className="flex-grow">
                <h1 className="text-3xl md:text-4xl font-bold text-white mb-2">
                  {driver?.firstname} {driver?.lastname}
                </h1>

                {/* Rating Badge */}
                <div className="flex items-center gap-2">
                  <div className="flex items-center gap-1">
                    {renderStars(driver?.averageRating || 0, 16)}
                  </div>
                  <span className="text-white text-base font-bold">
                    {driver?.averageRating || "N/A"}
                  </span>
                  <span className="text-white text-opacity-80 text-sm">
                    ({driver?.totalReviews} reviews)
                  </span>
                </div>
              </div>

              {/* Van Photo - Side */}
              {/* {van?.photoUrl && (
                <div className="flex-shrink-0 hidden lg:block">
                  <Image
                    src={van.photoUrl}
                    alt="Van"
                    width={140}
                    height={95}
                    className="shadow-lg object-cover"
                    style={{ borderRadius: "16px" }}
                  />
                </div>
              )} */}
            </div>
          </div>
        </div>

        {/* Quick Info Bar */}
        <div
          className="rounded-2xl shadow-lg p-5 mb-6"
          style={{ background: "var(--color-textwhite)" }}
        >
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            {/* Contact */}
            <div className="flex items-center gap-3">
              <div
                className="p-2.5 rounded-lg"
                style={{ background: "var(--green-shade-light)20" }}
              >
                <Phone
                  className="w-5 h-5"
                  style={{ color: "var(--green-shade-light)" }}
                />
              </div>
              <div>
                <p
                  className="text-xs font-semibold uppercase"
                  style={{ color: "var(--color-textgreydark)" }}
                >
                  Phone
                </p>
                <p
                  className="text-sm font-bold"
                  style={{ color: "var(--color-textblack)" }}
                >
                  {driver?.mobile || "N/A"}
                </p>
              </div>
            </div>

            {/* Location */}
            <div className="flex items-center gap-3">
              <div
                className="p-2.5 rounded-lg"
                style={{ background: "var(--blue-shade-light)20" }}
              >
                <MapPin
                  className="w-5 h-5"
                  style={{ color: "var(--blue-shade-light)" }}
                />
              </div>
              <div>
                <p
                  className="text-xs font-semibold uppercase"
                  style={{ color: "var(--color-textgreydark)" }}
                >
                  Location
                </p>
                <p
                  className="text-xs font-bold line-clamp-2"
                  style={{ color: "var(--color-textblack)" }}
                >
                  {driver?.address || "N/A"}
                </p>
              </div>
            </div>

            {/* Experience */}
            <div className="flex items-center gap-3">
              <div
                className="p-2.5 rounded-lg"
                style={{ background: "var(--green-shade-dark)20" }}
              >
                <Award
                  className="w-5 h-5"
                  style={{ color: "var(--green-shade-dark)" }}
                />
              </div>
              <div>
                <p
                  className="text-xs font-semibold uppercase"
                  style={{ color: "var(--color-textgreydark)" }}
                >
                  Experience
                </p>
                <p
                  className="text-sm font-bold"
                  style={{ color: "var(--color-textblack)" }}
                >
                  {yearsExperience}+ years
                </p>
              </div>
            </div>
          </div>
        </div>

        {/* Bio & Skills Combined Card */}
        <div
          className="rounded-2xl shadow-lg p-6 mb-6"
          style={{ background: "var(--color-textwhite)" }}
        >
          {/* Bio */}
          {driver?.bio && (
            <div className="mb-5">
              <h2
                className="text-lg font-bold mb-2"
                style={{ color: "var(--blue-shade-dark)" }}
              >
                About
              </h2>
              <p
                className="text-sm leading-relaxed"
                style={{ color: "var(--color-textblack)" }}
              >
                {driver.bio}
              </p>
            </div>
          )}

          {/* Languages & License Types */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {/* Languages */}
            {driver?.languages && driver.languages.length > 0 && (
              <div>
                <div className="flex items-center gap-2 mb-2.5">
                  <Languages
                    className="w-4 h-4"
                    style={{ color: "var(--blue-shade-light)" }}
                  />
                  <h3
                    className="text-sm font-bold"
                    style={{ color: "var(--blue-shade-dark)" }}
                  >
                    Languages
                  </h3>
                </div>
                <div className="flex flex-wrap gap-2">
                  {driver.languages.map((lang, index) => (
                    <span
                      key={index}
                      className="px-3 py-1.5 rounded-full text-xs font-semibold"
                      style={{
                        background: "var(--blue-shade-light)15",
                        color: "var(--blue-shade-dark)",
                      }}
                    >
                      {lang}
                    </span>
                  ))}
                </div>
              </div>
            )}

            {/* License Types */}
            {driver?.licenseType && driver.licenseType.length > 0 && (
              <div>
                <div className="flex items-center gap-2 mb-2.5">
                  <Award
                    className="w-4 h-4"
                    style={{ color: "var(--green-shade-light)" }}
                  />
                  <h3
                    className="text-sm font-bold"
                    style={{ color: "var(--blue-shade-dark)" }}
                  >
                    License Types
                  </h3>
                </div>
                <div className="flex flex-wrap gap-2">
                  {driver.licenseType.map((license, index) => (
                    <span
                      key={index}
                      className="px-3 py-1.5 rounded-full text-xs font-semibold"
                      style={{
                        background: "var(--green-shade-light)15",
                        color: "var(--green-shade-dark)",
                      }}
                    >
                      {license}
                    </span>
                  ))}
                </div>
              </div>
            )}
          </div>
        </div>

        {/* Van Details Card */}
        {van && (
          <div
            className="shadow-lg overflow-hidden mb-6"
            style={{ background: "var(--color-textwhite)", borderRadius: "24px" }}
          >
            <div
              className="h-32 relative"
              style={{
                background: "linear-gradient(135deg, var(--green-shade-light) 0%, var(--green-shade-dark) 100%)",
              }}
            >
              {van.photoUrl && (
                <Image
                  src={van.photoUrl}
                  alt="Van"
                  fill
                  className="object-cover opacity-40"
                />
              )}
              <div className="absolute inset-0 flex items-center px-6">
                <div>
                  <h2
                    className="text-2xl font-bold text-white mb-1.5 flex items-center gap-2"
                  >
                    <Truck className="w-7 h-7" />
                    {van.makeAndModel}
                  </h2>
                  <div className="flex items-center gap-3">
                    {renderStars(van.averageRating, 16)}
                    <span className="text-white font-bold text-sm">
                      {van.averageRating || "N/A"}
                    </span>
                    <span className="text-white text-opacity-80 text-xs">
                      ({van.totalReviews} reviews)
                    </span>
                  </div>
                </div>
              </div>
            </div>

            <div className="p-6">
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                {/* Registration */}
                <div>
                  <p
                    className="text-xs font-semibold uppercase mb-1.5"
                    style={{ color: "var(--color-textgreydark)" }}
                  >
                    Registration Number
                  </p>
                  <p
                    className="text-sm font-bold"
                    style={{ color: "var(--color-textblack)" }}
                  >
                    {van.registrationNumber}
                  </p>
                </div>

                {/* License Plate */}
                <div>
                  <p
                    className="text-xs font-semibold uppercase mb-1.5"
                    style={{ color: "var(--color-textgreydark)" }}
                  >
                    License Plate
                  </p>
                  <p
                    className="text-sm font-bold"
                    style={{ color: "var(--color-textblack)" }}
                  >
                    {van.licensePlateNumber}
                  </p>
                </div>

                {/* Seating */}
                <div>
                  <p
                    className="text-xs font-semibold uppercase mb-1.5"
                    style={{ color: "var(--color-textgreydark)" }}
                  >
                    Seating Capacity
                  </p>
                  <p
                    className="text-sm font-bold"
                    style={{ color: "var(--color-textblack)" }}
                  >
                    {van.seatingCapacity} seats
                  </p>
                </div>

                {/* AC Condition */}
                <div>
                  <p
                    className="text-xs font-semibold uppercase mb-1.5"
                    style={{ color: "var(--color-textgreydark)" }}
                  >
                    AC Condition
                  </p>
                  <div className="flex items-center gap-2">
                    <Zap
                      className="w-4 h-4"
                      style={{
                        color: van.acCondition
                          ? "var(--green-shade-light)"
                          : "var(--color-textgreydark)",
                      }}
                    />
                    <span
                      className="text-xs font-bold"
                      style={{
                        color: van.acCondition
                          ? "var(--green-shade-dark)"
                          : "var(--color-textgreydark)",
                      }}
                    >
                      {van.acCondition ? "Available" : "Not Available"}
                    </span>
                  </div>
                </div>
              </div>
            </div>
          </div>
        )}

        {/* Van Service Card */}
        {vanService && (
          <div
            className="rounded-2xl shadow-lg p-6 mb-6"
            style={{ background: "var(--color-textwhite)" }}
          >
            <h2
              className="text-lg font-bold mb-4 flex items-center gap-2"
              style={{ color: "var(--blue-shade-dark)" }}
            >
              <Award className="w-5 h-5" />
              Van Service Provider
            </h2>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div className="md:col-span-2">
                <p
                  className="text-xs font-semibold uppercase mb-1"
                  style={{ color: "var(--color-textgreydark)" }}
                >
                  Service Name
                </p>
                <h3
                  className="text-xl font-bold mb-4"
                  style={{ color: "var(--blue-shade-dark)" }}
                >
                  {vanService.serviceName}
                </h3>
              </div>

              <div>
                <p
                  className="text-xs font-semibold uppercase mb-1"
                  style={{ color: "var(--color-textgreydark)" }}
                >
                  Contact Number
                </p>
                <div className="flex items-center gap-2">
                  <Phone
                    className="w-4 h-4"
                    style={{ color: "var(--green-shade-light)" }}
                  />
                  <p
                    className="text-sm font-bold"
                    style={{ color: "var(--color-textblack)" }}
                  >
                    {vanService.contactNo}
                  </p>
                </div>
              </div>

              <div>
                <p
                  className="text-xs font-semibold uppercase mb-1"
                  style={{ color: "var(--color-textgreydark)" }}
                >
                  Service Rating
                </p>
                <div className="flex items-center gap-2">
                  {renderStars(vanService.averageRating, 14)}
                  <span
                    className="text-xs font-bold"
                    style={{ color: "var(--blue-shade-dark)" }}
                  >
                    {vanService.averageRating || "N/A"}
                  </span>
                  <span style={{ color: "var(--color-textgreydark)", fontSize: "11px" }}>
                    ({vanService.totalReviews})
                  </span>
                </div>
              </div>
            </div>
          </div>
        )}

        {/* Reviews Section */}
        {driver?.reviews && driver.reviews.length > 0 && (
          <div
            className="rounded-2xl shadow-lg p-6 mb-8"
            style={{ background: "var(--color-textwhite)" }}
          >
            <h2
              className="text-lg font-bold mb-4 flex items-center gap-2"
              style={{ color: "var(--blue-shade-dark)" }}
            >
              <MessageSquare className="w-5 h-5" />
              Parent Reviews
            </h2>

            <div className="space-y-3">
              {driver.reviews.map((review) => (
                <div
                  key={review.id}
                  className="p-4 rounded-lg border-l-4"
                  style={{
                    background: "var(--color-background)",
                    borderColor: "var(--blue-shade-light)",
                  }}
                >
                  <div className="flex justify-between items-start mb-2">
                    <div>
                      <p
                        className="font-bold text-sm"
                        style={{ color: "var(--color-textblack)" }}
                      >
                        {review.Child.name}
                      </p>
                      <p
                        className="text-xs"
                        style={{ color: "var(--color-textgreydark)" }}
                      >
                        {new Date(review.createdAt).toLocaleDateString("en-US", {
                          year: "numeric",
                          month: "short",
                          day: "numeric",
                        })}
                      </p>
                    </div>
                    <div>{renderStars(review.rating, 14)}</div>
                  </div>
                  {review.comment && (
                    <p
                      className="text-sm leading-relaxed"
                      style={{ color: "var(--color-textblack)" }}
                    >
                      "{review.comment}"
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