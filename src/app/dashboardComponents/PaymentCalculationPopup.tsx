import React from 'react';

interface PaymentCalculationPopupProps {
  isOpen: boolean;
  onClose: () => void;
  paymentData: {
    fullName: string;
    role: string;
    accountId: string;
    totalAmount: number;
    calculationDetails: {
      studentFees?: number[];
      driverRate?: number;
      vanOwnerCut?: number;
    };
  };
}

const PaymentCalculationPopup: React.FC<PaymentCalculationPopupProps> = ({ isOpen, onClose, paymentData }) => {
  if (!isOpen) return null;

  const {
    fullName,
    role,
    accountId,
    totalAmount,
    calculationDetails
  } = paymentData;

  const { studentFees = [], driverRate = 0, vanOwnerCut = 0 } = calculationDetails;

  // Calculate totals and summaries
  const totalStudentFees = studentFees.reduce((sum, fee) => sum + fee, 0);

  return (
    <div className="fixed inset-0 flex items-center justify-center z-50 backdrop-blur-sm">
      <div className="bg-white rounded-lg shadow-lg p-6 max-w-md w-full mx-4">
        <div className="flex justify-between items-center mb-4">
          <h2 className="text-xl font-bold text-gray-800">Payment Calculation</h2>
          <button 
            onClick={onClose}
            className="text-gray-500 hover:text-gray-700 focus:outline-none"
          >
            <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
            </svg>
          </button>
        </div>

        <div className="space-y-4">
          <div className="bg-gray-50 p-4 rounded-md">
            <h3 className="font-medium text-gray-700">{fullName}</h3>
            <p className="text-sm text-gray-500">Account ID: {accountId}</p>
            <p className="text-sm text-gray-500">Role: {role}</p>
          </div>

          <div className="border-t border-gray-200 pt-4">
            <h4 className="font-medium mb-2">Calculation Breakdown</h4>
            
            {role === "Van Driver" && driverRate > 0 && (
              <div className="mb-3">
                <p className="text-sm text-gray-600">Driver receives a fixed rate from the van owner:</p>
                <p className="font-medium">LKR {driverRate.toLocaleString('en-LK', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}</p>
              </div>
            )}

            {role === "Van Owner" && (
              <div className="mb-3">
                <p className="text-sm text-gray-600">Van owner receives:</p>
                <p className="font-medium">LKR {vanOwnerCut.toLocaleString('en-LK', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}</p>
                
                {studentFees.length > 0 && (
                  <div className="mt-2">
                    <p className="text-sm text-gray-600">From student fees:</p>
                    <ul className="list-disc pl-5 text-sm">
                      {studentFees.map((fee, index) => (
                        <li key={index}>
                          Student {index + 1}: LKR {fee.toLocaleString('en-LK', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}
                        </li>
                      ))}
                    </ul>
                    <p className="text-sm font-medium mt-1">
                      Total student fees: LKR {totalStudentFees.toLocaleString('en-LK', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}
                    </p>
                  </div>
                )}

                {driverRate > 0 && (
                  <div className="mt-2 text-sm">
                    <p>Driver payment: LKR {driverRate.toLocaleString('en-LK', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}</p>
                    <p className="font-medium">
                      Van owner net: LKR {(totalStudentFees - driverRate).toLocaleString('en-LK', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}
                    </p>
                  </div>
                )}
              </div>
            )}

            {role === "Van Driver & Owner" && (
              <div className="mb-3">
                <p className="text-sm text-gray-600">As both van owner and driver, receives full amount:</p>
                {studentFees.length > 0 && (
                  <div className="mt-2">
                    <ul className="list-disc pl-5 text-sm">
                      {studentFees.map((fee, index) => (
                        <li key={index}>
                          Student {index + 1}: LKR {fee.toLocaleString('en-LK', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}
                        </li>
                      ))}
                    </ul>
                  </div>
                )}
              </div>
            )}
          </div>

          <div className="border-t border-gray-200 pt-4">
            <div className="flex justify-between items-center">
              <span className="font-bold text-gray-700">Total Payment:</span>
              <span className="font-bold text-lg text-green-600">
                LKR {totalAmount.toLocaleString('en-LK', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}
              </span>
            </div>
          </div>
        </div>
        
        <div className="mt-6">
          <button
            onClick={onClose}
            className="w-full py-2 px-4 bg-blue-600 hover:bg-blue-700 text-white font-medium rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500"
          >
            Close
          </button>
        </div>
      </div>
    </div>
  );
};

export default PaymentCalculationPopup;
