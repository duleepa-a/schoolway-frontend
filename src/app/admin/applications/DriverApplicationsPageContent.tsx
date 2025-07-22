'use client';

import {  useState } from 'react';
import { useRouter, useSearchParams } from 'next/navigation';
import DriverTab from './driverTab';
import VanTab from './vanTab';
import StatisticsTab from './StatisticsTab';

const TABS = ['drivers', 'vehicles', 'statistics'];

export default function ApplicationsPage() {
  const router = useRouter();
  const searchParams = useSearchParams();

  const initialTab = searchParams.get('tab') || 'drivers';
  const [activeTab, setActiveTab] = useState(initialTab);

  // Update URL when tab changes
  const handleTabChange = (tab: string) => {
    setActiveTab(tab);
    const params = new URLSearchParams(window.location.search);
    params.set('tab', tab);
    router.replace(`?${params.toString()}`);
  };

  return (
    <>

      {/* Tabs */}
      <div className="flex gap-6 border-b border-gray-300 mb-6">
        {TABS.map((tab) => (
          <button
            key={tab}
            onClick={() => handleTabChange(tab)}
            className={`pb-2 font-medium capitalize ${
              activeTab === tab
                ? 'border-b-2 border-yellow-500 text-yellow-600'
                : 'text-gray-500'
            }`}
          >
        {tab === 'statistics' ? 'Statistics' : `${tab} Applications`}
      </button>
))}

        
        
      </div>

      {/* Render Active Tab */}
      {activeTab === 'drivers' && <DriverTab />}
      {activeTab === 'vehicles' && <VanTab />}
      {activeTab === 'statistics' && <StatisticsTab />}
    </>
  );
}
