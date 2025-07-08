'use client';

import { useState } from 'react';
import PrivatehireTable from './PrivatehireTable';
import AcceptedhiresTable from './AcceptedhiresTable';


export default function PrivateHireDetailTab() {
  const [activeTab, setActiveTab] = useState('new');

  return (
    <div className="">
      {/* Tabs */}
      <div className="flex gap-6 border-b border-border-bold-shade mb-4">
        <button
          onClick={() => setActiveTab('new')}
          className={`pb-2 font-medium cursor-pointer 
            
            ${activeTab === 'new'
              ? 'border-b-2 border-primary text-active-text'
              : 'text-inactive-text'
          }`}

        >
          New hires
        </button>
        <button
          onClick={() => setActiveTab('accepted')}
          className={`pb-2 font-medium cursor-pointer 
            
            ${activeTab === 'accepted'
              ? 'border-b-2 border-primary text-active-text'
              : 'text-inactive-text'
          }`}
        >
          Accepted hires
        </button>
      </div>

      {activeTab === 'new' && (
        <PrivatehireTable/>
      )}

      {activeTab === 'accepted' && (
        <AcceptedhiresTable/>
      )}

      

    </div>
  );
}
