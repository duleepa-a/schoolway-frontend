'use client';

import { useState } from 'react';
import { useRouter, useSearchParams } from 'next/navigation';
import { Users, UserCheck, UserX } from 'lucide-react';
import DriversTab from './DriversTab';
import ParentsTab from './ParentsTab';
import VanOwnersTab from './VanOwnersTab';
import AllUsersTab from './AllUsersTab';

const TABS = [
  { key: 'drivers', label: 'Drivers', icon: Users },
  { key: 'van-owners', label: 'Van Service Owners', icon: UserX },
  { key: 'parents', label: 'Parents', icon: UserCheck },
  { key: 'all-users', label: 'All Users', icon: Users }
];

export default function UserTabsLayout() {
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

  const activeTabInfo = TABS.find(tab => tab.key === activeTab);

  return (
    <div className="max-w-7xl mx-auto">
      {/* Modern Header */}
      <div className="bg-white rounded-xl shadow-lg border border-gray-100 overflow-hidden mb-6">
        <div className="px-6 py-4" style={{ background: 'linear-gradient(90deg, #0099cc 0%, #00bcd4 60%, #00d4aa 100%)' }}>
          <div className="flex items-center justify-between">
            <div className="flex items-center">
              <div className="bg-white/20 p-2 rounded-lg mr-3">
                {activeTabInfo && <activeTabInfo.icon className="text-white" size={24} />}
              </div>
              <div>
                <h1 className="text-2xl font-bold text-white">User Management</h1>
                <p className="text-white/80 text-sm">Manage and oversee all system users</p>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Modern Tabs */}
      <div className="bg-white rounded-xl shadow-lg border border-gray-100 overflow-hidden mb-6">
        <div className="px-6 py-4 bg-gradient-to-r from-gray-50 to-gray-100 border-b border-gray-200">
          <div className="flex gap-1">
            {TABS.map((tab) => {
              const IconComponent = tab.icon;
              return (
                <button
                  key={tab.key}
                  onClick={() => handleTabChange(tab.key)}
                  className={`flex items-center gap-2 px-4 py-2 rounded-lg font-medium transition-all duration-200 ${
                    activeTab === tab.key
                      ? 'bg-white text-blue-600 shadow-sm border border-blue-200'
                      : 'text-gray-600 hover:text-gray-800 hover:bg-white/50'
                  }`}
                >
                  <IconComponent size={18} />
                  {tab.label}
                </button>
              );
            })}
          </div>
        </div>
      </div>

        {/* Tab Content */}
        <div className="bg-white rounded-xl shadow-lg border border-gray-100 overflow-hidden">
          {activeTab === 'drivers' && <DriversTab />}
          {activeTab === 'van-owners' && <VanOwnersTab />}
          {activeTab === 'parents' && <ParentsTab />}
          {activeTab === 'all-users' && <AllUsersTab />}
        </div>
    </div>
  );
}
