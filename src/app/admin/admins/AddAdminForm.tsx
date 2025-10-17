"use client";

import React from "react";
import Swal from "sweetalert2";
import ConfirmationBox from "@/app/dashboardComponents/ConfirmationBox";
import CustomTable from "@/app/dashboardComponents/CustomTable";
import SearchFilter from "@/app/dashboardComponents/SearchFilter";

//type definitions
type Admin = {
  email: string;
  firstname?: string;
  lastname?: string;
  contact?: string;
  status?: string;
  activeStatus?: boolean;
};
// main component
export default function AddAdminForm() {
  // state management
  const [formData, setFormData] = React.useState({
    email: "",
    firstName: "",
    lastName: "",
    contact: "",
  });

  const [admins, setAdmins] = React.useState<Admin[]>([]);
  const [loading, setLoading] = React.useState(false);

  // Filters
  const [searchTerm, setSearchTerm] = React.useState("");
  const [selectedStatus, setSelectedStatus] = React.useState("");

  // Confirmation Dialog
  const [confirmOpen, setConfirmOpen] = React.useState(false);
  const [dialogVariant, setDialogVariant] = React.useState<
    "warning" | "success" | "error"
  >("warning");
  const [dialogMessage, setDialogMessage] = React.useState("");
  const [confirmAction, setConfirmAction] = React.useState<
    "add" | "delete" | null
  >(null);
  const [selectedDeleteEmail, setSelectedDeleteEmail] = React.useState<
    string | null
  >(null);

  // fetch admins from backend
  React.useEffect(() => {
    const fetchAdmins = async () => {
      try {
        const res = await fetch("/api/admin/admins");
        if (!res.ok) return;

        const data = await res.json();
        const list = Array.isArray(data) ? data : [data];

        // map backend -> frontend format
        setAdmins(
          list.map((a: any) => ({
            email: a.email,
            firstname: a.firstname,
            lastname: a.lastname,
            contact: a.contact,
            status:
              typeof a.activeStatus !== "undefined"
                ? a.activeStatus
                  ? "Active"
                  : "Inactive"
                : a.status ?? "-",
          }))
        );
      } catch {
        // ignore errors
        alert("Error fetching admins");
      }
    };
    fetchAdmins();
  }, []);

  // handle form input changes
  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    const cleaned =
      name === "contact" ? value.replace(/[^\d+\-() ]/g, "") : value;
    setFormData((prev) => ({ ...prev, [name]: cleaned }));
  };

  // add admin confirmation
  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setDialogVariant("warning");
    setDialogMessage("Do you want to add this admin?");
    setConfirmAction("add");
    setConfirmOpen(true);
  };

  // deactivating admin confirmation
  const handleDelete = (row: { email: string; status?: string }) => {
    if (row.status?.toLowerCase() === "inactive") {
      Swal.fire({
        icon: "info",
        title: "Already Inactive",
        text: "This admin is already inactive and cannot be deactivated again.",
        confirmButtonColor: "#0099cc",
      });
      return; // stop further execution
    }
    setDialogVariant("warning");
    setDialogMessage("Do you want to deactivate this admin?");
    setSelectedDeleteEmail(row.email);
    setConfirmAction("delete");
    setConfirmOpen(true);
  };

  // handle confirmation for add/delete
  const handleConfirm = async () => {
    setConfirmOpen(false);
    setLoading(true);

    try {
      if (confirmAction === "add") {
        //  Send Add request
        const payload = {
          email: formData.email.trim(),
          firstname: formData.firstName.trim(),
          lastname: formData.lastName.trim(),
          contact: formData.contact.trim(),
          password: "admin",
        };

        const res = await fetch("/api/admin/admins", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify(payload),
        });
        const data = await res.json();

        if (!res.ok) throw new Error(data.error || "Failed to add admin");

        setAdmins((prev) => [
          ...prev,
          {
            email: data.email,
            firstname: data.firstname,
            lastname: data.lastname,
            contact: data.contact,
            status: "Active",
          },
        ]);

        setFormData({ email: "", firstName: "", lastName: "", contact: "" });
        setDialogVariant("success");
        setDialogMessage("Admin added successfully");
        setConfirmOpen(true);
      }

      if (confirmAction === "delete" && selectedDeleteEmail) {
        //  Send Delete request
        const res = await fetch("/api/admin/admins/terminate", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ email: selectedDeleteEmail }),
        });
        const data = await res.json();

        if (!res.ok)
          throw new Error(data.error || "Failed to deactivate admin");

        setAdmins((prev) =>
          prev.map((a) =>
            a.email === selectedDeleteEmail ? { ...a, status: "Inactive" } : a
          )
        );

        setDialogVariant("success");
        setDialogMessage("Admin deactivated");
        setConfirmOpen(true);
      }
    } catch (err: any) {
      setDialogVariant("error");
      setDialogMessage(err.message || "Network error");
      setConfirmOpen(true);
    } finally {
      setLoading(false);
      setConfirmAction(null);
      setSelectedDeleteEmail(null);
    }
  };

  const handleCancel = () => setConfirmOpen(false);
  const handleClearFilters = () => {
    setSearchTerm("");
    setSelectedStatus("");
  };

  // filter table data
  const tableRows = admins.map((a) => ({
    ...a,
    fullName: `${a.firstname ?? ""} ${a.lastname ?? ""}`.trim() || "-",
    contact: a.contact ?? "-",
    status: a.status ?? "-",
  }));

  const filteredRows = tableRows.filter((r) => {
    const term = searchTerm.trim().toLowerCase();

    const matchesSearch =
      !term ||
      [r.fullName, r.email, r.contact]
        .filter(Boolean)
        .some((v) => String(v).toLowerCase().includes(term));

    const matchesStatus =
      !selectedStatus ||
      String(r.status || "").toLowerCase() === selectedStatus.toLowerCase();

    return matchesSearch && matchesStatus;
  });

  return (
    <>
      {/* ----------------- MAIN LAYOUT ----------------- */}
      <div className="min-h-screen bg-gray-50 py-8">
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-4">
          {/* ----------- LEFT: Add Form ----------- */}
          <section className="lg:col-span-1">
            <div className="bg-white rounded-lg shadow-lg p-6">
              <h2 className="text-xl font-bold mb-4 text-gray-800">
                Add New Admin
              </h2>

              <form onSubmit={handleSubmit} className="space-y-5">
                {["email", "firstName", "lastName", "contact"].map((field) => (
                  <div key={field}>
                    <label className="block mb-1 font-semibold text-gray-700">
                      {field === "firstName"
                        ? "First Name"
                        : field === "lastName"
                        ? "Last Name"
                        : field.charAt(0).toUpperCase() + field.slice(1)}
                    </label>
                    <input
                      type={field === "email" ? "email" : "text"}
                      name={field}
                      value={(formData as any)[field]}
                      onChange={handleChange}
                      required
                      className="w-full px-4 py-2 border border-gray-300 rounded focus:ring-2 focus:ring-[#0099cc]"
                      placeholder={`Enter ${field
                        .replace(/([A-Z])/g, " $1")
                        .toLowerCase()}`}
                    />
                  </div>
                ))}

                <button
                  type="submit"
                  disabled={loading}
                  className="w-full bg-[#0099cc] text-white py-2 rounded font-semibold hover:bg-[#007aaf] transition-colors disabled:opacity-60"
                >
                  {loading ? "Adding..." : "Add Admin"}
                </button>
              </form>
            </div>
          </section>

          {/* ----------- RIGHT: Admin Table ----------- */}
          <section className="lg:col-span-2">
            <div className="bg-white rounded-lg shadow-lg p-6">
              <div className="flex items-center justify-between mb-4">
                <h2 className="text-xl font-bold text-gray-800">All Admins</h2>
              </div>

              <SearchFilter
                onSearchChange={setSearchTerm}
                onStatusChange={setSelectedStatus}
                onClearFilters={handleClearFilters}
                config={{
                  showAddButton: false,
                  showDateFilter: false,
                  roleOptions: undefined,
                  showClearButton: true,
                  searchPlaceholder: "Search by name, email...",
                  statusOptions: [
                    { value: "", label: "Status" },
                    { value: "Active", label: "Active" },
                    { value: "Inactive", label: "Inactive" },
                  ],
                }}
              />

              <CustomTable
                columns={[
                  { key: "email", label: "Email" },
                  { key: "fullName", label: "Name" },
                  { key: "status", label: "Status" },
                ]}
                data={filteredRows}
                actions={[
                  {
                    type: "delete",
                    label: "Delete",
                    onClick: (row) => handleDelete(row),
                  },
                ]}
              />
            </div>
          </section>
        </div>
      </div>

      {/* ----------------- CONFIRMATION MODAL ----------------- */}
      <ConfirmationBox
        isOpen={confirmOpen}
        variant={dialogVariant}
        title={
          confirmAction === "delete"
            ? dialogVariant === "warning"
              ? "Confirm Deactivate Admin"
              : dialogVariant === "success"
              ? "Success"
              : "Error"
            : dialogVariant === "warning"
            ? "Confirm Add Admin"
            : dialogVariant === "success"
            ? "Success"
            : "Error"
        }
        message={
          dialogVariant === "error" || dialogVariant === "success"
            ? dialogMessage
            : ""
        }
        confirmationMessage={dialogVariant === "warning" ? dialogMessage : ""}
        objectName={
          confirmAction === "delete"
            ? selectedDeleteEmail ?? ""
            : formData.email || ""
        }
        onConfirm={dialogVariant === "warning" ? handleConfirm : handleCancel}
        onCancel={handleCancel}
        confirmText={
          dialogVariant === "warning"
            ? confirmAction === "delete"
              ? "Deactivate"
              : "Add Admin"
            : "Close"
        }
        cancelText={dialogVariant === "warning" ? "Cancel" : "Close"}
      />
    </>
  );
}
