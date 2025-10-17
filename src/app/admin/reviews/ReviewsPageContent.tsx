'use client';

import { useEffect, useState } from 'react';
import { useRouter, useSearchParams } from 'next/navigation';
import DriverReviewsTab from './DriverReviewsTab';
import VanServiceReviewsTab from './VanServiceReviewsTab';
import StatisticsTab from './StatisticsTab';

const TABS = ['statistics', 'drivers', 'van-services'];

interface Review {
  id: string;
  childId: number;
  reviewType: 'DRIVER' | 'VAN_SERVICE';
  targetId: string;
  rating: number;
  comment: string | null;
  createdAt: string;
  updatedAt: string;
  vanId: number;
  Child: {
    id: number;
    name: string;
  };
  UserProfile: {
    id: string;
    firstname: string | null;
    lastname: string | null;
  };
  Van: {
    id: number;
    registrationNumber: string;
    makeAndModel: string;
  };
}

export default function ReviewsPageContent() {
  const router = useRouter();
  const searchParams = useSearchParams();

  const initialTab = searchParams.get('tab') || 'statistics';
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
                ? 'border-b-2 text-gray-700'
                : 'text-gray-500'
            }`}
            style={activeTab === tab ? { borderBottomColor: '#0099cc' } : {}}
          >
            {tab.replace('-', ' ')} Reviews
          </button>
        ))}
      </div>

      {/* Render Active Tab */}
      {activeTab === 'statistics' && <StatisticsTab />}
      {activeTab === 'drivers' && <DriverReviewsTab />}
      {activeTab === 'van-services' && <VanServiceReviewsTab />}
    </>
  );
}
