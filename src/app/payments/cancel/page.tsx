'use client';

import { useEffect, useState } from 'react';
import { useRouter, useSearchParams } from 'next/navigation';
import { XCircle, ArrowLeft, Home, CreditCard } from 'lucide-react';

export default function PaymentCancelPage() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const [countdown, setCountdown] = useState(10);

  // Optional: Get session_id or other params from URL
  const sessionId = searchParams.get('session_id');

  useEffect(() => {
    // Countdown timer to redirect
    const timer = setInterval(() => {
      setCountdown((prev) => {
        if (prev <= 1) {
          clearInterval(timer);
          router.push('/dashboard');
          return 0;
        }
        return prev - 1;
      });
    }, 1000);

    return () => clearInterval(timer);
  }, [router]);

  const handleGoBack = () => {
    router.back();
  };

  const handleGoHome = () => {
    router.push('/dashboard');
  };

  const handleRetryPayment = () => {
    router.push('/payments');
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 to-gray-100 flex items-center justify-center p-4">
      <div className="max-w-md w-full bg-white rounded-2xl shadow-xl p-8 text-center">
        {/* Icon */}
        <div className="mb-6 flex justify-center">
          <div className="w-20 h-20 bg-red-100 rounded-full flex items-center justify-center">
            <XCircle className="w-12 h-12 text-red-600" />
          </div>
        </div>

        {/* Title */}
        <h1 className="text-3xl font-bold text-gray-900 mb-3">
          Payment Cancelled
        </h1>

        {/* Description */}
        <p className="text-gray-600 mb-6">
          Your payment was not completed. No charges have been made to your account.
        </p>

        {/* Session Info (Optional) */}
        {sessionId && (
          <div className="bg-gray-50 rounded-lg p-4 mb-6 border border-gray-200">
            <p className="text-sm text-gray-500 mb-1">Session ID</p>
            <p className="text-xs font-mono text-gray-700 break-all">
              {sessionId}
            </p>
          </div>
        )}

        {/* Common Reasons */}
        <div className="bg-blue-50 rounded-lg p-4 mb-6 text-left border border-blue-200">
          <p className="text-sm font-semibold text-blue-900 mb-2">
            Common reasons for cancellation:
          </p>
          <ul className="text-sm text-blue-800 space-y-1">
            <li>• Payment window was closed</li>
            <li>• Back button was pressed</li>
            <li>• Transaction was manually cancelled</li>
            <li>• Session timed out</li>
          </ul>
        </div>
        {/* Auto-redirect message */}
        <p className="text-sm text-gray-500">
          Redirecting to dashboard in {countdown} seconds...
        </p>
      </div>
    </div>
  );
}