"use client";
import * as React from 'react';
import Link from 'next/link';
import { notFound } from 'next/navigation';
import CustomTable from '@/app/dashboardComponents/CustomTable';
import { FileText, MapPin, Clock, Users, Route } from 'lucide-react';
import { useState } from 'react';
import SearchFilter from '@/app/dashboardComponents/SearchFilter';
import Calendar from '@/app/admin/components/calender';
import TopBar from '@/app/dashboardComponents/TopBar';

type StudentRecord = {
  studentName: string;
  parentName: string;
  parentPhone: string;
  route_status: string;
};

export default function RouteDetailsPage({ params }:{params:{id:string}}) {
  // const { id } = params;
  const actualParams = React.use(params);
  const { id } = actualParams;
  if (!id) return notFound();

  const [students] = useState<StudentRecord[]>([
    { studentName: 'John Doe', parentName: 'Jane Doe', parentPhone: '1234567890', route_status: 'OnTheWay' },
    { studentName: 'Mary Smith', parentName: 'Mark Smith', parentPhone: '9876543210', route_status: 'Finished' },
  ]);
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedStatus, setSelectedStatus] = useState('');
  const [selectedDate, setSelectedDate] = useState<Date | null>(null);

  const handleClearFilters = () => {
    setSearchTerm('');
    setSelectedStatus('');
    setSelectedDate(null);
  };

  const filteredStudents = students.filter((student) => {
    const matchesSearch = searchTerm
      ? [student.studentName, student.parentName, student.parentPhone, student.route_status]
          .some((field) => String(field).toLowerCase().includes(searchTerm.toLowerCase()))
      : true;
    const matchesStatus = selectedStatus ? student.route_status === selectedStatus : true;
    return matchesSearch && matchesStatus;
  });

  return (

        <div className="min-h-screen bg-gradient-to-br from-slate-50 to-blue-50">
      {/* Top Navigation Bar */}
      <nav className="bg-white border-b border-gray-200 px-6 md:px-12 py-4">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-3">
            <Route className="w-8 h-8 text-blue-600" />
            <div>
              <h1 className="text-2xl font-bold text-gray-900">Van {id} Route</h1>
              <p className="text-sm text-gray-500">Real-time route monitoring</p>
            </div>
          </div>
          <Link
            href="/admin/routes"
            className="px-4 py-2 bg-gray-100 hover:bg-gray-200 text-gray-700 rounded-lg transition-colors text-sm font-medium"
          >
            ← Back to Routes
          </Link>
        </div>
      </nav>

      <div className="px-6 md:px-12 py-6 space-y-6">
        {/* Quick Stats Dashboard */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
          <QuickStatCard 
            icon={<Users className="w-5 h-5" />}
            label="Total Students" 
            value={students.length}
            color="blue"
          />
          <QuickStatCard 
            icon={<Clock className="w-5 h-5" />}
            label="Active Today" 
            value={filteredStudents.length}
            color="green"
          />
          <QuickStatCard 
            icon={<MapPin className="w-5 h-5" />}
            label="On The Way" 
            value={students.filter((s) => s.route_status === 'OnTheWay').length}
            color="orange"
          />
          <QuickStatCard 
            icon={<Route className="w-5 h-5" />}
            label="Total Stops" 
            value="12"
            color="purple"
          />
        </div>

        {/* Main Dashboard Grid */}
        <div className="grid grid-cols-1 xl:grid-cols-12 gap-6">
          {/* Left Column - Route Visualization */}
          <div className="xl:col-span-8 space-y-6">
            {/* Route Map */}
            <ModernCard title="Live Route Tracking" className="h-80">
              <div className="flex items-center justify-center h-full rounded-xl bg-gradient-to-br from-blue-50 to-indigo-100 border-2 border-dashed border-blue-200">
                <div className="text-center">
                  <MapPin className="w-12 h-12 text-blue-400 mx-auto mb-2" />
                  <p className="text-blue-600 font-medium">Interactive Route Map</p>
                  <p className="text-blue-500 text-sm">Real-time vehicle tracking</p>
                </div>
              </div>
            </ModernCard>

            {/* Students Table with Integrated Search */}
            <ModernCard title="Student Manifest" className="min-h-96">
              <div className="space-y-4">
                <div className="flex flex-col sm:flex-row gap-4 items-start sm:items-center justify-between">
                  <div className="flex items-center gap-2">
                    <Users className="w-5 h-5 text-gray-400" />
                    <span className="text-lg font-semibold text-gray-900">
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
                        searchPlaceholder: 'Search by name, parent, or phone...',
                        statusOptions: [
                          { value: '', label: 'All Status' },
                          { value: 'OnTheWay', label: 'On The Way' },
                          { value: 'Finished', label: 'Finished' },
                          { value: 'inTheVan', label: 'In the Van' },
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
                    { key: 'studentName', label: 'Student Name' },
                    { key: 'parentName', label: 'Parent Name' },
                    { key: 'parentPhone', label: 'Parent Phone' },
                    { key: 'route_status', label: 'Status' },
                  ]}
                  data={filteredStudents}
                  actions={[
                    {
                      type: 'custom',
                      label: 'View',
                      icon: <FileText size={16} color="blue" />,
                      onClick: () => {},
                    },
                  ]}
                />
              </div>
            </ModernCard>
          </div>

          {/* Right Sidebar - Controls & Info */}
          <aside className="xl:col-span-4 space-y-6">
            {/* Calendar Widget */}
            <ModernCard title="Date Selection" className="h-fit">
              <Calendar selectedDate={selectedDate} onDateChange={setSelectedDate} />
            </ModernCard>

            {/* Route Schedule */}
            <ModernCard title="Today's Schedule" className="h-fit">
              <div className="space-y-4">
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
            </ModernCard>

            {/* Route Insights */}
            <ModernCard title="Route Insights" className="h-fit">
              <div className="space-y-3">
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
            </ModernCard>
          </aside>
        </div>
      </div>
    </div>
    
  );
}

/* Modern Components */
function ModernCard({ 
  title, 
  children, 
  className = "" 
}: { 
  title: string; 
  children: React.ReactNode; 
  className?: string;
}) {
  return (
    <div className={`bg-white rounded-2xl border border-gray-200 shadow-sm hover:shadow-lg transition-all duration-200 ${className}`}>
      <div className="p-6">
        <h2 className="text-lg font-semibold text-gray-900 mb-4">{title}</h2>
        {children}
      </div>
    </div>
  );
}

function QuickStatCard({ 
  icon, 
  label, 
  value, 
  color 
}: { 
  icon: React.ReactNode; 
  label: string; 
  value: string | number; 
  color: 'blue' | 'green' | 'orange' | 'purple';
}) {
  const colorClasses = {
    blue: 'bg-blue-500 text-white',
    green: 'bg-green-500 text-white',
    orange: 'bg-orange-500 text-white',
    purple: 'bg-purple-500 text-white',
  };

  return (
    <div className="bg-white rounded-xl border border-gray-200 p-4 shadow-sm hover:shadow-md transition-shadow">
      <div className="flex items-center gap-3">
        <div className={`p-2 rounded-lg ${colorClasses[color]}`}>
          {icon}
        </div>
        <div>
          <p className="text-sm text-gray-500">{label}</p>
          <p className="text-xl font-bold text-gray-900">{value}</p>
        </div>
      </div>
    </div>
  );
}

function ScheduleItem({ 
  time, 
  event, 
  status 
}: { 
  time: string; 
  event: string; 
  status: 'completed' | 'in-progress' | 'pending';
}) {
  const statusClasses = {
    completed: 'bg-green-100 text-green-800 border-green-200',
    'in-progress': 'bg-blue-100 text-blue-800 border-blue-200',
    pending: 'bg-gray-100 text-gray-600 border-gray-200',
  };

  const dotClasses = {
    completed: 'bg-green-500',
    'in-progress': 'bg-blue-500',
    pending: 'bg-gray-400',
  };

  return (
    <div className="flex items-center gap-3">
      <div className={`w-3 h-3 rounded-full ${dotClasses[status]}`}></div>
      <div className="flex-1">
        <div className="flex items-center justify-between">
          <span className="font-medium text-gray-900 text-sm">{event}</span>
          <span className="text-xs text-gray-500">{time}</span>
        </div>
      </div>
    </div>
  );
}

function InsightItem({ 
  type, 
  title, 
  description 
}: { 
  type: 'warning' | 'info' | 'success'; 
  title: string; 
  description: string;
}) {
  const typeClasses = {
    warning: 'bg-amber-50 border-amber-200 text-amber-800',
    info: 'bg-blue-50 border-blue-200 text-blue-800',
    success: 'bg-green-50 border-green-200 text-green-800',
  };

  return (
    <div className={`p-3 rounded-lg border ${typeClasses[type]}`}>
      <p className="font-medium text-xs uppercase tracking-wide mb-1">{title}</p>
      <p className="text-sm">{description}</p>
    </div>
  );
}