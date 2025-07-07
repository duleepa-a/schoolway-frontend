'use client';
import React from 'react';

// Creative activity data types
interface ActivityItem {
  id: string;
  type: 'accepted' | 'vehicle' | 'removed' | 'pending' | 'submitted';
  title: string;
  description: string;
  userName: string;
  userId: string;
  timestamp: string;
  status?: 'approved' | 'pending' | 'rejected' | 'review';
}

// Sample activity data with creative scenarios
const activityData: ActivityItem[] = [
  {
    id: '1',
    type: 'accepted',
    title: 'Driver Application Approved',
    description: 'Successfully completed background check and vehicle inspection.',
    userName: 'Sarah Johnson',
    userId: 'DR001',
    timestamp: '2 minutes ago',
    status: 'approved'
  },
  {
    id: '2',
    type: 'vehicle',
    title: 'Vehicle Registration Added',
    description: 'New vehicle (Toyota Hiace 2023) registered for school transport.',
    userName: 'Michael Chen',
    userId: 'DR034',
    timestamp: '15 minutes ago',
    status: 'review'
  },
  {
    id: '3',
    type: 'submitted',
    title: 'New Driver Application',
    description: 'Application submitted with all required documents and certifications.',
    userName: 'Emma Williams',
    userId: 'DR067',
    timestamp: '1 hour ago',
    status: 'pending'
  },
  {
    id: '4',
    type: 'removed',
    title: 'Driver Removed from System',
    description: 'Failed safety inspection - license suspended pending review.',
    userName: 'Robert Davis',
    userId: 'DR023',
    timestamp: '2 hours ago',
    status: 'rejected'
  },
  {
    id: '5',
    type: 'pending',
    title: 'Insurance Verification Pending',
    description: 'Waiting for insurance company confirmation for policy validation.',
    userName: 'Lisa Rodriguez',
    userId: 'DR089',
    timestamp: '4 hours ago',
    status: 'pending'
  },
  {
    id: '6',
    type: 'accepted',
    title: 'Route Assignment Completed',
    description: 'Assigned to Route 12A covering Downtown Elementary Schools.',
    userName: 'James Thompson',
    userId: 'DR045',
    timestamp: '6 hours ago',
    status: 'approved'
  },
  {
    id: '7',
    type: 'vehicle',
    title: 'Vehicle Maintenance Update',
    description: 'Completed scheduled maintenance and safety inspection.',
    userName: 'Maria Garcia',
    userId: 'DR056',
    timestamp: '8 hours ago',
    status: 'approved'
  },
  {
    id: '8',
    type: 'submitted',
    title: 'Medical Certificate Uploaded',
    description: 'Annual medical fitness certificate submitted for renewal.',
    userName: 'David Kim',
    userId: 'DR078',
    timestamp: '1 day ago',
    status: 'review'
  }
];

const ActivityFeed: React.FC = () => {
  const getActivityTypeClass = (type: string) => {
    switch (type) {
      case 'accepted': return 'activity-accepted';
      case 'vehicle': return 'activity-vehicle';
      case 'removed': return 'activity-removed';
      case 'pending': return 'activity-pending';
      case 'submitted': return 'activity-submitted';
      default: return 'activity-pending';
    }
  };

  const getStatusClass = (status: string | undefined) => {
    switch (status) {
      case 'approved': return 'status-approved';
      case 'pending': return 'status-pending';
      case 'rejected': return 'status-rejected';
      case 'review': return 'status-review';
      default: return 'status-pending';
    }
  };

  return (
    <div className="activity-feed-container">
      <h3 className="activity-feed-title">Recent Activity</h3>
      
      <div className="activity-feed-list">
        {activityData.map((activity) => (
          <div 
            key={activity.id} 
            className={`activity-item ${getActivityTypeClass(activity.type)}`}
          >
            <div className="activity-content">
              <div className="activity-header">
                <h4 className="activity-title">{activity.title}</h4>
                <span className="activity-time">{activity.timestamp}</span>
              </div>
              
              <p className="activity-description">{activity.description}</p>
              
              <div className="flex items-center gap-2 mt-2">
                <span className="activity-user-badge">
                  {activity.userName} ({activity.userId})
                </span>
                
                {activity.status && (
                  <span className={`activity-status-badge ${getStatusClass(activity.status)}`}>
                    {activity.status.charAt(0).toUpperCase() + activity.status.slice(1)}
                  </span>
                )}
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default ActivityFeed;
