"use client";

import { notFound } from "next/navigation";
import { useState } from "react";

import { FileText, MapPin, Clock, Users } from "lucide-react";

import CustomTable from "@/app/dashboardComponents/CustomTable";
import SearchFilter from "@/app/dashboardComponents/SearchFilter";
import Calendar from "@/app/admin/components/calender";
import StatCard from "@/app/dashboardComponents/StatCard";

type StudentRecord = {
  studentName: string;
  parentName: string;
  parentPhone: string;
  route_status: string;
};

export default function RouteDetailsPage({ vanId }: { vanId: string }) {
  const id = vanId;

  const [students] = useState<StudentRecord[]>([
    {
      studentName: "John Doe",
      parentName: "Jane Doe",
      parentPhone: "1234567890",
      route_status: "OnTheWay",
    },
    {
      studentName: "Mary Smith",
      parentName: "Mark Smith",
      parentPhone: "9876543210",
      route_status: "Finished",
    },
  ]);

  const [searchTerm, setSearchTerm] = useState("");
  const [selectedStatus, setSelectedStatus] = useState("");
  const [selectedDate, setSelectedDate] = useState<Date | null>(null);

  if (!id) return notFound();

  const handleClearFilters = () => {
    setSearchTerm("");
    setSelectedStatus("");
    setSelectedDate(null);
  };

  const filteredStudents = students.filter((student) => {
    const matchesSearch = searchTerm
      ? [
          student.studentName,
          student.parentName,
          student.parentPhone,
          student.route_status,
        ].some((field) =>
          String(field).toLowerCase().includes(searchTerm.toLowerCase())
        )
      : true;

    const matchesStatus = selectedStatus
      ? student.route_status === selectedStatus
      : true;

    return matchesSearch && matchesStatus;
  });

  return (
    <section className=" min-h-screen w-full bg-gradient-to-br from-slate-50 to-blue-50">
      {/* TopBar heading is provided by parent page */}

      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <div className="md:col-span-2 bg-white rounded-lg shadow-md p-4 border border-gray-200">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-8">
            <StatCard
              icon={<Users className="text-xl" />}
              text="Total Students"
              number={students.length}
            />
            <StatCard
              icon={<Clock className="text-xl" />}
              text="Active Today"
              number={filteredStudents.length}
            />
            <StatCard
              icon={<MapPin className="text-xl" />}
              text="On The Way"
              number={
                students.filter((s) => s.route_status === "OnTheWay").length
              }
            />
          </div>

          <div className="mb-8">
            <h2 className="text-lg font-semibold mb-4">Live Route Tracking</h2>
            <div className="h-72 bg-gradient-to-br from-blue-50 to-indigo-100 border-2 border-dashed border-blue-200 flex items-center justify-center rounded-xl">
              <div className="text-center">
                <MapPin className="w-12 h-12 text-blue-400 mx-auto mb-2" />
                <p className="text-blue-600 font-medium">
                  Interactive Route Map
                </p>
                <p className="text-blue-500 text-sm">
                  Real-time vehicle tracking
                </p>
              </div>
            </div>
          </div>

          <div>
            <h2 className="text-lg font-semibold mb-4">Student Manifest</h2>
            <div className="flex flex-col sm:flex-row gap-4 items-start sm:items-center justify-between mb-4">
              <div className="flex items-center gap-2">
                <Users className="w-5 h-5 text-gray-400" />
                <span className="text-base font-semibold text-gray-900">
                  {filteredStudents.length} Students
                </span>
              </div>
              <div className="w-full sm:w-auto sm:min-w-80">
                <SearchFilter
                  onSearchChange={setSearchTerm}
                  onStatusChange={setSelectedStatus}
                  onRoleChange={() => {}}
                  onDateChange={() => {}}
                  onClearFilters={handleClearFilters}
                  config={{
                    searchPlaceholder: "Search by name, parent, or phone...",
                    statusOptions: [
                      { value: "", label: "All Status" },
                      { value: "OnTheWay", label: "On The Way" },
                      { value: "Finished", label: "Finished" },
                      { value: "inTheVan", label: "In the Van" },
                    ],
                    showClearButton: true,
                    showDateFilter: false,
                    showAddButton: false,
                    roleOptions: undefined,
                  }}
                />
              </div>
            </div>
            <CustomTable
              columns={[
                { key: "studentName", label: "Student Name" },
                { key: "parentName", label: "Parent Name" },
                { key: "parentPhone", label: "Parent Phone" },
                { key: "route_status", label: "Status" },
              ]}
              data={filteredStudents}
              actions={[
                {
                  type: "custom",
                  label: "View",
                  icon: <FileText size={16} color="blue" />,
                  onClick: () => {},
                },
              ]}
            />
          </div>
        </div>

        <div className="md:col-span-1 space-y-6">
          <div className="bg-white rounded-lg shadow-md p-4 border border-gray-200">
            <h2 className="text-lg font-semibold mb-4">Date Selection</h2>
            <Calendar
              selectedDate={selectedDate}
              onDateChange={setSelectedDate}
            />
          </div>

          <div className="bg-white rounded-lg shadow-md p-4 border border-gray-200">
            <h2 className="text-lg font-semibold mb-4">
              Today&apos;s Schedule
            </h2>
            <ScheduleItem
              time="6:30 AM"
              event="Route Start"
              status="completed"
            />
            <ScheduleItem
              time="7:15 AM"
              event="Pickup Complete"
              status="in-progress"
            />
            <ScheduleItem
              time="2:30 PM"
              event="Drop-off Complete"
              status="pending"
            />
          </div>

          <div className="bg-white rounded-lg shadow-md p-4 border border-gray-200">
            <h2 className="text-lg font-semibold mb-4">Route Insights</h2>
            <InsightItem
              type="warning"
              title="Traffic Alert"
              description="Main junction congestion expected 7:00-7:20 AM"
            />
            <InsightItem
              type="info"
              title="Alternative Route"
              description="Park Street bypass available if needed"
            />
            <InsightItem
              type="success"
              title="On Schedule"
              description="Current timing within expected parameters"
            />
          </div>
        </div>
      </div>
    </section>
  );
}

function ScheduleItem({
  time,
  event,
  status,
}: {
  time: string;
  event: string;
  status: "completed" | "in-progress" | "pending";
}) {
  const dotClasses = {
    completed: "bg-green-500",
    "in-progress": "bg-blue-500",
    pending: "bg-gray-400",
  };

  return (
    <div className="flex items-center gap-3 mb-2">
      <div className={`w-3 h-3 rounded-full ${dotClasses[status]}`}></div>
      <div className="flex-1">
        <div className="flex justify-between text-sm">
          <span className="font-medium text-gray-900">{event}</span>
          <span className="text-gray-500">{time}</span>
        </div>
      </div>
    </div>
  );
}

function InsightItem({
  type,
  title,
  description,
}: {
  type: "warning" | "info" | "success";
  title: string;
  description: string;
}) {
  const typeClasses = {
    warning: "bg-amber-50 border-amber-200 text-amber-800",
    info: "bg-blue-50 border-blue-200 text-blue-800",
    success: "bg-green-50 border-green-200 text-green-800",
  };

  return (
    <div className={`p-3 rounded-lg border ${typeClasses[type]}`}>
      <p className="font-medium text-xs uppercase tracking-wide mb-1">
        {title}
      </p>
      <p className="text-sm">{description}</p>
    </div>
  );
}
