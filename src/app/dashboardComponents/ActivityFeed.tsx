'use client';

import { FaCheckCircle, FaTimesCircle, FaCar, FaUserPlus, FaUserMinus, FaExchangeAlt, FaFlag } from 'react-icons/fa';

const activityData = [
  {
    id: 1,
    type: 'driver_accepted',
    icon: <FaCheckCircle className="text-green-500" />,
    message: 'Ruwan Silva accepted Kasun Perera for his vehicle',
    time: '2 mins ago',
    priority: 'high'
  },
  {
    id: 2,
    type: 'vehicle_found',
    icon: <FaCar className="text-blue-500" />,
    message: 'Thilina Jayasuriya found a vehicle (Van-LK-2345)',
    time: '15 mins ago',
    priority: 'medium'
  },
  {
    id: 3,
    type: 'driver_removed',
    icon: <FaUserMinus className="text-red-500" />,
    message: 'Chaminda Rajapaksha was removed from service',
    time: '1 hour ago',
    priority: 'high'
  },
  {
    id: 4,
    type: 'driver_joined',
    icon: <FaUserPlus className="text-green-500" />,
    message: 'Mahesh Fernando joined as a new driver',
    time: '2 hours ago',
    priority: 'medium'
  },
  {
    id: 5,
    type: 'vehicle_transfer',
    icon: <FaExchangeAlt className="text-orange-500" />,
    message: 'Vehicle transfer: Van-LK-1234 from Isuru to Sandun',
    time: '3 hours ago',
    priority: 'medium'
  },
  {
    id: 6,
    type: 'route_assigned',
    icon: <FaFlag className="text-purple-500" />,
    message: 'Lakmal Gunasekara assigned to Colombo-Kandy route',
    time: '4 hours ago',
    priority: 'low'
  },
  {
    id: 7,
    type: 'driver_accepted',
    icon: <FaCheckCircle className="text-green-500" />,
    message: 'Nishani Perera accepted Roshan Mendis for her vehicle',
    time: '5 hours ago',
    priority: 'high'
  }
];

const ActivityFeed = () => {
  return (
    <div className="activity-feed-container">
      <h3 className="activity-feed-title">Recent Activity</h3>
      
      <div className="activity-feed-list">
        {activityData.map((activity) => (
          <div key={activity.id} className={`activity-feed-item ${activity.priority === 'high' ? 'activity-priority-high' : activity.priority === 'medium' ? 'activity-priority-medium' : 'activity-priority-low'}`}>
            <div className="activity-icon-wrapper">
              {activity.icon}
            </div>
            
            <div className="activity-content">
              <p className="activity-message">{activity.message}</p>
              <span className="activity-time">{activity.time}</span>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default ActivityFeed;
