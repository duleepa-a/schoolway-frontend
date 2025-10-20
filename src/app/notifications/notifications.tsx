'use client';

import React, { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import { ArrowLeft, Bell, CheckCircle, AlertTriangle, Info, Clock } from 'lucide-react';
import { Session } from "next-auth";

interface Notification {
    id: string;
    type: 'ALERT' | 'REMINDER' | 'EMERGENCY' | 'PAYMENT' | 'ATTENDANCE' | 'ANNOUNCEMENT';
    title: string;
    message: string;
    createdAt: string;
    read: boolean;
}

interface Props {
  serverSession: Session | null;
}

const getNotificationIcon = (type: string) => {
    switch (type) {
        case 'ALERT':
        case 'EMERGENCY':
            return <AlertTriangle className="w-5 h-5 text-red-500" />;
        case 'REMINDER':
        case 'PAYMENT':
        case 'ATTENDANCE':
            return <CheckCircle className="w-5 h-5 text-green-500" />;
        case 'ANNOUNCEMENT':
            return <Info className="w-5 h-5 text-blue-500" />;
        default:
            return <Bell className="w-5 h-5 text-gray-500" />;
    }
};

const getNotificationBg = (type: string, read: boolean) => {
    if (read) return 'bg-white';

    switch (type) {
        case 'ALERT':
        case 'EMERGENCY':
            return 'bg-red-50';
        case 'REMINDER':
        case 'PAYMENT':
        case 'ATTENDANCE':
            return 'bg-green-50';
        case 'ANNOUNCEMENT':
            return 'bg-blue-50';
        default:
            return 'bg-white';
    }
};

export default function Notifications({ serverSession }: Props) {
    const router = useRouter();
    const [notifications, setNotifications] = useState<Notification[]>([]);
    const [loading, setLoading] = useState(true);

    const session = serverSession; // you can replace with client session if using useSession

    const fetchNotifications = async () => {
        if (!session?.user?.id) return;
        try {
            const res = await fetch(`/api/notifications?userId=${session.user.id}`);
            const data = await res.json();
            setNotifications(data);
        } catch (err) {
            console.error('Failed to fetch notifications', err);
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        fetchNotifications();
    }, [session?.user?.id]);

    const markAsRead = async (notificationId: string) => {
        try {
            await fetch('/api/notifications/read', {
                method: 'PATCH',
                headers: {
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify({ notificationId })
            });

            setNotifications(prev =>
                prev.map(n => n.id === notificationId ? { ...n, read: true } : n)
            );
        } catch (err) {
            console.error('Failed to mark notification as read', err);
        }
    };

    const markAllAsRead = async () => {
        try {
            await Promise.all(
                notifications.filter(n => !n.read).map(n =>
                    fetch('/api/notifications/read', {
                        method: 'PATCH',
                        headers: { 'Content-Type': 'application/json' },
                        body: JSON.stringify({ notificationId: n.id })
                    })
                )
            );
            setNotifications(prev => prev.map(n => ({ ...n, read: true })));
        } catch (err) {
            console.error('Failed to mark all notifications as read', err);
        }
    };

    const unreadCount = notifications.filter(n => !n.read).length;

    const handleBack = () => {
        router.back();
    };

    if (loading) {
        return (
            <div className="min-h-screen flex items-center justify-center">
                Loading notifications...
            </div>
        );
    }

    return (
        <div className="min-h-screen bg-gray-50">
            {/* Header */}
            <div className="bg-white shadow-sm border-b border-gray-200">
                <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                    <div className="flex items-center justify-between h-16">
                        <div className="flex items-center space-x-4">
                            <button
                                onClick={handleBack}
                                className="flex items-center justify-center w-10 h-10 rounded-lg hover:bg-gray-200 transition-colors cursor-pointer mr-6"
                            >
                                <ArrowLeft className="w-5 h-5 text-gray-600" />
                            </button>
                            <div>
                                <h1 className="text-2xl font-bold text-gray-900">Notifications</h1>
                                <p className="text-sm text-gray-500">
                                    {unreadCount > 0 ? `${unreadCount} unread notifications` : 'All notifications read'}
                                </p>
                            </div>
                        </div>
                        {unreadCount > 0 && (
                            <button
                                onClick={markAllAsRead}
                                className="px-4 py-2 text-sm font-medium text-primary hover:text-blue-700 hover:bg-blue-50 rounded-lg transition-colors cursor-pointer"
                            >
                                Mark all as read
                            </button>
                        )}
                    </div>
                </div>
            </div>

            {/* Notifications List */}
            <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 py-6">
                {notifications.length === 0 ? (
                    <div className="text-center py-12">
                        <Bell className="w-12 h-12 text-gray-300 mx-auto mb-4" />
                        <h3 className="text-lg font-medium text-gray-900 mb-2">No notifications</h3>
                        <p className="text-gray-500">You're all caught up! New notifications will appear here.</p>
                    </div>
                ) : (
                    <div className="space-y-3">
                        {notifications.map(n => (
                            <div
                                key={n.id}
                                className={`${getNotificationBg(n.type, n.read)} 
                         border border-gray-200 rounded-xl p-4 hover:shadow-md transition-all cursor-pointer`}
                                onClick={() => !n.read && markAsRead(n.id)}
                            >
                                <div className="flex items-start space-x-4">
                                    <div className="flex-shrink-0 mt-1">{getNotificationIcon(n.type)}</div>
                                    <div className="flex-1 min-w-0">
                                        <div className="flex items-start justify-between">
                                            <div className="flex-1">
                                                <h3 className={`text-sm font-semibold ${n.read ? 'text-gray-700' : 'text-gray-900'}`}>
                                                    {n.title}
                                                    {!n.read && (
                                                        <span className="ml-2 w-2 h-2 bg-blue-500 rounded-full inline-block"></span>
                                                    )}
                                                </h3>
                                                <p className={`mt-1 text-sm ${n.read ? 'text-gray-500' : 'text-gray-600'}`}>
                                                    {n.message}
                                                </p>
                                            </div>
                                        </div>
                                        <div className="mt-3 flex items-center text-xs text-gray-400">
                                            <Clock className="w-3 h-3 mr-1" />
                                            {new Date(n.createdAt).toLocaleString()}
                                        </div>
                                    </div>
                                </div>
                            </div>
                        ))}
                    </div>
                )}
            </div>
        </div>
    );
}
