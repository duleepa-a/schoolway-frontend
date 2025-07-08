'use client';
import { useState, useMemo } from 'react';
import TopBar from '@/app/dashboardComponents/TopBar';
import SearchFilter from '@/app/dashboardComponents/SearchFilter';
import DataTable from '@/app/dashboardComponents/CustomTable';
import { inquiriesData } from '../../../../public/dummy_data/inquiries';
import { MessageCircle, CheckCircle } from 'lucide-react';



const columns = [
  { key: "Name", label: "Name" },
  { key: "Email", label: "Email" },
  { key: "Description", label: "Description" },
  { key: "Status", label: "Status" },
];

const InquiriesPage = () => {
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedStatus, setSelectedStatus] = useState('');

  // Filter the data based on search criteria
  const filteredData = useMemo(() => {
    return inquiriesData.filter((inquiry) => {
      // Search filter - searches in name, email, and description
      const matchesSearch = searchTerm === '' || 
        inquiry.Name.toLowerCase().includes(searchTerm.toLowerCase()) ||
        inquiry.Email.toLowerCase().includes(searchTerm.toLowerCase()) ||
        inquiry.Description.toLowerCase().includes(searchTerm.toLowerCase());

      // Status filter
      const matchesStatus = selectedStatus === '' || inquiry.Status === selectedStatus;

      return matchesSearch && matchesStatus;
    });
  }, [searchTerm, selectedStatus]);

  const handleAddInquiry = () => {
    console.log("Add inquiry clicked");
    // Implement add inquiry functionality
  };

  const handleClearFilters = () => {
    setSearchTerm('');
    setSelectedStatus('');
  };

  const handleReply = (row: Record<string, string | number | boolean | null | undefined>) => {
    console.log("Reply clicked:", row);
    alert(`Replying to ${row.Name} (${row.Email})\n\nInquiry: ${row.Description}`);
    // Here you would typically open a reply modal or navigate to a reply page
  };

  const handleResolve = (row: Record<string, string | number | boolean | null | undefined>) => {
    console.log("Resolve clicked:", row);
    alert(`Marking inquiry from ${row.Name} as resolved`);
    // Here you would typically update the inquiry status to resolved
  };

  return (
      <div className="mt-8">
        <section className="p-5 md:p-10 min-h-screen w-full">
          {/*Top bar with profile icon and the heading*/}
          <TopBar heading="Inquiries" />

          <SearchFilter 
            onSearchChange={setSearchTerm}
            onRoleChange={() => {}} // Not used for inquiries
            onStatusChange={setSelectedStatus}
            onDateChange={() => {}} // Placeholder for future date filtering
            onClearFilters={handleClearFilters}
            config={{
              searchPlaceholder: "Search inquiries by name, email, or description",
              onAddClick: handleAddInquiry,
              addButtonText: "+ Add Inquiry",
              statusOptions: [
                { value: "", label: "Status" },
                { value: "Pending", label: "Pending" },
                { value: "In Progress", label: "In Progress" },
                { value: "Resolved", label: "Resolved" },
              ],
              roleOptions: [
                { value: "", label: "Role" }, // Hidden but required
              ],
              showDateFilter: false,
            }}
          />

          <div className="mt-4">
            <DataTable
              columns={columns}
              data={filteredData}
              actions={[
                { 
                  type: "custom", 
                  icon: <MessageCircle size={16} />,
                  label: "Reply to Inquiry",
                  className: "text-blue-600 hover:text-blue-900 p-2 rounded-full hover:bg-blue-100 transition-colors",
                  onClick: handleReply 
                },
                { 
                  type: "custom", 
                  icon: <CheckCircle size={16} />,
                  label: "Mark as Resolved",
                  className: "text-green-600 hover:text-green-900 p-2 rounded-full hover:bg-green-100 transition-colors",
                  onClick: handleResolve 
                },
              ]}
            />
          </div>
        </section>
      </div>
  )
}

export default InquiriesPage;
