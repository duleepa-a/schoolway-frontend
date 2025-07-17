'use client';
import { useState, useMemo } from 'react';
import TopBar from '@/app/dashboardComponents/TopBar'
import SearchFilter from '@/app/dashboardComponents/SearchFilter';
import DataTable from '@/app/dashboardComponents/CustomTable';
import PaymentCalculationPopup from '@/app/dashboardComponents/PaymentCalculationPopup';
import { transactionsData } from '../../../../public/dummy_data/transactions';
import { Eye, DollarSign } from 'lucide-react';

const columns = [
  { key: "AccountID", label: "Account ID" },
  { key: "Full Name", label: "Full Name" },
  { key: "Role", label: "Role" },
  { key: "Account No.", label: "Account No." },
  { key: "Bank", label: "Bank" },
  { key: "Branch", label: "Branch" },
  { key: "Amount", label: "Amount" },
  { key: "Status", label: "Status" },
];

const PayrollPage = () => {
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedRole, setSelectedRole] = useState('');
  const [selectedStatus, setSelectedStatus] = useState('');
  const [isCalculationPopupOpen, setIsCalculationPopupOpen] = useState(false);
  // Define the type for payment data
  interface PaymentData {
    fullName: string;
    role: string;
    accountId: string;
    totalAmount: number;
    calculationDetails: {
      studentFees: number[];
      driverRate: number;
      vanOwnerCut: number;
    };
  }
  
  const [selectedPaymentData, setSelectedPaymentData] = useState<PaymentData | null>(null);

  // Filter the data based on search criteria
  const filteredData = useMemo(() => {
    return transactionsData.filter((transaction) => {
      // Search filter - searches in name, account ID, bank, etc.
      const matchesSearch = searchTerm === '' || 
        transaction["Full Name"].toLowerCase().includes(searchTerm.toLowerCase()) ||
        transaction.AccountID.toLowerCase().includes(searchTerm.toLowerCase()) ||
        transaction["Account No."].toLowerCase().includes(searchTerm.toLowerCase()) ||
        transaction.Bank.toLowerCase().includes(searchTerm.toLowerCase());

      // Role filter
      const matchesRole = selectedRole === '' || transaction.Role === selectedRole;

      // Status filter  
      const matchesStatus = selectedStatus === '' || transaction.Status === selectedStatus;

      return matchesSearch && matchesRole && matchesStatus;
    });
  }, [searchTerm, selectedRole, selectedStatus]);

  // Format amount for display
  const formattedData = filteredData.map(transaction => ({
    ...transaction,
    Amount: `LKR ${transaction.Amount.toLocaleString('en-LK', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}`
  }));

  const handleAddTransaction = () => {
    console.log("Add transaction clicked");
    // Implement add transaction functionality
  };

  const handleClearFilters = () => {
    setSearchTerm('');
    setSelectedRole('');
    setSelectedStatus('');
  };

  const handleView = (row: Record<string, string | number | boolean | null | undefined>) => {
    console.log("View clicked:", row);
    
    // Generate random student fees based on the requirement (3500 to 12000)
    const generateRandomStudentFees = () => {
      const numberOfStudents = Math.floor(Math.random() * 5) + 1; // 1 to 5 students
      return Array.from({ length: numberOfStudents }, () => 
        Math.floor(Math.random() * (12000 - 3500 + 1)) + 3500
      );
    };
    
    const studentFees = generateRandomStudentFees();
    const totalStudentFees = studentFees.reduce((sum, fee) => sum + fee, 0);
    
    // Parse the amount from the formatted string (remove "LKR " and commas)
    const amountStr = row.Amount as string;
    const amount = parseFloat(amountStr.replace('LKR ', '').replace(/,/g, ''));
    
    const calculationDetails = {
      studentFees,
      driverRate: 0,
      vanOwnerCut: 0
    };
    
    // Define calculation logic based on role
    if (row.Role === "Van Driver") {
      // Driver gets a fixed rate from the van owner
      calculationDetails.driverRate = amount;
    } else if (row.Role === "Van Owner") {
      // Van owner gets their cut (total fees minus driver payment)
      const driverRate = Math.floor(totalStudentFees * 0.4); // Assume driver gets 40%
      calculationDetails.driverRate = driverRate;
      calculationDetails.vanOwnerCut = totalStudentFees - driverRate;
    } else {
      // If they're both driver and owner, they get full amount
      calculationDetails.vanOwnerCut = totalStudentFees;
    }
    
    setSelectedPaymentData({
      fullName: row["Full Name"] as string,
      role: row.Role as string,
      accountId: row.AccountID as string,
      totalAmount: amount,
      calculationDetails
    });
    
    // Make sure the popup is displayed
    setIsCalculationPopupOpen(true);
  };

  const handleSettle = (row: Record<string, string | number | boolean | null | undefined>) => {
    console.log("Settle clicked:", row);
    if (row.Status === 'Settled') {
      alert(`Transaction for ${row["Full Name"]} is already settled.`);
    } else {
      alert(`Processing settlement for ${row["Full Name"]} - Amount: ${row.Amount}`);
    }
  };
  
  return (
      <div>
        {/* Payment Calculation Popup - positioned outside section to ensure it covers everything */}
        {isCalculationPopupOpen && selectedPaymentData && (
          <PaymentCalculationPopup
            isOpen={isCalculationPopupOpen}
            onClose={() => setIsCalculationPopupOpen(false)}
            paymentData={selectedPaymentData}
          />
        )}
        <section className="p-5 md:p-10 min-h-screen w-full">
          {/*Top bar with profile icon and the heading*/}
          <TopBar heading="Payroll" />

          <SearchFilter 
            onSearchChange={setSearchTerm}
            onRoleChange={setSelectedRole}
            onStatusChange={setSelectedStatus}
            onDateChange={() => {}} // Placeholder for future date filtering
            onClearFilters={handleClearFilters}
            config={{
              searchPlaceholder: "Search transactions by name, account, or bank",
              onAddClick: handleAddTransaction,
              addButtonText: "+ Add Transaction",
              statusOptions: [
                { value: "", label: "Status" },
                { value: "Pending", label: "Pending" },
                { value: "Settled", label: "Settled" },
                { value: "Processing", label: "Processing" },
                { value: "Failed", label: "Failed" },
              ],
              roleOptions: [
                { value: "", label: "Role" },
                { value: "Van Driver", label: "Van Driver" },
                { value: "Van Owner", label: "Van Owner" },
              ]
            }}
          />

          <div className="mt-4">
            <DataTable
              columns={columns}
              data={formattedData}
              actions={[
                { 
                  type: "custom", 
                  icon: <Eye size={16} />,
                  label: "View Payment Calculation",
                  className: "text-blue-600 hover:text-blue-900 p-2 rounded-full hover:bg-blue-100 transition-colors",
                  onClick: handleView 
                },
                { 
                  type: "custom", 
                  icon: <DollarSign size={16} />,
                  label: "Settle Payment",
                  className: "text-green-600 hover:text-green-900 p-2 rounded-full hover:bg-green-100 transition-colors",
                  onClick: handleSettle 
                },
              ]}
            />
          </div>
        </section>
      </div>
  )
}

export default PayrollPage
