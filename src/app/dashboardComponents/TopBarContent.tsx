'use client';
import { useEffect, useState, useRef } from 'react';
import { useSession, signOut } from 'next-auth/react';
import { FaBell, FaMoon } from 'react-icons/fa';
import { useRouter } from 'next/navigation';
import { BiLogOut } from "react-icons/bi";
import { Session } from "next-auth";
import Image from 'next/image';

interface Props {
  heading: string;
  serverSession: Session | null;
}

interface Notification {
  id: string;
  title: string;
  message: string;
  type: string;
  read: boolean;
  createdAt: string;
}

const TopBarContent = ({ heading, serverSession }: Props) => {
  const Router = useRouter();
  const { data: clientSession } = useSession();
  const [showNotifications, setShowNotifications] = useState(false);
  const [notifications, setNotifications] = useState<Notification[]>([]);
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
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  // Fetch notifications from API
  useEffect(() => {
    const fetchNotifications = async () => {
      if (!session?.user?.id) return;

      try {
        const res = await fetch(`/api/notifications?userId=${session.user.id}`);
        if (!res.ok) throw new Error('Failed to fetch notifications');
        const data: Notification[] = await res.json();

        const formatted = data.map(n => ({
          ...n,
          createdAt: new Date(n.createdAt).toLocaleString()
        }));

        setNotifications(formatted);
      } catch (err) {
        console.error(err);
      }
    };

    fetchNotifications();
  }, [session?.user?.id]);

  const toggleNotifications = () => setShowNotifications(!showNotifications);
  const unreadCount = notifications.filter(n => !n.read).length;

  // Mark single notification as read (API + state)
  const markAsRead = async (id: string) => {
    try {
      await fetch('/api/notifications/read', {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ notificationId: id }),
      });

      setNotifications(prev =>
        prev.map(n => n.id === id ? { ...n, read: true } : n)
      );
    } catch (err) {
      console.error('Failed to mark notification as read', err);
    }
  };

  // Mark all notifications as read (API + state)
  const markAllAsRead = async () => {
    try {
      await Promise.all(
        notifications.filter(n => !n.read).map(n =>
          fetch('/api/notifications/read', {
            method: 'PATCH',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ notificationId: n.id }),
          })
        )
      );
      setNotifications(prev => prev.map(n => ({ ...n, read: true })));
    } catch (err) {
      console.error('Failed to mark all notifications as read', err);
    }
  };

  return (
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
                  <div className="p-4 text-center text-gray-500">No notifications</div>
                ) : (
                  notifications.map((notification) => (
                    <div
                      key={notification.id}
                      className={`p-4 border-b border-gray-100 hover:bg-gray-50 cursor-pointer ${
                        !notification.read ? 'bg-blue-50' : ''
                      }`}
                      onClick={() => markAsRead(notification.id)}
                    >
                      <div className="flex justify-between items-start">
                        <div className="flex-1">
                          <h4 className={`text-sm font-medium ${
                            !notification.read ? 'text-gray-900' : 'text-gray-700'
                          }`}>
                            {notification.title}
                          </h4>
                          <p className="text-sm text-gray-600 mt-1">{notification.message}</p>
                          <p className="text-xs text-gray-400 mt-2">{notification.createdAt}</p>
                        </div>
                        {!notification.read && (
                          <div className="w-2 h-2 bg-primary rounded-full flex-shrink-0 mt-1"></div>
                        )}
                      </div>
                    </div>
                  ))
                )}
              </div>

              <div className="p-3 border-t border-gray-200 text-center">
                <button
                  className="text-sm text-primary hover:text-blue-800 cursor-pointer"
                  onClick={() => Router.push('/notifications')}
                >
                  View all notifications
                </button>
              </div>
            </div>
          )}
        </div>

        <FaMoon className="topBarIcon" />

        <BiLogOut className='topBarIcon text-2xl'
          onClick={() => signOut({ callbackUrl: "/" })}
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
  );
};

export default TopBarContent;
