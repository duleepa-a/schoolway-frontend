"use client";

import { useEffect, useState } from "react";
import { CheckCircle, XCircle, Loader2 } from "lucide-react";

export default function SuccessPage() {
  const [status, setStatus] = useState("verifying");
  const [message, setMessage] = useState("");

  useEffect(() => {
    const verifyPayment = async () => {
      const params = new URLSearchParams(window.location.search);
      const sessionId = params.get("session_id");

      if (!sessionId) {
        setStatus("error");
        setMessage("Missing session ID");
        return;
      }

      try {
        console.log("Stripe key exists:", !!process.env.STRIPE_SECRET_KEY);
        const res = await fetch(`/api/payments/verify?session_id=${sessionId}`);
        const data = await res.json();

        if (res.ok) {
          setStatus("success");
          setMessage("Your payment has been processed successfully!");
        } else {
          setStatus("error");
          setMessage(data.error || "Payment verification failed");
        }
      } catch (err) {
        setStatus("error");
        setMessage("Unable to verify payment. Please contact support.");
      }
    };

    verifyPayment();
  }, []);

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100 flex items-center justify-center p-4">
      <div className="bg-white rounded-2xl shadow-xl p-6 sm:p-8 max-w-md w-full text-center">
        {status === "verifying" && (
          <>
            <Loader2 className="w-12 h-12 sm:w-16 sm:h-16 text-blue-600 mx-auto mb-3 sm:mb-4 animate-spin" />
            <h1 className="text-xl sm:text-2xl font-bold text-gray-800 mb-2">
              Verifying Payment
            </h1>
            <p className="text-sm sm:text-base text-gray-600">Please wait while we confirm your transaction...</p>
          </>
        )}

        {status === "success" && (
          <>
            <CheckCircle className="w-12 h-12 sm:w-16 sm:h-16 text-green-600 mx-auto mb-3 sm:mb-4" />
            <h1 className="text-xl sm:text-2xl font-bold text-gray-800 mb-2">
              Payment Successful!
            </h1>
            <p className="text-sm sm:text-base text-gray-600 mb-4 sm:mb-6">{message}</p>
            <button
              onClick={() => window.location.href = "/"}
              className="w-full sm:w-auto bg-green-600 hover:bg-green-700 text-white font-semibold py-2.5 sm:py-3 px-6 rounded-lg transition-colors text-sm sm:text-base"
            >
              Return to Home
            </button>
          </>
        )}

        {status === "error" && (
          <>
            <XCircle className="w-12 h-12 sm:w-16 sm:h-16 text-red-600 mx-auto mb-3 sm:mb-4" />
            <h1 className="text-xl sm:text-2xl font-bold text-gray-800 mb-2">
              Payment Failed
            </h1>
            <p className="text-sm sm:text-base text-gray-600 mb-4 sm:mb-6">{message}</p>
            <div className="flex flex-col sm:flex-row gap-3 justify-center">
              <button
                onClick={() => window.location.href = "/"}
                className="w-full sm:w-auto bg-gray-600 hover:bg-gray-700 text-white font-semibold py-2.5 sm:py-3 px-6 rounded-lg transition-colors text-sm sm:text-base"
              >
                Go Home
              </button>
              <button
                onClick={() => window.location.href = "/support"}
                className="w-full sm:w-auto bg-blue-600 hover:bg-blue-700 text-white font-semibold py-2.5 sm:py-3 px-6 rounded-lg transition-colors text-sm sm:text-base"
              >
                Contact Support
              </button>
            </div>
          </>
        )}
      </div>
    </div>
  );
}