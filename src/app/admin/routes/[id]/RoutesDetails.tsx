"use client";

import { useEffect, useState } from "react";
import { notFound } from "next/navigation";
import { format } from "date-fns";
import { FileText, Clock, Users } from "lucide-react";

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
    <section className="min-h-screen w-full bg-gradient-to-br from-slate-50 to-blue-50">
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <div className="md:col-span-2 bg-white rounded-lg shadow-md p-4 border border-gray-200">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-8">
            <StatCard
              icon={<Users className="text-xl" />}
              text="Total Students"
              number={sessions.reduce(
                (acc, session) => acc + (session.sessionStudents?.length || 0),
                0
              )}
            />
            <StatCard
              icon={<Clock className="text-xl" />}
              text={
                routeType === "MORNING_PICKUP"
                  ? "Morning Pickups"
                  : "Evening Dropoffs"
              }
              number={sessions.length}
            />
            <div
              className="flex items-center justify-center p-4 rounded-lg bg-gradient-to-r from-blue-500 to-blue-600 text-white cursor-pointer"
              onClick={toggleRouteType}
            >
              <div className="text-center">
                <p className="font-medium">
                  {routeType === "MORNING_PICKUP"
                    ? "Switch to Evening Dropoffs"
                    : "Switch to Morning Pickups"}
                </p>
              </div>
            </div>
          </div>

          <div className="mb-8">
            <h2 className="text-lg font-semibold mb-4">
              Sessions for{" "}
              {selectedDate
                ? format(selectedDate, "MMMM d, yyyy")
                : "Selected Date"}
            </h2>

            {loading ? (
              <div className="h-72 flex items-center justify-center">
                <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-500"></div>
              </div>
            ) : sessions.length > 0 ? (
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {sessions.map((session) => (
                  <div
                    key={session.id}
                    onClick={() => fetchStudentsForSession(session)}
                    className={`p-4 rounded-lg border-2 cursor-pointer transition-all ${
                      selectedSession?.id === session.id
                        ? "border-blue-500 bg-blue-50"
                        : "border-gray-200 hover:border-blue-300"
                    }`}
                  >
                    <div className="flex justify-between items-center mb-2">
                      <h3 className="font-medium">
                        {session.routeType === "MORNING_PICKUP"
                          ? "Morning Pickup"
                          : "Evening Dropoff"}
                      </h3>
                      <span
                        className={`px-2 py-1 rounded-full text-xs ${
                          session.status === "COMPLETED"
                            ? "bg-green-100 text-green-800"
                            : session.status === "ACTIVE"
                            ? "bg-blue-100 text-blue-800"
                            : "bg-gray-100 text-gray-800"
                        }`}
                      >
                        {session.status}
                      </span>
                    </div>
                    <div className="text-sm text-gray-600">
                      {session.startedAt ? (
                        <p>
                          Started:{" "}
                          {new Date(session.startedAt).toLocaleTimeString()}
                        </p>
                      ) : (
                        <p>Not started yet</p>
                      )}
                      {session.endedAt && (
                        <p>
                          Ended:{" "}
                          {new Date(session.endedAt).toLocaleTimeString()}
                        </p>
                      )}
                      {session.totalDistance && (
                        <p>
                          Distance: {session.totalDistance.toFixed(1)} km
                          {session.totalDuration && (
                            <span>
                              {" "}
                              • Duration:{" "}
                              {Math.round(session.totalDuration / 60)} min
                            </span>
                          )}
                        </p>
                      )}
                    </div>
                  </div>
                ))}
              </div>
            ) : (
              <div className="h-72 bg-gray-50 border-2 border-dashed border-gray-200 flex items-center justify-center rounded-lg">
                <div className="text-center">
                  <Clock className="w-12 h-12 text-gray-400 mx-auto mb-2" />
                  <p className="text-gray-600 font-medium">No sessions found</p>
                  <p className="text-gray-500 text-sm">
                    Try selecting a different date
                  </p>
                </div>
              </div>
            )}
          </div>

          {selectedSession && (
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
              </div>

              {sessionLoading ? (
                <div className="h-40 flex items-center justify-center">
                  <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-500"></div>
                </div>
              ) : filteredStudents.length > 0 ? (
                <CustomTable
                  columns={[
                    { key: "name", label: "Student Name" },
                    { key: "age", label: "Age" },
                    { key: "grade", label: "Grade" },
                    { key: "school", label: "School" },
                    { key: "pickupStatus", label: "Status" },
                    selectedSession.routeType === "MORNING_PICKUP"
                      ? { key: "pickedUpAt", label: "Pickup Time" }
                      : { key: "droppedOffAt", label: "Dropoff Time" },
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
                  actions={[
                    {
                      type: "custom",
                      label: "View",
                      icon: <FileText size={16} color="blue" />,
                      onClick: () => {},
                    },
                  ]}
                />
              ) : (
                <div className="text-center py-8 text-gray-500">
                  No students found for this session.
                </div>
              )}
            </div>
          )}
        </div>

        <div className="md:col-span-1 space-y-6">
          <div className="bg-white rounded-lg shadow-md p-4 border border-gray-200">
            <h2 className="text-lg font-semibold mb-4">Date Selection</h2>
            <Calendar
              selectedDate={selectedDate}
              onDateChange={setSelectedDate}
            />
          </div>

          {selectedSession && (
            <div className="bg-white rounded-lg shadow-md p-4 border border-gray-200">
              <h2 className="text-lg font-semibold mb-4">Session Details</h2>
              <div className="space-y-3">
                <DetailItem
                  label="Route Type"
                  value={
                    selectedSession.routeType === "MORNING_PICKUP"
                      ? "Morning Pickup"
                      : "Evening Dropoff"
                  }
                />
                <DetailItem label="Status" value={selectedSession.status} />
                <DetailItem
                  label="Start Time"
                  value={
                    selectedSession.startedAt
                      ? new Date(selectedSession.startedAt).toLocaleTimeString()
                      : "Not started"
                  }
                />
                <DetailItem
                  label="End Time"
                  value={
                    selectedSession.endedAt
                      ? new Date(selectedSession.endedAt).toLocaleTimeString()
                      : "Not ended"
                  }
                />
                {selectedSession.totalDistance && (
                  <DetailItem
                    label="Distance"
                    value={`${selectedSession.totalDistance.toFixed(1)} km`}
                  />
                )}
                {selectedSession.totalDuration && (
                  <DetailItem
                    label="Duration"
                    value={`${Math.round(
                      selectedSession.totalDuration / 60
                    )} minutes`}
                  />
                )}
              </div>
            </div>
          )}
        </div>
      </div>
    </section>
  );
}

function DetailItem({ label, value }: { label: string; value: string }) {
  return (
    <div className="flex justify-between items-center">
      <span className="text-gray-600">{label}:</span>
      <span className="font-medium">{value}</span>
    </div>
  );
}
