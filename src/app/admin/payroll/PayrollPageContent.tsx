"use client";

import { useEffect, useState, useMemo } from "react";
import Swal from "sweetalert2";
import SearchFilter from "@/app/dashboardComponents/SearchFilter";
import CustomTable from "@/app/dashboardComponents/CustomTable";
import {
  FileText,
  CheckCircle,
  User,
  Building,
  CreditCard,
  DollarSign,
  X,
} from "lucide-react";
import React from "react";

// Define the structure of a payroll record
interface PayrollRecord {
  id: number | string;
  firstname?: string | null;
  lastname?: string | null;
  fullname?: string | null;
  role?: string | null;
  vanServiceName?: string | null;
  accountNo?: string | null;
  bank?: string | null;
  branch?: string | null;
  status?: string | null;
  amount?: number;
  totalAmount?: number;
  date?: string;
  recipientId?: string;
  recipientRole?: string;
  monthYear?: string;
  month?: string;
  year?: string;
  dp?: string | null;
}

// Bank fields structure for editing
interface BankFields {
  accountNo: string;
  bank: string;
  branch: string;
}

// Student structure
interface Student {
  id: string;
  childId?: number;
  name: string;
  amountPaid?: number;
  totalSystemFee?: number;
  totalDriverShare?: number;
  totalOwnerShare?: number;
  allocatedToRecipient?: number;
  payments?: {
    id: number;
    amount: number;
    systemFee: number;
    salaryPercentageForDriver?: number | null;
    driverShare: number;
    ownerShare: number;
    parentId: string;
  }[];
}

export default function PayrollPage() {
  const [payrolls, setPayrolls] = useState<PayrollRecord[]>([]);
  const [loading, setLoading] = useState(true);
  const [selectedPayroll, setSelectedPayroll] = useState<PayrollRecord | null>(
    null
  );
  const [studentsList, setStudentsList] = useState<Student[]>([]);

  const [searchTerm, setSearchTerm] = useState("");
  const [selectedRole, setSelectedRole] = useState("");
  const [selectedStatus, setSelectedStatus] = useState("");
  const [selectedMonth, setSelectedMonth] = useState("");
  const [selectedYear, setSelectedYear] = useState("");

  // Helper to format amounts with two decimal places
  const formatAmount = (value: number | undefined | null) => {
    const num = Number(value ?? 0) || 0;
    return new Intl.NumberFormat(undefined, {
      minimumFractionDigits: 2,
      maximumFractionDigits: 2,
    }).format(num);
  };

  // Modal states
  const [modalType, setModalType] = useState<"view" | "settle" | null>(null);
  const [previewHtml, setPreviewHtml] = useState<string | null>(null);
  const [previewLoading, setPreviewLoading] = useState(false);

  // Bank editing states
  const [editingBank, setEditingBank] = useState(false);
  const [bankFields, setBankFields] = useState<BankFields>({
    accountNo: "",
    bank: "",
    branch: "",
  });

  useEffect(() => {
    const fetchPayrolls = async () => {
      try {
        const res = await fetch("/api/admin/payroll");
        if (!res.ok) {
          throw new Error("Failed to fetch payroll data");
        }
        const data = await res.json();
        setPayrolls(data);
      } catch (err) {
        console.error("Error fetching payrolls:", err);
        Swal.fire("Error", "Unable to load payroll data", "error");
      } finally {
        setLoading(false);
      }
    };
    fetchPayrolls();
  }, []);

  const filteredPayrolls = useMemo(() => {
    return payrolls.filter((p) => {
      const matchesSearch =
        searchTerm === "" ||
        [p.fullname, p.accountNo, p.bank, p.vanServiceName]
          .filter(Boolean)
          .some((field) =>
            field!.toString().toLowerCase().includes(searchTerm.toLowerCase())
          );

      const matchesRole =
        selectedRole === "" ||
        (p.role && p.role.toLowerCase() === selectedRole.toLowerCase());

      const matchesStatus =
        selectedStatus === "" ||
        (p.status &&
          p.status.toLowerCase().includes(selectedStatus.toLowerCase()));

      const matchesMonth =
        selectedMonth === "" || (p.month && p.month === selectedMonth);
      const matchesYear =
        selectedYear === "" || (p.year && p.year === selectedYear);

      return (
        matchesSearch &&
        matchesRole &&
        matchesStatus &&
        matchesMonth &&
        matchesYear
      );
    });
  }, [
    payrolls,
    searchTerm,
    selectedRole,
    selectedStatus,
    selectedMonth,
    selectedYear,
  ]);

  const handleClearFilters = () => {
    setSearchTerm("");
    setSelectedRole("");
    setSelectedStatus("");
  };

  const columns = [
    { key: "fullname", label: "Full Name" },
    { key: "role", label: "Role" },
    { key: "vanServiceName", label: "Van Service" },
    { key: "totalAmount", label: "Total Amount" },
    { key: "status", label: "Status" },
    { key: "month", label: "Month" },
    { key: "year", label: "Year" },
  ];

  // VIEW PAYROLL DETAILS HANDLER
  const handleView = (row: PayrollRecord) => {
    setSelectedPayroll(row);
    setModalType("view");

    (async () => {
      try {
        const month = row.month || row.monthYear?.split(" ")?.[0] || "";
        const year = row.year || row.monthYear?.split(" ")?.[1] || "";
        const params = new URLSearchParams({
          recipientId: row.recipientId || "",
          recipientRole: row.recipientRole || row.role || "",
          month,
          year,
        });

        const res = await fetch(
          `/api/admin/payroll/childDetails?${params.toString()}`
        );
        if (res.ok) {
          const data = await res.json();
          setStudentsList(data.students || []);
          setBankFields({
            accountNo: row.accountNo || "",
            bank: row.bank || "",
            branch: row.branch || "",
          });
        } else {
          console.error("Failed loading child details", await res.text());
        }
      } catch (err) {
        console.error("Error fetching payroll details:", err);
      }
    })();
  };

  // SETTLE PAYROLL HANDLER
  const handleSettle = (row: PayrollRecord) => {
    setSelectedPayroll(row);
    setModalType("settle");
  };

  const settlePayroll = async () => {
    if (!selectedPayroll) return;

    try {
      const res = await fetch(`/api/admin/payroll/settle`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          payrollId: selectedPayroll.id,
          month: (
            selectedPayroll.monthYear ||
            selectedPayroll.date ||
            ""
          ).toString(),
          recipientId: selectedPayroll.recipientId,
        }),
      });

      const data = await res.json();
      if (!res.ok) throw new Error(data?.error || "Failed to settle payroll");

      const monthToMatch = (
        selectedPayroll.monthYear ||
        selectedPayroll.date ||
        ""
      ).toString();
      setPayrolls((prev) =>
        prev.map((p) =>
          p.recipientId === selectedPayroll.recipientId &&
          (p.monthYear || p.date || "").toString() === monthToMatch
            ? { ...p, status: "Settled" }
            : p
        )
      );

      setModalType(null);
      setSelectedPayroll(null);

      Swal.fire({
        icon: "success",
        title: "Settled",
        text: "Payroll has been marked as settled.",
        confirmButtonColor: "#0099cc",
      });
    } catch (err) {
      console.error("Error settling payroll:", err);
      Swal.fire({
        icon: "error",
        title: "Failed",
        text: "Unable to settle payroll.",
      });
    }
  };

  // SAVE BANK DETAILS HANDLER
  const handleSaveBankDetails = async () => {
    try {
      if (!selectedPayroll) throw new Error("No payroll selected");

      const recipientId = selectedPayroll.recipientId;
      const recipientRole =
        selectedPayroll.recipientRole || selectedPayroll.role || "";

      if (!recipientId || !recipientRole) {
        throw new Error("Missing recipientId or role");
      }

      const response = await fetch(`/api/admin/payroll/bankDetails`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          userId: recipientId,
          role: recipientRole,
          accountNo: bankFields.accountNo || null,
          bank: bankFields.bank || null,
          branch: bankFields.branch || null,
        }),
      });

      const responseData = await response.json();

      if (!response.ok) {
        throw new Error(responseData?.error || "Failed to update");
      }

      setSelectedPayroll((prev) => (prev ? { ...prev, ...bankFields } : prev));
      setPayrolls((prev) =>
        prev.map((p) =>
          p.id === selectedPayroll.id ? { ...p, ...bankFields } : p
        )
      );

      setEditingBank(false);
      Swal.fire("Success", "Bank info updated", "success");
    } catch (err) {
      console.error("Error updating bank details:", err);
      Swal.fire("Error", "Unable to update bank info", "error");
    }
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center h-64">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-[#0099cc]"></div>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Header Card */}
      <div className="bg-white rounded-xl shadow-lg border border-gray-100 p-6">
        <SearchFilter
          onSearchChange={setSearchTerm}
          onRoleChange={setSelectedRole}
          onStatusChange={setSelectedStatus}
          onDateChange={() => {}}
          onMonthChange={setSelectedMonth}
          onYearChange={setSelectedYear}
          onClearFilters={handleClearFilters}
          config={{
            searchPlaceholder: "Search by name, account, or bank...",
            showAddButton: false,
            showClearButton: true,
            showDateFilter: false,
            roleOptions: [
              { value: "", label: "All Roles" },
              { value: "Driver", label: "Driver" },
              { value: "Service", label: "Service" },
            ],
            statusOptions: [
              { value: "", label: "All Status" },
              { value: "Pending", label: "Pending" },
              { value: "Completed", label: "Completed" },
            ],
            monthOptions: [
              { value: "", label: "All Months" },
              ...Array.from(
                new Set(payrolls.map((p) => p.month).filter(Boolean))
              ).map((m) => ({
                value: m as string,
                label: m as string,
              })),
            ],
            yearOptions: [
              { value: "", label: "All Years" },
              ...Array.from(
                new Set(payrolls.map((p) => p.year).filter(Boolean))
              ).map((y) => ({
                value: y as string,
                label: y as string,
              })),
            ],
          }}
        />
      </div>

      {/* Data Table Card */}
      <div className="bg-white rounded-xl shadow-lg border border-gray-100 overflow-hidden">
        <CustomTable
          columns={columns}
          data={filteredPayrolls}
          renderCell={(column, value, row) => {
            if (column === "totalAmount" || column === "amount") {
              const num = Number(value ?? row.amount ?? row.totalAmount ?? 0);
              return new Intl.NumberFormat(undefined, {
                minimumFractionDigits: 2,
                maximumFractionDigits: 2,
              }).format(num);
            }
            if (column === "fullname") {
              return (
                <div className="flex items-center gap-2">
                  <img
                    src={row.dp || "/images/user__.png"}
                    alt={row.fullname}
                    className="w-8 h-8 rounded-full  border border-[#0099cc]"
                  />
                  <span>{row.fullname}</span>
                </div>
              );
            }
            return value;
            return String(value ?? "");
          }}
          actions={[
            {
              type: "custom",
              icon: <FileText size={16} color="blue" />,
              label: "View Details",
              onClick: handleView,
            },
            {
              type: "custom",
              icon: <CheckCircle size={16} color="green" />,
              label: "Settle Payment",
              onClick: handleSettle,
            },
          ]}
        />
      </div>

      {/* View Payroll Modal */}
      {selectedPayroll && modalType === "view" && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40 backdrop-blur-sm p-4">
          <div className="relative w-full max-w-6xl max-h-[90vh] overflow-y-auto bg-white rounded-xl shadow-lg border border-gray-100">
            {/* Close Button */}
            <button
              onClick={() => {
                setModalType(null);
                setSelectedPayroll(null);
              }}
              className="absolute top-4 right-4 z-10 p-2 text-gray-400 hover:text-gray-600 rounded-lg hover:bg-gray-100 transition-colors"
            >
              <X size={20} />
            </button>

            {/* Header */}
            <div className="p-6 border-b border-gray-100">
              <div className="flex items-center gap-3">
                <div className="p-3 bg-blue-100 rounded-xl">
                  <DollarSign className="w-6 h-6 text-[#0099cc]" />
                </div>
                <div>
                  <h3 className="text-xl font-bold text-gray-800">
                    Payroll Details
                  </h3>
                  <p className="text-gray-600 text-sm mt-1">
                    Complete payroll information and breakdown
                  </p>
                </div>
              </div>
            </div>

            {/* Content */}
            <div className="p-6">
              {/* Personal Information Grid */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-6">
                <div className="bg-gray-50 rounded-lg p-4 border border-gray-100">
                  <h4 className="font-semibold text-gray-800 mb-4 flex items-center gap-2">
                    <User className="w-4 h-4 text-blue-500" />
                    Personal Information
                  </h4>
                  <div className="space-y-3 text-sm">
                    <div className="flex justify-between">
                      <span className="text-gray-500">Name:</span>
                      <span className="font-medium text-gray-800">
                        {selectedPayroll.fullname || "N/A"}
                      </span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-gray-500">Role:</span>
                      <span className="font-medium text-gray-800">
                        {selectedPayroll.role}
                      </span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-gray-500">Van Service:</span>
                      <span className="font-medium text-gray-800">
                        {selectedPayroll.vanServiceName || "-"}
                      </span>
                    </div>
                  </div>
                </div>

                <div className="bg-gray-50 rounded-lg p-4 border border-gray-100">
                  <h4 className="font-semibold text-gray-800 mb-4 flex items-center gap-2">
                    <CreditCard className="w-4 h-4 text-blue-500" />
                    Payment Information
                  </h4>
                  <div className="space-y-3 text-sm">
                    <div className="flex justify-between">
                      <span className="text-gray-500">Period:</span>
                      <span className="font-medium text-gray-800">
                        {selectedPayroll.monthYear}
                      </span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-gray-500">Status:</span>
                      <span
                        className={`px-2 py-1 text-xs font-medium rounded-full ${
                          selectedPayroll.status?.toLowerCase() === "settled"
                            ? "bg-green-100 text-green-800"
                            : "bg-yellow-100 text-yellow-800"
                        }`}
                      >
                        {selectedPayroll.status}
                      </span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-gray-500">Total Amount:</span>
                      <span className="font-medium text-gray-800">
                        LKR{" "}
                        {formatAmount(
                          selectedPayroll.totalAmount ?? selectedPayroll.amount
                        )}
                      </span>
                    </div>
                  </div>
                </div>
              </div>

              {/* Bank Details Section */}
              <div className="bg-white rounded-lg border border-gray-100 p-6 mb-6">
                <h4 className="font-semibold text-gray-800 mb-4 flex items-center gap-2">
                  <Building className="w-4 h-4 text-blue-500" />
                  Bank Details
                </h4>

                {!editingBank ? (
                  <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                    <div>
                      <p className="text-xs uppercase text-gray-400 mb-1">
                        Bank Name
                      </p>
                      <p className="font-medium text-gray-800">
                        {selectedPayroll.bank || "Not provided"}
                      </p>
                    </div>
                    <div>
                      <p className="text-xs uppercase text-gray-400 mb-1">
                        Account Number
                      </p>
                      <p className="font-medium text-gray-800">
                        {selectedPayroll.accountNo || "Not provided"}
                      </p>
                    </div>
                    <div>
                      <p className="text-xs uppercase text-gray-400 mb-1">
                        Branch
                      </p>
                      <p className="font-medium text-gray-800">
                        {selectedPayroll.branch || "Not provided"}
                      </p>
                    </div>
                  </div>
                ) : (
                  <div className="space-y-4">
                    <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-2">
                          Bank Name
                        </label>
                        <input
                          type="text"
                          value={bankFields.bank}
                          onChange={(e) =>
                            setBankFields({
                              ...bankFields,
                              bank: e.target.value,
                            })
                          }
                          className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                          placeholder="Enter bank name"
                        />
                      </div>
                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-2">
                          Account Number
                        </label>
                        <input
                          type="text"
                          value={bankFields.accountNo}
                          onChange={(e) =>
                            setBankFields({
                              ...bankFields,
                              accountNo: e.target.value,
                            })
                          }
                          className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                          placeholder="Enter account number"
                        />
                      </div>
                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-2">
                          Branch
                        </label>
                        <input
                          type="text"
                          value={bankFields.branch}
                          onChange={(e) =>
                            setBankFields({
                              ...bankFields,
                              branch: e.target.value,
                            })
                          }
                          className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                          placeholder="Enter branch"
                        />
                      </div>
                    </div>
                    <div className="flex gap-3">
                      <button
                        onClick={handleSaveBankDetails}
                        className="flex items-center gap-2 px-4 py-2 text-white bg-green-600 rounded-lg hover:bg-green-700 transition-colors"
                      >
                        <CheckCircle size={16} />
                        Save Bank Details
                      </button>
                      <button
                        onClick={() => setEditingBank(false)}
                        className="px-4 py-2 text-gray-600 bg-gray-100 rounded-lg hover:bg-gray-200 transition-colors"
                      >
                        Cancel
                      </button>
                    </div>
                  </div>
                )}

                {!editingBank &&
                  (!selectedPayroll.bank ||
                    !selectedPayroll.accountNo ||
                    !selectedPayroll.branch) && (
                    <button
                      onClick={() => setEditingBank(true)}
                      className="mt-4 flex items-center gap-2 px-4 py-2 text-[#0099cc] bg-blue-50 rounded-lg hover:bg-blue-100 transition-colors"
                    >
                      <CreditCard size={16} />
                      Add Bank Details
                    </button>
                  )}
              </div>

              {/* Students List Section */}
              {studentsList.length > 0 && (
                <div className="bg-white rounded-lg border border-gray-100 p-6">
                  <h4 className="font-semibold text-gray-800 mb-4 flex items-center gap-2">
                    <User className="w-4 h-4 text-blue-500" />
                    Student Breakdown ({studentsList.length} students)
                  </h4>

                  <div className="overflow-x-auto">
                    <table className="w-full text-sm">
                      <thead>
                        <tr className="border-b border-gray-200">
                          <th className="text-left pb-3 font-medium text-gray-700">
                            Student Name
                          </th>
                          <th className="text-right pb-3 font-medium text-gray-700">
                            Paid Amount
                          </th>
                          <th className="text-right pb-3 font-medium text-gray-700">
                            System Fee
                          </th>
                          <th className="text-right pb-3 font-medium text-gray-700">
                            Allocated Amount
                          </th>
                        </tr>
                      </thead>
                      <tbody>
                        {studentsList.map((student) => (
                          <React.Fragment key={student.childId}>
                            <tr className="border-b border-gray-100">
                              <td className="py-3 font-medium text-gray-800">
                                {student.name}
                              </td>
                              <td className="py-3 text-right font-semibold text-gray-800">
                                LKR {formatAmount(student.amountPaid)}
                              </td>
                              <td className="py-3 text-right font-semibold text-gray-800">
                                LKR {formatAmount(student.totalSystemFee)}
                              </td>
                              <td className="py-3 text-right font-semibold text-gray-800">
                                LKR {formatAmount(student.allocatedToRecipient)}
                              </td>
                            </tr>

                            {/* Payment Breakdown */}
                            {student.payments &&
                              student.payments.length > 0 && (
                                <tr>
                                  <td colSpan={4} className="bg-gray-50 p-4">
                                    <div className="text-xs font-medium text-gray-600 mb-2">
                                      Payment Breakdown:
                                    </div>
                                    <div className="space-y-2">
                                      {student.payments.map((payment) => (
                                        <div
                                          key={payment.id}
                                          className="flex justify-between text-xs bg-white p-2 rounded border"
                                        >
                                          <span>Payment #{payment.id}</span>
                                          <div className="flex gap-4">
                                            <span>
                                              Amount: LKR{" "}
                                              {formatAmount(payment.amount)}
                                            </span>
                                            <span>
                                              Fee: LKR{" "}
                                              {formatAmount(payment.systemFee)}
                                            </span>
                                            <span>
                                              Driver: LKR{" "}
                                              {formatAmount(
                                                payment.driverShare
                                              )}
                                            </span>
                                            <span>
                                              Owner: LKR{" "}
                                              {formatAmount(payment.ownerShare)}
                                            </span>
                                          </div>
                                        </div>
                                      ))}
                                    </div>
                                  </td>
                                </tr>
                              )}
                          </React.Fragment>
                        ))}
                      </tbody>
                    </table>
                  </div>
                </div>
              )}
            </div>

            {/* Footer Actions */}
            <div className="sticky bottom-0 left-0 bg-white py-3 px-5 border-t border-gray-100 rounded-b-xl">
              <div className="flex justify-end gap-3">
                <button
                  onClick={() => {
                    setModalType(null);
                    setSelectedPayroll(null);
                  }}
                  className="flex items-center gap-2 px-5 py-2 text-gray-600 bg-gray-50 rounded-lg hover:bg-gray-100 transition-colors border border-transparent hover:border-gray-200 font-medium"
                >
                  Close
                </button>
                <button
                  onClick={() => setModalType("settle")}
                  className="flex items-center gap-2 px-5 py-2 text-white bg-green-600 rounded-lg hover:bg--700 transition-colors font-medium shadow-sm hover:shadow-md"
                >
                  <CheckCircle size={18} />
                  Settle Payroll
                </button>
                <button
                  onClick={async () => {
                    if (!selectedPayroll) return;
                    setPreviewLoading(true);
                    try {
                      const res = await fetch(`/api/admin/payroll/preview`, {
                        method: "POST",
                        headers: { "Content-Type": "application/json" },
                        body: JSON.stringify({
                          payrollId: selectedPayroll.id,
                          month:
                            selectedPayroll.monthYear ||
                            selectedPayroll.date ||
                            null,
                          recipientId: selectedPayroll.recipientId,
                        }),
                      });
                      const data = await res.json();
                      if (!res.ok)
                        throw new Error(data?.error || "Failed to get preview");
                      setPreviewHtml(data.html || "");
                    } catch (err) {
                      console.error("Preview error:", err);
                      Swal.fire("Error", "Unable to load preview", "error");
                    } finally {
                      setPreviewLoading(false);
                    }
                  }}
                  className="flex items-center gap-2 px-5 py-2 text-white bg-[#0099cc] rounded-lg hover:bg-[#0077a3] transition-colors border border-transparent hover:border-gray-200 font-medium"
                >
                  <FileText size={18} />
                  {previewLoading ? "Loading..." : "Preview Email"}
                </button>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Settle Payroll Modal */}
      {selectedPayroll && modalType === "settle" && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40 backdrop-blur-sm p-4">
          <div className="relative w-full max-w-2xl h-xl bg-white rounded-xl shadow-lg border border-gray-100 p-4">
            {/* Close Button */}
            <button
              onClick={() => {
                setModalType(null);
                setSelectedPayroll(null);
              }}
              className="absolute top-4 right-4 z-10 p-2 text-gray-400 hover:text-gray-600 rounded-lg hover:bg-gray-100 transition-colors"
            >
              <X size={20} />
            </button>

            {/* Header */}
            <div className="p-6 border-b border-gray-100">
              <div className="flex items-center gap-3">
                <div className="p-2 bg-green-100 rounded-lg">
                  <CheckCircle className="w-7 h-7 text-green-600" />
                </div>
                <div>
                  <h3 className="text-xl font-semibold text-gray-800">
                    Settle Payroll
                  </h3>
                  <p className="text-gray-600 text-md mt-1">
                    Confirm payroll settlement
                  </p>
                </div>
              </div>
            </div>

            {/* Content */}
            <div className="p-6">
              <p className="text-gray-700 mb-4 text-md">
                Are you sure you want to mark this payroll as settled?
              </p>

              <div className="bg-gray-50 rounded-lg p-4 border border-gray-200 mb-6">
                <div className="space-y-2 text-md">
                  <div className="flex justify-between">
                    <span className="text-gray-600">Recipient:</span>
                    <span className="font-medium text-gray-800">
                      {selectedPayroll.fullname}
                    </span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-gray-600">Amount:</span>
                    <span className="font-medium text-gray-800">
                      LKR{" "}
                      {formatAmount(
                        selectedPayroll.totalAmount ?? selectedPayroll.amount
                      )}
                    </span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-gray-600">Account:</span>
                    <span className="font-medium text-gray-800">
                      {selectedPayroll.accountNo || "Not provided"}
                    </span>
                  </div>
                </div>
              </div>
            </div>

            {/* Footer Actions */}
            <div className="sticky bottom-0 left-0 bg-white py-4 px-6 border-t border-gray-100 rounded-b-xl">
              <div className="flex justify-end gap-3">
                <button
                  onClick={() => {
                    setModalType(null);
                    setSelectedPayroll(null);
                  }}
                  className="flex items-center gap-2 px-5 py-2 text-gray-600 bg-gray-50 rounded-lg hover:bg-gray-100 transition-colors border border-transparent hover:border-gray-200 font-medium"
                >
                  Cancel
                </button>
                <button
                  onClick={settlePayroll}
                  className="flex items-center gap-2 px-5 py-2 text-white bg-green-600 rounded-lg hover:bg-green-700 transition-colors font-medium shadow-sm hover:shadow-md"
                >
                  <CheckCircle size={18} />
                  Confirm Settlement
                </button>
              </div>
            </div>
          </div>
        </div>
      )}

      {previewHtml && (
        <div className="fixed inset-0 z-60 flex items-center justify-center bg-black/40 backdrop-blur-sm p-4">
          {" "}
          <div
            className="absolute inset-0"
            onClick={() => setPreviewHtml(null)}
          />{" "}
          <div className="relative z-10 w-full max-w-5xl bg-white rounded-xl shadow-lg border border-gray-100 p-6 overflow-auto max-h-[90vh]">
            {" "}
            <button
              onClick={() => setPreviewHtml(null)}
              className="absolute top-4 right-4 z-10 p-2 text-gray-400 hover:text-gray-600 rounded-lg hover:bg-gray-100 transition-colors"
            >
              {" "}
              <X size={20} />{" "}
            </button>{" "}
            <h3 className="text-lg font-semibold text-gray-800 mb-4">
              {" "}
              Email Preview{" "}
            </h3>{" "}
            <div
              className="prose max-w-none border rounded-lg p-6 bg-gray-50"
              dangerouslySetInnerHTML={{ __html: previewHtml }}
            />{" "}
          </div>{" "}
        </div>
      )}
    </div>
  );
}
