'use client';

import { useState } from 'react';
import EnrolledTable from './EnrolledTable';
import StudentRequests from './StudentRequests';

export default function EnrolledStudents() {
  const [activeTab, setActiveTab] = useState('enrolled');

  return (
    <div className="">
      {/* Tabs */}
      <div className="flex gap-6 border-b border-border-bold-shade mb-4">
        <button
          onClick={() => setActiveTab('enrolled')}
          className={`pb-2 font-medium cursor-pointer 
            
            ${activeTab === 'enrolled'
              ? 'border-b-2 border-primary text-active-text'
              : 'text-inactive-text'
          }`}

        >
          Enrolled Students
        </button>
        <button
          onClick={() => setActiveTab('requests')}
          className={`pb-2 font-medium cursor-pointer 
            
            ${activeTab === 'requests'
              ? 'border-b-2 border-primary text-active-text'
              : 'text-inactive-text'
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
