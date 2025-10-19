"use client";

import { useEffect, useState, useMemo } from "react";
import Swal from "sweetalert2";
import SearchFilter from "@/app/dashboardComponents/SearchFilter";
import CustomTable from "@/app/dashboardComponents/CustomTable";
import { FileText, CheckCircle } from "lucide-react";
import React from "react";

//  Define the structure of a payroll record
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
  // Add other student fields as needed
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

  // Bank editing states
  const [editingBank, setEditingBank] = useState(false);
  const [bankFields, setBankFields] = useState<BankFields>({
    accountNo: "",
    bank: "",
    branch: "",
  });

  useEffect(() => {
    //
    const fetchPayrolls = async () => {
      try {
        const res = await fetch("/api/admin/payroll");
        if (!res.ok) {
          throw new Error("Failed to fetch payroll data");
        }
        const data = await res.json();
        // console.log("-----------------------------", data);
        setPayrolls(data); ///stores payroll data
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
          .filter(Boolean) // Remove null/undefined values
          .some((field) =>
            field!.toString().toLowerCase().includes(searchTerm.toLowerCase())
          );

      //  Check if role matches selected role filter
      const matchesRole =
        selectedRole === "" ||
        (p.role && p.role.toLowerCase() === selectedRole.toLowerCase());

      // Check if status matches selected status filter
      const matchesStatus =
        selectedStatus === "" ||
        (p.status &&
          p.status.toLowerCase().includes(selectedStatus.toLowerCase()));

      // month & year filters
      const matchesMonth =
        selectedMonth === "" || (p.month && p.month === selectedMonth);
      const matchesYear =
        selectedYear === "" || (p.year && p.year === selectedYear);

      //  Return true only if ALL filters match
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
        // Fetch detailed payroll information for this recipient and month/year
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
        //  Log error but don't show alert (non-critical)
        console.error("Error fetching payroll details:", err);
      }
    })();
  };

  //  Open modal to settle/mark a payroll as paid
  const handleSettle = (row: PayrollRecord) => {
    // Store the selected payroll record
    setSelectedPayroll(row);

    //  Set modal type to "settle"
    setModalType("settle");
  };

  const settlePayroll = async () => {
    // Guard clause - exit if no payroll is selected
    if (!selectedPayroll) return;

    try {
      //  Send POST request to settle the payroll
      const res = await fetch(`/api/admin/payroll/settle`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          // send the payroll record id (grouped payroll id), not the recipient's user id
          payrollId: selectedPayroll.id,
          // include month info so the server can settle all related transactions
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

      // Update local state: mark all payrolls that match the recipientId and month as Settled
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

      // Close modal
      setModalType(null);
      setSelectedPayroll(null);

      // Show success message
      Swal.fire({
        icon: "success",
        title: "Settled",
        text: "Payroll has been marked as settled.",
        confirmButtonColor: "#0099cc",
      });
    } catch (err) {
      // Handle errors
      console.error("Error settling payroll:", err);

      //  Show error alert
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
      //
      if (!selectedPayroll) throw new Error("No payroll selected");

      //  Get recipient information
      const recipientId = selectedPayroll.recipientId;
      const recipientRole =
        selectedPayroll.recipientRole || selectedPayroll.role || "";

      //
      if (!recipientId || !recipientRole) {
        throw new Error("Missing recipientId or role");
      }

      // Send POST request to update bank details
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

      //  Parse response
      const responseData = await response.json();

      //  Check for errors
      if (!response.ok) {
        throw new Error(responseData?.error || "Failed to update");
      }

      // Update the selected payroll with new bank details
      setSelectedPayroll((prev) => (prev ? { ...prev, ...bankFields } : prev));

      // Update the payrolls list to show new bank details in table
      setPayrolls((prev) =>
        prev.map((p) =>
          p.id === selectedPayroll.id ? { ...p, ...bankFields } : p
        )
      );

      //  Exit editing mode
      setEditingBank(false);

      // Show success message
      Swal.fire("Success", "Bank info updated", "success");
    } catch (err) {
      //  Handle errors
      console.error("Error updating bank details:", err);

      // Show error alert
      Swal.fire("Error", "Unable to update bank info", "error");
    }
  };

  // LOADING STATE

  //  Show loading message while data is being fetched
  if (loading) {
    return <p className="text-center p-4">Loading payrolls...</p>;
  }

  // MAIN RENDER
  return (
    <div className="p-6 space-y-4">
      <SearchFilter
        onSearchChange={setSearchTerm}
        onRoleChange={setSelectedRole}
        onStatusChange={setSelectedStatus}
        onDateChange={() => {}}
        onMonthChange={setSelectedMonth}
        onYearChange={setSelectedYear}
        onClearFilters={handleClearFilters}
        config={{
          searchPlaceholder: "Search by name, account, or bank",
          showAddButton: false,
          showClearButton: true,
          showDateFilter: false,
          roleOptions: [
            { value: "", label: "Role" },
            { value: "Driver", label: "Driver" },
            { value: "Service", label: "Service" },
          ],
          statusOptions: [
            { value: "", label: "Status" },
            { value: "Pending", label: "Pending" },
            { value: "Completed", label: "Completed" },
          ],
          // derive month/year options from payrolls
          monthOptions: [
            { value: "", label: "Month" },
            ...Array.from(
              new Set(payrolls.map((p) => p.month).filter(Boolean))
            ).map((m) => ({ value: m as string, label: m as string })),
          ],
          yearOptions: [
            { value: "", label: "Year" },
            ...Array.from(
              new Set(payrolls.map((p) => p.year).filter(Boolean))
            ).map((y) => ({ value: y as string, label: y as string })),
          ],
        }}
      />

      <CustomTable
        columns={columns}
        data={filteredPayrolls}
        // Render amounts with two decimal places
        renderCell={(column, value, row) => {
          if (column === "totalAmount" || column === "amount") {
            const num = Number(value ?? row.amount ?? row.totalAmount ?? 0);
            return new Intl.NumberFormat(undefined, {
              minimumFractionDigits: 2,
              maximumFractionDigits: 2,
            }).format(num);
          }
          return String(value ?? "");
        }}
        actions={[
          {
            type: "custom",
            icon: <FileText size={16} color="blue" />,
            label: "View",
            onClick: handleView,
          },
          {
            type: "custom",
            icon: <CheckCircle size={16} color="green" />,
            label: "Settle",
            onClick: handleSettle,
          },
        ]}
      />

      {selectedPayroll && modalType === "view" && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/30 backdrop-blur-sm">
          {/*clicking it closes the modal */}
          <div
            className="absolute inset-0"
            onClick={() => {
              setModalType(null);
              setSelectedPayroll(null);
            }}
          />

          {/* Modal content */}
          <div className="relative z-10 w-full max-w-3xl bg-white rounded-lg shadow-xl p-8 animate-slideUp">
            {/*Close button */}
            <button
              onClick={() => {
                setModalType(null);
                setSelectedPayroll(null);
              }}
              className="absolute top-4 right-4 text-2xl text-gray-400 hover:text-[#0099cc] font-bold"
              aria-label="Close"
            >
              &times;
            </button>

            {/*  Modal title */}
            <h3 className="text-2xl font-semibold text-[#6a6c6c] mb-6">
              Payroll Details
            </h3>

            {/*Personal information section */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-y-4 gap-x-8 text-sm border-b pb-6 mb-6">
              <div className="flex justify-between">
                <span className="text-[#0099cc] font-bold">Name:</span>
                <span className="font-semibold text-gray-900 text-right">{`${
                  selectedPayroll.fullname || "N/A"
                }`}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-[#0099cc] font-bold">Role:</span>
                <span className="font-semibold text-gray-900 text-right">
                  {selectedPayroll.role}
                </span>
              </div>
              <div className="flex justify-between">
                <span className="text-[#0099cc] font-bold">Van Service:</span>
                <span className="font-semibold text-gray-900 text-right">
                  {selectedPayroll.vanServiceName || "-"}
                </span>
              </div>
              <div className="flex justify-between">
                <span className="text-[#0099cc] font-bold">Date:</span>
                <span className="font-semibold text-gray-900 text-right">
                  {selectedPayroll.monthYear}
                </span>
              </div>
            </div>

            {/*  Payment details section */}
            <div className="mb-4">
              <h4 className="text-[#0099cc] font-bold mb-2">Payment Details</h4>
              <div className="border rounded p-3 bg-gray-50 text-gray-800 text-sm">
                {/*  Amount display */}
                <div className="flex justify-between">
                  <span>Amount</span>
                  <span className="font-semibold">
                    LKR{" "}
                    {formatAmount(
                      selectedPayroll.totalAmount ?? selectedPayroll.amount
                    )}
                  </span>
                </div>

                {/* Bank details */}
                <div className="flex flex-col gap-2 mt-2">
                  <div className="flex justify-between">
                    <span>Bank</span>
                    <span className="font-semibold">
                      {selectedPayroll.bank || "-"}
                    </span>
                  </div>
                  <div className="flex justify-between">
                    <span>Account No</span>
                    <span className="font-semibold">
                      {selectedPayroll.accountNo || "-"}
                    </span>
                  </div>
                  <div className="flex justify-between">
                    <span>Branch</span>
                    <span className="font-semibold">
                      {selectedPayroll.branch || "-"}
                    </span>
                  </div>
                </div>

                {/* only show if bank details are missing */}
                {(selectedPayroll.bank === null ||
                  selectedPayroll.accountNo === null ||
                  selectedPayroll.branch === null) && (
                  <div className="mt-3">
                    {/* Show "Add Bank Details" button when not editing */}
                    {!editingBank ? (
                      <button
                        onClick={() => setEditingBank(true)}
                        className="px-3 py-1 bg-[#0099cc] text-white rounded hover:bg-[#007aaf] transition"
                      >
                        Add Bank Details
                      </button>
                    ) : (
                      /*  Show input fields when editing */
                      <div className="space-y-2">
                        {/*  Bank name input */}
                        <input
                          className="w-full border p-2 rounded focus:outline-none focus:ring-2 focus:ring-[#0099cc]"
                          placeholder="Bank"
                          value={bankFields.bank}
                          onChange={(e) =>
                            setBankFields({
                              ...bankFields,
                              bank: e.target.value,
                            })
                          }
                        />
                        {/*  Branch input */}
                        <input
                          className="w-full border p-2 rounded focus:outline-none focus:ring-2 focus:ring-[#0099cc]"
                          placeholder="Branch"
                          value={bankFields.branch}
                          onChange={(e) =>
                            setBankFields({
                              ...bankFields,
                              branch: e.target.value,
                            })
                          }
                        />
                        {/*  Account number input */}
                        <input
                          className="w-full border p-2 rounded focus:outline-none focus:ring-2 focus:ring-[#0099cc]"
                          placeholder="Account No"
                          value={bankFields.accountNo}
                          onChange={(e) =>
                            setBankFields({
                              ...bankFields,
                              accountNo: e.target.value,
                            })
                          }
                        />
                        {/* Action buttons */}
                        <div className="flex gap-2">
                          {/*  Save button */}
                          <button
                            onClick={handleSaveBankDetails}
                            className="px-3 py-1 bg-green-600 text-white rounded hover:bg-green-700 transition"
                          >
                            Save
                          </button>
                          {/*  Cancel button */}
                          <button
                            onClick={() => setEditingBank(false)}
                            className="px-3 py-1 border rounded hover:bg-gray-100 transition"
                          >
                            Cancel
                          </button>
                        </div>
                      </div>
                    )}
                  </div>
                )}

                {/*  Status display */}
                <div className="flex justify-between mt-2">
                  <span>Status</span>
                  <span className="font-semibold">
                    {selectedPayroll.status || "-"}
                  </span>
                </div>
              </div>
            </div>

            {/*  Children/Students count (if loaded) */}
            {studentsList.length > 0 && (
              <div className="mb-4 text-sm text-gray-700">
                <span className="font-medium text-[#0099cc]">Children:</span>{" "}
                <span>
                  {studentsList.length} child(ren) included in this payroll
                </span>
                <div className="mt-3 border rounded bg-white p-3">
                  <table className="w-full text-sm">
                    <thead>
                      <tr className="text-left text-gray-600">
                        <th className="pb-2">Child</th>
                        <th className="pb-2 text-right">Paid Amount</th>
                        <th className="pb-2 text-right">System Fee</th>
                        <th className="pb-2 text-right">Allocated</th>
                      </tr>
                    </thead>
                    <tbody>
                      {studentsList.map((s: Student) => (
                        <React.Fragment key={s.childId}>
                          <>
                            <tr key={s.childId} className="border-t">
                              <td className="py-2 align-top">{s.name}</td>
                              <td className="py-2 text-right font-semibold align-top">
                                LKR {formatAmount(s.amountPaid)}
                              </td>
                              <td className="py-2 text-right font-semibold align-top">
                                LKR {formatAmount(s.totalSystemFee)}
                              </td>
                              <td className="py-2 text-right font-semibold align-top">
                                LKR {formatAmount(s.allocatedToRecipient)}
                              </td>
                            </tr>

                            {/* Per-payment breakdown for this child */}
                            {s.payments && s.payments.length > 0 && (
                              <tr key={`payments-${s.childId}`}>
                                <td colSpan={4} className="bg-gray-50">
                                  <div className="p-3">
                                    <div className="text-xs text-gray-600 mb-2 font-medium">
                                      Payment breakdown
                                    </div>
                                    <table className="w-full text-xs">
                                      <thead>
                                        <tr className="text-left text-gray-500">
                                          <th className="pb-1">Payment ID</th>
                                          <th className="pb-1 text-right">
                                            Amount
                                          </th>
                                          <th className="pb-1 text-right">
                                            System Fee
                                          </th>
                                          <th className="pb-1 text-right">
                                            Driver Share
                                          </th>
                                          <th className="pb-1 text-right">
                                            Owner Share
                                          </th>
                                        </tr>
                                      </thead>
                                      <tbody>
                                        {s.payments.map((p) => (
                                          <tr key={p.id} className="border-t">
                                            <td className="py-1">{p.id}</td>
                                            <td className="py-1 text-right">
                                              LKR {formatAmount(p.amount)}
                                            </td>
                                            <td className="py-1 text-right">
                                              LKR {formatAmount(p.systemFee)}
                                            </td>
                                            <td className="py-1 text-right">
                                              LKR {formatAmount(p.driverShare)}
                                            </td>
                                            <td className="py-1 text-right">
                                              LKR {formatAmount(p.ownerShare)}
                                            </td>
                                          </tr>
                                        ))}
                                      </tbody>
                                    </table>
                                  </div>
                                </td>
                              </tr>
                            )}
                          </>
                        </React.Fragment>
                      ))}
                    </tbody>
                  </table>
                </div>
              </div>
            )}

            {/*  Modal action buttons */}
            <div className="flex justify-end gap-3">
              {/*  Close button */}
              <button
                onClick={() => {
                  setModalType(null);
                  setSelectedPayroll(null);
                }}
                className="px-5 py-2 border border-gray-300 rounded-md text-gray-700 hover:bg-gray-100 transition font-semibold"
              >
                Close
              </button>
              {/*  Settle button */}
              <button
                onClick={() => {
                  setModalType("settle");
                }}
                className="px-5 py-2 bg-[#0099cc] hover:bg-[#007aaf] text-white rounded-md font-semibold transition"
              >
                Settle
              </button>
            </div>
          </div>
        </div>
      )}

      {selectedPayroll && modalType === "settle" && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/30 backdrop-blur-sm">
          {/*  Backdrop - clicking it closes the modal */}
          <div
            className="absolute inset-0"
            onClick={() => {
              setModalType(null);
              setSelectedPayroll(null);
            }}
          />

          {/* Modal content */}
          <div className="relative z-10 w-full max-w-3xl bg-white rounded-lg shadow-xl p-8 animate-slideUp">
            {/*  Close button */}
            <button
              onClick={() => {
                setModalType(null);
                setSelectedPayroll(null);
              }}
              className="absolute top-4 right-4 text-2xl text-gray-400 hover:text-[#0099cc] font-bold"
              aria-label="Close"
            >
              &times;
            </button>

            {/*  Modal title */}
            <h3 className="text-2xl font-semibold text-[#6a6c6c] mb-6">
              Settle Payroll
            </h3>

            {/* Confirmation message */}
            <p className="mb-4">
              Are you sure you want to mark this payroll as settled?
            </p>

            {/*  Summary of payroll being settled */}
            <div className="mb-6 border rounded p-4 bg-gray-50">
              <div className="flex justify-between">
                <span className="font-medium">Name</span>
                <span>{`${selectedPayroll.fullname}`}</span>
              </div>
              <div className="flex justify-between mt-2">
                <span className="font-medium">Amount</span>
                <span>
                  LKR{" "}
                  {formatAmount(
                    selectedPayroll.totalAmount ?? selectedPayroll.amount
                  )}
                </span>
              </div>
              <div className="flex justify-between mt-2">
                <span className="font-medium">Account</span>
                <span>{`${selectedPayroll.accountNo || "-"}`}</span>
              </div>
            </div>

            {/* Modal action buttons */}
            <div className="flex justify-end gap-3">
              {/*  Cancel button */}
              <button
                onClick={() => {
                  setModalType(null);
                  setSelectedPayroll(null);
                }}
                className="px-5 py-2 border border-gray-300 rounded-md text-gray-700 hover:bg-gray-100 transition font-semibold"
              >
                Cancel
              </button>
              {/*  Confirm settle button */}
              <button
                onClick={settlePayroll}
                className="px-5 py-2 bg-[#0099cc] hover:bg-[#007aaf] text-white rounded-md font-semibold transition"
              >
                Confirm Settle
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
