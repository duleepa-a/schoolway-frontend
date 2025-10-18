"use client";

import { useState, useMemo, useEffect } from "react";
import DataTable from "@/app/dashboardComponents/CustomTable";
import { MdDeleteSweep } from "react-icons/md";
import { FileText } from "lucide-react";
import {
  FaSearch,
  FaUser,
  FaRegCalendarAlt,
  FaLightbulb,
  FaChevronDown,
} from "react-icons/fa";
import ViewPaymentModal from "./ViewPaymentModal";

const columns = [
  { key: "PaymentID", label: "Payment ID" },
  { key: "ParentID", label: "Parent ID" },
  { key: "FullName", label: "Full Name" },
  { key: "VanID", label: "Van ID" },
  { key: "Date", label: "Date" },
  { key: "Status", label: "Status" },
];

const PaymentsPageContent = () => {
  const [nameOrPaymentID, setNameOrPaymentID] = useState("");
  const [parentID, setParentID] = useState("");
  const [vanID, setVanID] = useState("");
  const [selectedStatus, setSelectedStatus] = useState("");
  const [selectedDate, setSelectedDate] = useState("");
  type PaymentItem = {
    PaymentID: string;
    ParentID: string;
    FullName: string;
    VanID: string;
    Date: string | null;
    Status: string;
    Amount?: number;
    Month?: string;
    PaidAt?: string | null;
    PaymentType?: string;
    ChildId?: number;
  };

  const [payments, setPayments] = useState<PaymentItem[]>([]);
  const [selectedPayment, setSelectedPayment] = useState<PaymentItem | null>(
    null
  );

  useEffect(() => {
    const fetchPayments = async () => {
      try {
        const res = await fetch("/api/admin/payment");
        if (!res.ok) throw new Error("Failed to fetch payments");
        const data = await res.json();
        setPayments(data);
      } catch (err) {
        console.error("Error fetching payments:", err);
      } finally {
        // finished
      }
    };
    fetchPayments();
  }, []);

  const filteredData = useMemo(() => {
    return payments.filter((record) => {
      const matchNameOrPaymentID =
        nameOrPaymentID === "" ||
        record.FullName.toLowerCase().includes(nameOrPaymentID.toLowerCase()) ||
        record.PaymentID.toLowerCase().includes(nameOrPaymentID.toLowerCase());

      const matchParentID =
        parentID === "" ||
        record.ParentID.toLowerCase().includes(parentID.toLowerCase());

      const matchVanID =
        vanID === "" ||
        record.VanID.toLowerCase().includes(vanID.toLowerCase());

      const matchStatus =
        selectedStatus === "" || record.Status === selectedStatus;

      const matchDate = selectedDate === "" || record.Date === selectedDate;

      return (
        matchNameOrPaymentID &&
        matchParentID &&
        matchVanID &&
        matchStatus &&
        matchDate
      );
    });
  }, [
    nameOrPaymentID,
    parentID,
    vanID,
    selectedStatus,
    selectedDate,
    payments,
  ]);

  const handleClearFilters = () => {
    setNameOrPaymentID("");
    setParentID("");
    setVanID("");
    setSelectedStatus("");
    setSelectedDate("");
  };

  const handleView = (row: PaymentItem) => {
    setSelectedPayment(row);
  };

  const closeModal = () => setSelectedPayment(null);

  return (
    <div>
      {/* Filters UI */}
      <div className="filterWrapper">
        <div className="flex flex-wrap gap-2">
          {/* Name or PaymentID */}
          <div className="filterInput">
            <FaSearch />
            <input
              type="text"
              placeholder="Name or Payment ID"
              className="outline-none bg-transparent text-sm w-full"
              value={nameOrPaymentID}
              onChange={(e) => setNameOrPaymentID(e.target.value)}
            />
          </div>

          {/* ParentID */}
          <div className="filterInput">
            <FaUser />
            <input
              type="text"
              placeholder="Parent ID"
              className="outline-none bg-transparent text-sm w-full"
              value={parentID}
              onChange={(e) => setParentID(e.target.value)}
            />
          </div>

          {/* VanID */}
          <div className="filterInput">
            <FaUser />
            <input
              type="text"
              placeholder="Van ID"
              className="outline-none bg-transparent text-sm w-full"
              value={vanID}
              onChange={(e) => setVanID(e.target.value)}
            />
          </div>

          {/* Status Dropdown */}
          <div className="filterDropdown" style={{ maxWidth: "130px" }}>
            <FaLightbulb />
            <select
              className="selectField "
              value={selectedStatus}
              onChange={(e) => setSelectedStatus(e.target.value)}
            >
              <option value="">Status</option>
              <option value="Paid">Paid</option>
              <option value="Pending">Pending</option>
              <option value="Failed">Failed</option>
            </select>
            <span className="dropdownArrow">
              <FaChevronDown />
            </span>
          </div>

          {/* Date Picker */}
          <div className="filterDropdown">
            <FaRegCalendarAlt />
            <input
              type="date"
              className="dateField"
              value={selectedDate}
              onChange={(e) => setSelectedDate(e.target.value)}
            />
            <span className="dropdownArrow">
              <FaChevronDown />
            </span>
          </div>
        </div>

        {/* Clear Filters icon*/}

        <div className="relative group">
          <span className="cursor-pointer text-gray-500">
            <MdDeleteSweep size={25} onClick={handleClearFilters} />
          </span>
          <div className="absolute hidden group-hover:block bg-black text-white text-xs rounded-xl px-2 py-1 my-1 top-6 left-1/2 -translate-x-1/2 whitespace-nowrap z-10">
            Clear
          </div>
        </div>
      </div>

      {/* Data Table */}
      <div className="mt-4">
        <DataTable
          columns={columns}
          data={filteredData}
          actions={[
            {
              type: "custom",
              icon: <FileText className="ml-5" size={16} color="blue" />,
              label: "View Payment",
              onClick: handleView,
            },
          ]}
        />
      </div>

      {selectedPayment && (
        <ViewPaymentModal payment={selectedPayment} onClose={closeModal} />
      )}
    </div>
  );
};

export default PaymentsPageContent;
