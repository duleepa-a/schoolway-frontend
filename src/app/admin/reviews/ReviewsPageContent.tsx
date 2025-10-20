'use client';

import DriverReviewsTab from './DriverReviewsTab';
import VanServiceReviewsTab from './VanServiceReviewsTab';
import StatisticsTab from './StatisticsTab';

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

interface ReviewsPageContentProps {
  activeTab: string;
}

export default function ReviewsPageContent({ activeTab }: ReviewsPageContentProps) {
  return (
    <>
      {/* Render Active Tab */}
      {activeTab === 'statistics' && <StatisticsTab />}
      {activeTab === 'drivers' && <DriverReviewsTab />}
      {activeTab === 'van-services' && <VanServiceReviewsTab />}
    </>
  );
}
