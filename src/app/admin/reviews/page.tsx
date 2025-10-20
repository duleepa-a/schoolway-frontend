'use client';

import { useState } from 'react';
import TopBarContent from '@/app/dashboardComponents/TopBarContent';
import ReviewsPageContent from './ReviewsPageContent';

const TABS = ['statistics', 'drivers', 'van-services'];

const ReviewsPage = () => {
  const [activeTab, setActiveTab] = useState('statistics');

  const handleTabChange = (tab: string) => {
    setActiveTab(tab);
  };

  return (
    <div className="min-h-screen w-full bg-gray-50">
      {/* Fixed Header */}
      <div className="sticky top-0 z-50 bg-gray-50/80 backdrop-blur-md border-b border-gray-200/50">
        <div className="p-4 md:p-8 pb-0 pt-0">
          {/*Top bar with profile icon and the heading*/}
          <TopBarContent heading="Reviews" serverSession={null} />     

          {/* Tabs */}
          <div className="flex gap-6 border-b border-gray-300/30 mb-0 pt-0">
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
        </div>
      </div>

      {/* Scrollable Content */}
      <div className="p-4 md:p-8 pt-0">
        <ReviewsPageContent activeTab={activeTab} />
      </div>
    </div>
  );
};

export default ReviewsPage;
