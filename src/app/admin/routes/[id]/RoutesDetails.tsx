"use client";

import { useEffect, useState } from "react";
import { notFound } from "next/navigation";
import { format } from "date-fns";
import {
  FileText,
  Clock,
  Users,
  Calendar as CalendarIcon,
  Car,
  MapPin,
} from "lucide-react";

import CustomTable from "@/app/dashboardComponents/CustomTable";
import SearchFilter from "@/app/dashboardComponents/SearchFilter";
import Calendar from "@/app/admin/components/calender";
import StatCard from "@/app/dashboardComponents/StatCard";

interface Student {
  id: string;
  name: string;
  age: number;
  grade: string | number;
  school: string;
  pickupStatus: string;
  pickedUpAt: string | null;
  droppedOffAt: string | null;
}

interface Session {
  id: string;
  vanId: number;
  driverId: string;
  routeType: string;
  sessionDate: string;
  startedAt: string | null;
  endedAt: string | null;
  status: string;
  totalDistance: number | null;
  totalDuration: number | null;
  sessionStudents?: Student[];
}

export default function RoutesDetails({ vanId }: { vanId: string }) {
  const id = vanId;
  const [sessions, setSessions] = useState<Session[]>([]);
  const [selectedSession, setSelectedSession] = useState<Session | null>(null);
  const [students, setStudents] = useState<Student[]>([]);
  const [loading, setLoading] = useState(false);
  const [sessionLoading, setSessionLoading] = useState(false);
  const [searchTerm, setSearchTerm] = useState("");
  const [selectedStatus, setSelectedStatus] = useState("");
  const [selectedDate, setSelectedDate] = useState<Date | null>(new Date());
  const [routeType, setRouteType] = useState<string>("MORNING_PICKUP");

  // Fetch sessions when date changes
  useEffect(() => {
    async function fetchSessions() {
      if (!selectedDate) return;

      setLoading(true);
      try {
        const formattedDate = format(selectedDate, "yyyy-MM-dd");
        const res = await fetch(
          `/api/admin/routes/vans/${id}/sessions?date=${formattedDate}&routeType=${routeType}`
        );

        if (!res.ok) throw new Error("Failed to fetch sessions");

        const data = await res.json();
        setSessions(data.sessions || []);

        // Clear selected session when date changes
        setSelectedSession(null);
        setStudents([]);
      } catch (error) {
        console.error("Error fetching sessions:", error);
      } finally {
        setLoading(false);
      }
    }

    fetchSessions();
  }, [id, selectedDate, routeType]);

  // Fetch students for a session
  const fetchStudentsForSession = async (session: Session) => {
    setSessionLoading(true);
    // clear current selection while loading new data
    setSelectedSession(null);
    try {
      const res = await fetch(
        `/api/admin/routes/vans/${id}/sessions/${session.id}/students`
      );

      if (!res.ok) throw new Error("Failed to fetch students");

      const data = await res.json();
      console.log("students----------------------", res);
      // API now returns { session, students }
      if (data.session) {
        setSelectedSession(data.session);
      } else {
        // fallback to the session we clicked if api didn't return session
        setSelectedSession(session);
      }

      setStudents(data.students || []);
    } catch (error) {
      console.error("Error fetching students:", error);
    } finally {
      setSessionLoading(false);
    }
  };

  // Toggle route type between MORNING_PICKUP and EVENING_DROPOFF
  const toggleRouteType = () => {
    setRouteType((prev) =>
      prev === "MORNING_PICKUP" ? "EVENING_DROPOFF" : "MORNING_PICKUP"
    );
  };

  const handleClearFilters = () => {
    setSearchTerm("");
    setSelectedStatus("");
  };

  const filteredStudents = students.filter((student) => {
    const matchesSearch = searchTerm
      ? [student.name, student.school, student.pickupStatus].some((field) =>
          String(field).toLowerCase().includes(searchTerm.toLowerCase())
        )
      : true;

    const matchesStatus = selectedStatus
      ? student.pickupStatus === selectedStatus
      : true;

    return matchesSearch && matchesStatus;
  });

  if (!id) return notFound();

  return (
    <div className="space-y-6">
      {/* Header Card */}
      <div className="bg-white rounded-xl shadow-lg border border-gray-100 p-6">
        <div className="flex items-center justify-between mb-6">
          <div>
            <h2 className="text-2xl font-bold text-gray-800">Route Sessions</h2>
            <p className="text-gray-600">
              Manage and monitor van route sessions and student manifests
            </p>
          </div>
          <div className="text-sm text-gray-500">
            {sessions.length} sessions for{" "}
            {selectedDate
              ? format(selectedDate, "MMMM d, yyyy")
              : "selected date"}
          </div>
        </div>

        {/* Stats and Controls */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-6">
          <div className="bg-gradient-to-r from-blue-50 to-cyan-50 rounded-lg p-4 border border-blue-100">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-[#0099cc]">
                  Total Students
                </p>
                <p className="text-2xl font-bold text-[#0099cc]">
                  {sessions.reduce(
                    (acc, session) =>
                      acc + (session.sessionStudents?.length || 0),
                    0
                  )}
                </p>
              </div>
              <Users className="w-8 h-8 text-[#0099cc]" />
            </div>
          </div>

          <div className="bg-gradient-to-r from-yellow-50 to-amber-50 rounded-lg p-4 border border-yellow-100">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-yellow-600">
                  {routeType === "MORNING_PICKUP"
                    ? "Morning Pickups"
                    : "Evening Dropoffs"}
                </p>
                <p className="text-2xl font-bold text-yellow-700">
                  {sessions.length}
                </p>
              </div>
              <Clock className="w-8 h-8 text-yellow-500" />
            </div>
          </div>

          <div className="bg-gradient-to-r from-green-50 to-emerald-50 rounded-lg p-4 border border-green-100">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-green-600">
                  Completed Sessions
                </p>
                <p className="text-2xl font-bold text-green-700">
                  {sessions.filter((s) => s.status === "COMPLETED").length}
                </p>
              </div>
              <Car className="w-8 h-8 text-green-500" />
            </div>
          </div>

          <button
            onClick={toggleRouteType}
            className="bg-gradient-to-r from-blue-400 to-[#0099cc] text-white rounded-lg p-4 border border-blue-600 hover:from-blue-600 hover:to-blue-700 transition-all shadow-sm hover:shadow-md"
          >
            <div className="text-center">
              <p className="font-medium text-sm">
                Switch to{" "}
                {routeType === "MORNING_PICKUP"
                  ? "Evening Dropoffs"
                  : "Morning Pickups"}
              </p>
            </div>
          </button>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Main Content */}
        <div className="lg:col-span-2 space-y-6">
          {/* Sessions Card */}
          <div className="bg-white rounded-xl shadow-lg border border-gray-100 p-6">
            <div className="flex items-center justify-between mb-6">
              <h3 className="text-lg font-semibold text-gray-800">
                Sessions for{" "}
                {selectedDate
                  ? format(selectedDate, "MMMM d, yyyy")
                  : "Selected Date"}
              </h3>
              <div className="flex items-center gap-2 text-sm text-gray-500">
                <CalendarIcon className="w-4 h-4" />
                {selectedDate
                  ? format(selectedDate, "MMM d, yyyy")
                  : "No date selected"}
              </div>
            </div>

            {loading ? (
              <div className="h-72 flex items-center justify-center">
                <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600"></div>
              </div>
            ) : sessions.length > 0 ? (
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {sessions.map((session) => (
                  <div
                    key={session.id}
                    onClick={() => fetchStudentsForSession(session)}
                    className={`p-5 rounded-xl border-2 cursor-pointer transition-all hover:shadow-md ${
                      selectedSession?.id === session.id
                        ? "border-blue-500 bg-blue-50 shadow-md"
                        : "border-gray-100 hover:border-blue-300"
                    }`}
                  >
                    <div className="flex justify-between items-start mb-2">
                      <div>
                        <h4 className="font-semibold text-gray-800">
                          {session.routeType === "MORNING_PICKUP"
                            ? "Morning Pickup"
                            : "Evening Dropoff"}
                        </h4>
                        <p className="text-sm text-gray-500 mt-1">
                          {session.sessionStudents?.length || 0} students
                        </p>
                      </div>
                      <span
                        className={`px-3 py-1 rounded-full text-xs font-medium ${
                          session.status === "COMPLETED"
                            ? "bg-green-100 text-green-800"
                            : session.status === "ACTIVE"
                            ? "bg-blue-100 text-[#0099cc]"
                            : "bg-gray-100 text-gray-800"
                        }`}
                      >
                        {session.status}
                      </span>
                    </div>

                    <div className="space-y-2 text-sm text-gray-600">
                      {session.startedAt ? (
                        <div className="flex items-center gap-2">
                          <Clock className="w-4 h-4 text-[#0099cc]" />
                          <span>
                            Started:{" "}
                            {new Date(session.startedAt).toLocaleTimeString()}
                          </span>
                        </div>
                      ) : (
                        <div className="flex items-center gap-2">
                          <Clock className="w-4 h-4 text-gray-400" />
                          <span>Not started yet</span>
                        </div>
                      )}

                      {session.endedAt && (
                        <div className="flex items-center gap-2">
                          <Clock className="w-4 h-4 text-green-500" />
                          <span>
                            Ended:{" "}
                            {new Date(session.endedAt).toLocaleTimeString()}
                          </span>
                        </div>
                      )}

                      {session.totalDistance && (
                        <div className="flex items-center gap-2">
                          <MapPin className="w-4 h-4 text-purple-500" />
                          <span>
                            Distance: {session.totalDistance.toFixed(1)} km
                            {session.totalDuration && (
                              <span className="ml-2">
                                • Duration:{" "}
                                {Math.round(session.totalDuration / 60)} min
                              </span>
                            )}
                          </span>
                        </div>
                      )}
                    </div>
                  </div>
                ))}
              </div>
            ) : (
              <div className="h-72 bg-gray-50 border-2 border-dashed border-gray-200 rounded-xl flex items-center justify-center">
                <div className="text-center">
                  <Car className="w-12 h-12 text-gray-400 mx-auto mb-3" />
                  <p className="text-gray-600 font-medium">No sessions found</p>
                  <p className="text-gray-500 text-sm mt-1">
                    Try selecting a different date or switch route type
                  </p>
                </div>
              </div>
            )}
          </div>

          {/* Student Manifest Card */}
          {selectedSession && (
            <div className="bg-white rounded-xl shadow-lg border border-gray-100 p-6">
              <div className="flex items-center justify-between mb-6">
                <h3 className="text-lg font-semibold text-gray-800">
                  Student Manifest
                </h3>
                <div className="flex items-center gap-2 text-sm text-gray-500">
                  <Users className="w-4 h-4" />
                  <span>{filteredStudents.length} Students</span>
                </div>
              </div>

              <div className="mb-6">
                <SearchFilter
                  onSearchChange={setSearchTerm}
                  onStatusChange={setSelectedStatus}
                  onRoleChange={() => {}}
                  onDateChange={() => {}}
                  onClearFilters={handleClearFilters}
                  config={{
                    searchPlaceholder: "Search by name, school...",
                    statusOptions: [
                      { value: "", label: "All Status" },
                      { value: "WAITING", label: "Waiting" },
                      { value: "PICKED_UP", label: "Picked Up" },
                      { value: "DROPPED_OFF", label: "Dropped Off" },
                      { value: "ABSENT", label: "Absent" },
                    ],
                    showClearButton: true,
                    showDateFilter: false,
                    showAddButton: false,
                    roleOptions: undefined,
                  }}
                />
              </div>

              {sessionLoading ? (
                <div className="h-40 flex items-center justify-center">
                  <div className="animate-spin rounded-full h-8 w-4 border-b-2 border-blue-600"></div>
                </div>
              ) : filteredStudents.length > 0 ? (
                <CustomTable
                  columns={[
                    { key: "name", label: "Student Name" },
                    { key: "grade", label: "Grade" },
                    { key: "school", label: "School" },
                    { key: "pickupStatus", label: "Status" },
                    // selectedSession.routeType === "MORNING_PICKUP"
                    // ?
                    { key: "pickedUpAt", label: "Pickup Time" },
                    // :
                    { key: "droppedOffAt", label: "Dropoff Time" },
                  ]}
                  data={filteredStudents.map((student) => ({
                    ...student,
                    pickedUpAt: student.pickedUpAt
                      ? new Date(student.pickedUpAt).toLocaleTimeString()
                      : "-",
                    droppedOffAt: student.droppedOffAt
                      ? new Date(student.droppedOffAt).toLocaleTimeString()
                      : "-",
                  }))}
                  // actions={[
                  //   {
                  //     type: "custom",
                  //     label: "View",
                  //     icon: <FileText size={16} color="blue" />,
                  //     onClick: () => {},
                  //   },
                  // ]}
                />
              ) : (
                <div className="text-center py-12">
                  <Users className="w-12 h-12 text-gray-400 mx-auto mb-3" />
                  <p className="text-gray-500 text-lg">No students found</p>
                  <p className="text-gray-400 text-sm mt-1">
                    {searchTerm || selectedStatus
                      ? "Try adjusting your search or filters"
                      : "No students assigned to this session"}
                  </p>
                </div>
              )}
            </div>
          )}
        </div>

        {/* Sidebar */}
        <div className="lg:col-span-1 space-y-6">
          {/* Calendar Card */}
          <div className="bg-white rounded-xl shadow-lg border border-gray-100 p-6">
            <h3 className="text-lg font-semibold text-gray-800 mb-4">
              Date Selection
            </h3>
            <Calendar
              selectedDate={selectedDate}
              onDateChange={setSelectedDate}
            />
          </div>

          {/* Session Details Card */}
          {selectedSession && (
            <div className="bg-white text-sm rounded-xl shadow-lg border border-gray-100 p-4 w-90">
              <h3 className="text-lg font-semibold text-gray-800 mb-4">
                Session Details
              </h3>
              <div className="space-y-4">
                <DetailItem
                  label="Route Type"
                  value={
                    selectedSession.routeType === "MORNING_PICKUP"
                      ? "Morning Pickup"
                      : "Evening Dropoff"
                  }
                  icon={<Car className="w-4 h-4 text-[#0099cc]" />}
                />
                <DetailItem
                  label="Status"
                  value={selectedSession.status}
                  icon={<Clock className="w-4 h-4 text-[#0099cc]" />}
                />
                <DetailItem
                  label="Start Time"
                  value={
                    selectedSession.startedAt
                      ? new Date(selectedSession.startedAt).toLocaleTimeString()
                      : "Not started"
                  }
                  icon={<Clock className="w-4 h-4 text-green-500" />}
                />
                <DetailItem
                  label="End Time"
                  value={
                    selectedSession.endedAt
                      ? new Date(selectedSession.endedAt).toLocaleTimeString()
                      : "Not ended"
                  }
                  icon={<Clock className="w-4 h-4 text-red-500" />}
                />
                {selectedSession.totalDistance && (
                  <DetailItem
                    label="Distance"
                    value={`${selectedSession.totalDistance.toFixed(1)} km`}
                    icon={<MapPin className="w-4 h-4 text-purple-500" />}
                  />
                )}
                {selectedSession.totalDuration && (
                  <DetailItem
                    label="Duration"
                    value={`${Math.round(
                      selectedSession.totalDuration / 60
                    )} minutes`}
                    icon={<Clock className="w-4 h-4 text-orange-500" />}
                  />
                )}
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}

function DetailItem({
  label,
  value,
  icon,
}: {
  label: string;
  value: string;
  icon?: React.ReactNode;
}) {
  return (
    <div className="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
      <div className="flex items-center gap-3">
        {icon}
        <span className="text-gray-600 font-medium">{label}</span>
      </div>
      <span className="font-semibold text-gray-800">{value}</span>
    </div>
  );
}
