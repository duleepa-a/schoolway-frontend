'use client';

import { useState } from 'react';
import TopBarContent from '@/app/dashboardComponents/TopBarContent';
import AwarenessPostCreator from './AwarenessPost';
import PublishedPostsViewer from './PublishedPostsViewer';
import DraftsViewer from './DraftsViewer';
import ScheduledPostsViewer from './ScheduledPostsViewer';
import { useScheduledPostsPublishing } from '@/hooks/useScheduledPostsPublishing';

const AdminDashboard = () => {
  const [activeTab, setActiveTab] = useState<'create' | 'published' | 'drafts' | 'scheduled'>('create');

  // Start background job to publish scheduled posts
  useScheduledPostsPublishing({
    intervalMs: 2 * 60 * 1000, // Check every 2 minutes
    enabled: true,
  });

  return (
    <div className="min-h-screen w-full bg-gray-50">
      {/* Fixed Header */}
      <div className="sticky top-0 z-50 bg-gray-50/80 backdrop-blur-md border-b border-gray-200/50">
        <div className="p-4 md:p-8 pb-0 pt-0">
          {/*Top bar with profile icon and the heading*/}
          <TopBarContent heading="Awareness Posts" serverSession={null} />     

          {/* Tabs */}
          <div className="flex gap-6 border-b border-gray-300/30 mb-0 pt-0">
        <button
          onClick={() => setActiveTab('create')}
          className={`pb-2 font-medium capitalize ${
            activeTab === 'create'
              ? 'border-b-2 text-gray-700'
              : 'text-gray-500'
          }`}
          style={activeTab === 'create' ? { borderBottomColor: '#0099cc' } : {}}
        >
          Create a Post
        </button>
        <button
          onClick={() => setActiveTab('published')}
          className={`pb-2 font-medium capitalize ${
            activeTab === 'published'
              ? 'border-b-2 text-gray-700'
              : 'text-gray-500'
          }`}
          style={activeTab === 'published' ? { borderBottomColor: '#0099cc' } : {}}
        >
          Published Posts
        </button>
        <button
          onClick={() => setActiveTab('drafts')}
          className={`pb-2 font-medium capitalize ${
            activeTab === 'drafts'
              ? 'border-b-2 text-gray-700'
              : 'text-gray-500'
          }`}
          style={activeTab === 'drafts' ? { borderBottomColor: '#0099cc' } : {}}
        >
          Drafts
        </button>
        <button
          onClick={() => setActiveTab('scheduled')}
          className={`pb-2 font-medium capitalize ${
            activeTab === 'scheduled'
              ? 'border-b-2 text-gray-700'
              : 'text-gray-500'
          }`}
          style={activeTab === 'scheduled' ? { borderBottomColor: '#0099cc' } : {}}
        >
          Scheduled Posts
        </button>
          </div>
        </div>
      </div>

      {/* Scrollable Content */}
      <div className="p-4 md:p-8 pt-0">
        {/* Main Content */}
        {activeTab === 'create' && <AwarenessPostCreator />}
        {activeTab === 'published' && <PublishedPostsViewer />}
        {activeTab === 'drafts' && <DraftsViewer />}
        {activeTab === 'scheduled' && <ScheduledPostsViewer />}
      </div>
    </div>
  )
}

export default AdminDashboard
