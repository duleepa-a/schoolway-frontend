'use client'
import { useEffect, useState, useRef } from 'react';
import { useSession, signOut } from 'next-auth/react';
import { FaBell, FaMoon } from 'react-icons/fa';
import { BiLogOut } from "react-icons/bi";
import { Session } from "next-auth";
import Image from 'next/image';

interface Props {
  heading: string;
  serverSession: Session | null;
}

interface Notification {
  id: number;
  title: string;
  message: string;
  time: string;
  isRead: boolean;
}

const TopBarContent = ({ heading, serverSession }: Props) => {
  const { data: clientSession, status } = useSession();
  const [showNotifications, setShowNotifications] = useState(false);
  const [notifications, setNotifications] = useState<Notification[]>([
    {
      id: 1,
      title: "New Message",
      message: "You have received a new message from John Doe",
      time: "2 minutes ago",
      isRead: false
    },
    {
      id: 2,
      title: "System Update",
      message: "System maintenance scheduled for tonight",
      time: "1 hour ago",
      isRead: false
    },
    {
      id: 3,
      title: "Task Completed",
      message: "Your report has been successfully generated",
      time: "3 hours ago",
      isRead: true
    }
  ]);

  const notificationRef = useRef<HTMLDivElement>(null);
  const session = clientSession || serverSession;

  // Close dropdown when clicking outside
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (notificationRef.current && !notificationRef.current.contains(event.target as Node)) {
        setShowNotifications(false);
      }
    };

    document.addEventListener('mousedown', handleClickOutside);
    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, []);

  const toggleNotifications = () => {
    setShowNotifications(!showNotifications);
  };

  const markAsRead = (id: number) => {
    setNotifications(prev => 
      prev.map(notification => 
        notification.id === id 
          ? { ...notification, isRead: true }
          : notification
      )
    );
  };

  const markAllAsRead = () => {
    setNotifications(prev => 
      prev.map(notification => ({ ...notification, isRead: true }))
    );
  };

  const unreadCount = notifications.filter(n => !n.isRead).length;

  return (
    <>
      <div className="topBarWrapper sticky top-0 z-10 bg-[#F4F7FE]">
        <div>
          <h2 className="text-2xl font-bold text-gray-800 mb-6">{heading}</h2>
        </div>
        <div className="topBarIcons">
          <div className="relative" ref={notificationRef}>
            <div className="relative cursor-pointer" onClick={toggleNotifications}>
              <FaBell className="topBarIcon ml-5" />
              {unreadCount > 0 && (
                <span className="absolute -top-2 -right-3 bg-red-500 text-white text-[10px] rounded-full h-4 w-4 flex items-center justify-center min-w-[16px]">
                  {unreadCount > 99 ? '99+' : unreadCount}
                </span>
              )}
            </div>
            
            {showNotifications && (
              <div className="absolute right-0 mt-2 w-80 bg-white border border-gray-200 rounded-lg shadow-lg z-50">
                <div className="p-4 border-b border-gray-200 flex justify-between items-center">
                  <h3 className="text-lg font-semibold text-gray-800">Notifications</h3>
                  {unreadCount > 0 && (
                    <button
                      onClick={markAllAsRead}
                      className="text-sm text-primary hover:text-blue-800"
                    >
                      Mark all as read
                    </button>
                  )}
                </div>
                
                <div className="max-h-96 overflow-y-auto">
                  {notifications.length === 0 ? (
                    <div className="p-4 text-center text-gray-500">
                      No notifications
                    </div>
                  ) : (
                    notifications.map((notification) => (
                      <div
                        key={notification.id}
                        className={`p-4 border-b border-gray-100 hover:bg-gray-50 cursor-pointer ${
                          !notification.isRead ? 'bg-blue-50' : ''
                        }`}
                        onClick={() => markAsRead(notification.id)}
                      >
                        <div className="flex justify-between items-start">
                          <div className="flex-1">
                            <h4 className={`text-sm font-medium ${
                              !notification.isRead ? 'text-gray-900' : 'text-gray-700'
                            }`}>
                              {notification.title}
                            </h4>
                            <p className="text-sm text-gray-600 mt-1">
                              {notification.message}
                            </p>
                            <p className="text-xs text-gray-400 mt-2">
                              {notification.time}
                            </p>
                          </div>
                          {!notification.isRead && (
                            <div className="w-2 h-2 bg-primary rounded-full flex-shrink-0 mt-1"></div>
                          )}
                        </div>
                      </div>
                    ))
                  )}
                </div>
                
                <div className="p-3 border-t border-gray-200 text-center">
                  <button className="text-sm text-primary hover:text-blue-800">
                    View all notifications
                  </button>
                </div>
              </div>
            )}
          </div>

          <FaMoon className="topBarIcon" />
          
          <BiLogOut className='topBarIcon text-2xl' 
                  onClick={() =>
                            signOut({ callbackUrl: "/" })
                          }
          />
          <Image
            src={session?.user?.dp || "/Images/male_pro_pic_placeholder.png"}
            alt="Profile"
            width={50}
            height={50}
            className="topBarImage" 
          />
        </div>
      </div>
    </>
  );
};

export default TopBarContent;