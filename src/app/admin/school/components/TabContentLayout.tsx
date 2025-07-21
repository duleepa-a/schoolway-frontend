'use client';

import { useState } from 'react';
import ManageSchoolsPageContent from '../ManageSchoolsPageContent';
import GuradianPageContent from '../../guardian/GuradianPageContent';



export default function TabContentLayout() {
  const [activeTab, setActiveTab] = useState('school');

  return (
    <div className="">
      {/* Tabs */}
      <div className="flex gap-6 border-b border-border-bold-shade mb-4">
        <button
          onClick={() => setActiveTab('school')}
          className={`pb-2 font-medium cursor-pointer 
            
            ${activeTab === 'school'
              ? 'border-b-2 border-primary text-active-text'
              : 'text-inactive-text'
          }`}

        >
          School
        </button>
        <button
          onClick={() => setActiveTab('gurdian')}
          className={`pb-2 font-medium cursor-pointer 
            
            ${activeTab === 'gurdian'
              ? 'border-b-2 border-primary text-active-text'
              : 'text-inactive-text'
          }`}
        >
          Gurdians
        </button>
      </div>

      {activeTab === 'school' && (
        <ManageSchoolsPageContent/>
      )}

      {activeTab === 'gurdian' && (
        <GuradianPageContent/>
      )}

      

    </div>
  );
}
