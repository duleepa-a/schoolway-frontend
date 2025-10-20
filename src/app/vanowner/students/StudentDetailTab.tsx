'use client';

import { useState } from 'react';
import EnrolledTable from './EnrolledTable';
import StudentRequests from './StudentRequests';

export default function EnrolledStudents() {
  const [activeTab, setActiveTab] = useState('enrolled');

  return (
    <div className="bg-white rounded-2xl shadow-card p-8">
      {/* Tabs */}
      <div className="flex gap-6 border-b-2 border-[var(--blue-shade-light)] mb-6">
        <button
          onClick={() => setActiveTab('enrolled')}
          className={`pb-2 font-semibold cursor-pointer transition-colors duration-200
            ${activeTab === 'enrolled'
              ? 'border-b-4 border-[var(--blue-shade-dark)] text-[var(--blue-shade-dark)]'
              : 'text-[var(--color-inactive-text)]'
          }`}
        >
          Enrolled Students
        </button>
        <button
          onClick={() => setActiveTab('requests')}
          className={`pb-2 font-semibold cursor-pointer transition-colors duration-200
            ${activeTab === 'requests'
              ? 'border-b-4 border-[var(--blue-shade-dark)] text-[var(--blue-shade-dark)]'
              : 'text-[var(--color-inactive-text)]'
          }`}
        >
          Enrollment Requests
        </button>
      </div>

      {activeTab === 'enrolled' && (
        <EnrolledTable/>
      )}

      {activeTab === 'requests' && (
        <StudentRequests/>
      )}
    </div>
  );
}
