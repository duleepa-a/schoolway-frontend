'use client';

import React from 'react';
import { useRouter } from 'next/navigation';
import { ArrowLeft, Bell, CheckCircle, AlertTriangle, Info, Clock } from 'lucide-react';

interface Notification {
    id: string;
    type: 'message' | 'system' | 'task' | 'info';
    title: string;
    description: string;
    time: string;
    isRead: boolean;
}

const mockNotifications: Notification[] = [
    {
        id: '1',
        type: 'message',
        title: 'New Message',
        description: 'You have received a new message from John Doe',
        time: '2 minutes ago',
        isRead: false,
    },
    {
        id: '2',
        type: 'system',
        title: 'System Update',
        description: 'System maintenance scheduled for tonight',
        time: '1 hour ago',
        isRead: false,
    },
    {
        id: '3',
        type: 'task',
        title: 'Task Completed',
        description: 'Your report has been successfully generated',
        time: '3 hours ago',
        isRead: true,
    },
    {
        id: '4',
        type: 'info',
        title: 'Route Update',
        description: 'Route A schedule has been updated for tomorrow',
        time: '5 hours ago',
        isRead: true,
    },
    {
        id: '5',
        type: 'message',
        title: 'Driver Check-in',
        description: 'Driver Sarah Wilson has checked in for Route B',
        time: '1 day ago',
        isRead: true,
    },
    {
        id: '6',
        type: 'system',
        title: 'Backup Completed',
        description: 'Daily system backup completed successfully',
        time: '2 days ago',
        isRead: true,
    },
];

const getNotificationIcon = (type: string) => {
    switch (type) {
        case 'message':
            return <Bell className="w-5 h-5 text-blue-500" />;
        case 'system':
            return <AlertTriangle className="w-5 h-5 text-orange-500" />;
        case 'task':
            return <CheckCircle className="w-5 h-5 text-green-500" />;
        case 'info':
            return <Info className="w-5 h-5 text-purple-500" />;
        default:
            return <Bell className="w-5 h-5 text-gray-500" />;
    }
};

const getNotificationBg = (type: string, isRead: boolean) => {
    if (isRead) return 'bg-gray-50';

    switch (type) {
        case 'message':
            return 'bg-blue-50';
        case 'system':
            return 'bg-orange-50';
        case 'task':
            return 'bg-green-50';
        case 'info':
            return 'bg-purple-50';
        default:
            return 'bg-gray-50';
    }
};

export default function Notifications() {
    const router = useRouter();

    const handleBack = () => {
        router.back();
    };

    const markAsRead = (notificationId: string) => {
        // Here you would typically update the notification status in your state management or API
        console.log(`Marking notification ${notificationId} as read`);
    };

    const markAllAsRead = () => {
        // Here you would typically mark all notifications as read
        console.log('Marking all notifications as read');
    };

    const unreadCount = mockNotifications.filter(n => !n.isRead).length;

    return (
        <div className="min-h-screen bg-gray-50">
            {/* Header */}
            <div className="bg-white shadow-sm border-b border-gray-200">
                <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
                    <div className="flex items-center justify-between h-16">
                        <div className="flex items-center space-x-4">
                            <button
                                onClick={handleBack}
                                className="flex items-center justify-center w-10 h-10 rounded-lg bg-gray-100 hover:bg-gray-200 transition-colors"
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
                                className="px-4 py-2 text-sm font-medium text-blue-600 hover:text-blue-700 hover:bg-blue-50 rounded-lg transition-colors"
                            >
                                Mark all as read
                            </button>
                        )}
                    </div>
                </div>
            </div>

            {/* Notifications List */}
            <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-6">
                <div className="space-y-3">
                    {mockNotifications.map((notification) => (
                        <div
                            key={notification.id}
                            className={`${getNotificationBg(notification.type, notification.isRead)} 
                         border border-gray-200 rounded-xl p-4 hover:shadow-md transition-all cursor-pointer`}
                            onClick={() => !notification.isRead && markAsRead(notification.id)}
                        >
                            <div className="flex items-start space-x-4">
                                <div className="flex-shrink-0 mt-1">
                                    {getNotificationIcon(notification.type)}
                                </div>
                                <div className="flex-1 min-w-0">
                                    <div className="flex items-start justify-between">
                                        <div className="flex-1">
                                            <h3 className={`text-sm font-semibold ${
                                                notification.isRead ? 'text-gray-700' : 'text-gray-900'
                                            }`}>
                                                {notification.title}
                                                {!notification.isRead && (
                                                    <span className="ml-2 w-2 h-2 bg-blue-500 rounded-full inline-block"></span>
                                                )}
                                            </h3>
                                            <p className={`mt-1 text-sm ${
                                                notification.isRead ? 'text-gray-500' : 'text-gray-600'
                                            }`}>
                                                {notification.description}
                                            </p>
                                        </div>
                                    </div>
                                    <div className="mt-3 flex items-center text-xs text-gray-400">
                                        <Clock className="w-3 h-3 mr-1" />
                                        {notification.time}
                                    </div>
                                </div>
                            </div>
                        </div>
                    ))}
                </div>

                {mockNotifications.length === 0 && (
                    <div className="text-center py-12">
                        <Bell className="w-12 h-12 text-gray-300 mx-auto mb-4" />
                        <h3 className="text-lg font-medium text-gray-900 mb-2">No notifications</h3>
                        <p className="text-gray-500">You're all caught up! New notifications will appear here.</p>
                    </div>
                )}
            </div>
        </div>
    );
}