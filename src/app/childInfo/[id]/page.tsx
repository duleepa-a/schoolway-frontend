"use client";

import React, { useEffect, useState } from "react";
import { useParams } from "next/navigation";
import { User, School, MapPin, Info, Clock } from "lucide-react";

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
    name: string;
  };
}

const ChildInfoPage: React.FC = () => {
  const { id } = useParams();
  const [child, setChild] = useState<ChildData | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchChild = async () => {
      try {
        const res = await fetch(`/api/child/childView/${id}`);
        const data = await res.json();
        setChild(data);
      } catch (error) {
        console.error("Error fetching child info:", error);
      } finally {
        setLoading(false);
      }
    };
    fetchChild();
  }, [id]);

  if (loading) {
    return (
      <div className="flex justify-center items-center min-h-screen text-gray-600 text-lg">
        Loading child information...
      </div>
    );
  }

  if (!child) {
    return (
      <div className="flex justify-center items-center min-h-screen text-red-500 text-lg">
        Child not found.
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-b from-blue-50 to-green-50 py-12 px-6">
      <div className="max-w-3xl mx-auto bg-white shadow-lg rounded-2xl overflow-hidden border border-gray-200">
        {/* Header Image */}
        <div className="w-full h-64 bg-gray-100 flex justify-center items-center">
          <img
            src={child.profilePicture}
            alt={`${child.name}'s Profile`}
            className="w-48 h-48 object-cover rounded-full shadow-md border-4 border-white -mt-16"
          />
        </div>

        {/* Info Section */}
        <div className="p-6 text-center">
          <h1 className="text-3xl font-semibold text-gray-800 mb-2">{child.name}</h1>
          <p className="text-sm text-gray-500 mb-6">
            Student | Grade {child.grade} | Age {child.age}
          </p>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6 text-left">
            <div className="flex items-center gap-3">
              <School className="w-6 h-6 text-blue-600" />
              <p className="text-gray-700">
                <span className="font-medium">School:</span>{" "}
                {child.School?.name || "N/A"}
              </p>
            </div>

            <div className="flex items-center gap-3">
              <Clock className="w-6 h-6 text-green-600" />
              <p className="text-gray-700">
                <span className="font-medium">School Time:</span>{" "}
                {child.schoolStartTime} - {child.schoolEndTime}
              </p>
            </div>

            <div className="flex items-center gap-3">
              <MapPin className="w-6 h-6 text-purple-600" />
              <p className="text-gray-700">
                <span className="font-medium">Pickup Address:</span>{" "}
                {child.pickupAddress}
              </p>
            </div>

            {child.specialNotes && (
              <div className="flex items-start gap-3">
                <Info className="w-6 h-6 text-orange-600" />
                <p className="text-gray-700">
                  <span className="font-medium">Special Notes:</span>{" "}
                  {child.specialNotes}
                </p>
              </div>
            )}
          </div>

          <div className="mt-8 p-4 bg-blue-50 border border-blue-100 rounded-lg">
            <p className="text-sm text-blue-700">
              ⚠️ If this child seems to be in distress or needs help, please contact
              the nearest authority or their registered guardian immediately.
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ChildInfoPage;
