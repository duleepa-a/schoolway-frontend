import StudentEnrollmentCard from "./StudentEnrollmentCard";
import { FaSearch, FaChevronDown } from 'react-icons/fa';
import TablePagination from '@/app/components/TablePagination';

const StudentRequests = () => {
  const sampleRequests = [
    {
      id: 1,
      student: {
        name: "Emily Johnson",
        profilePic: "/Images/male_pro_pic_placeholder.png",
        grade: "Grade 8"
      },
      van: {
        name: "Toyota HiAce Spec 10",
        plateNumber: "ABC-1234"
      },
      pickupLocation: "123 Maple Street, Colombo 07",
      school: "Royal College Colombo",
      specialNotes: "Please ensure Emily sits near the front as she gets motion sickness. Also, she has a nut allergy - please keep snacks away from her.",
      requestDate: "2025-06-25",
      status: "pending"
    },
    {
      id: 2,
      student: {
        name: "Michael Chen",
        profilePic: "/Images/male_pro_pic_placeholder.png",
        grade: "Grade 10"
      },
      van: {
        name: "Toyota HiAce Spec 10",
        plateNumber: "ABC-1234"
      },
      pickupLocation: "456 Oak Avenue, Colombo 05",
      school: "St. Thomas' College",
      specialNotes: "Michael needs to be picked up by 7:30 AM sharp as he has early morning classes.",
      requestDate: "2025-06-24",
      status: "accepted"
    },
    {
      id: 3,
      student: {
        name: "Sarah Williams",
        profilePic: "/Images/male_pro_pic_placeholder.png",
        grade: "Grade 6"
      },
      van: {
        name: "Toyota HiAce Spec 10",
        plateNumber: "ABC-1234"
      },
      pickupLocation: "789 Pine Road, Colombo 03",
      school: "Holy Family Convent",
      specialNotes: "",
      requestDate: "2025-06-23",
      status: "rejected"
    }
  ];

  const handleAccept = (requestId :number) => {
    console.log('Accepting request:', requestId);
    // Handle accept logic here
  };

  const handleReject = (requestId : number) => {
    console.log('Rejecting request:', requestId);
    // Handle reject logic here
  };

  const handleViewDetails = (requestId : number) => {
    console.log('Viewing details for request:', requestId);
    // Handle view details logic here
  };

  return (
    <div>
      <div className="flex flex-col md:flex-row md:items-center md:justify-between lg:justify-start  mb-4 gap-4">
        <div className="relative w-full md:w-1/3">
          <FaSearch className="absolute left-3 top-3 text-gray-400" />
          <input
            type="text"
            placeholder="Search students"
            className="
            w-full pl-10 pr-4 py-2 border border-gray-300 rounded-md  bg-search-bar-bg"
          />
        </div>
        <div className="relative w-full md:w-48">
          <select
            className="w-full px-4 py-3 bg-search-bar-bg rounded-md text-sm cursor-pointer appearance-none"
            defaultValue="Van 1"
          >
            <option disabled>Select Van</option>
            <option>Van 1</option>
            <option>Van 2</option>
            <option>Van 3</option>
          </select>
          <FaChevronDown className="ml-2 absolute top-3.5 left-40 cursor-pointer" />
        </div>
        <div className="relative w-full md:w-48">
          <select
            className="w-full px-4 py-3 bg-search-bar-bg rounded-md text-sm cursor-pointer appearance-none"
            defaultValue="Van 1"
          >
            <option disabled>Student Status</option>
            <option>All</option>
            <option>Active</option>
            <option>Inactive</option>
          </select>
          <FaChevronDown className="ml-2 absolute top-3.5 left-40 cursor-pointer" />
        </div>

        <TablePagination totalPages={5} />

      </div>
      <div className="flex grid-cols-3 gap-2.5">
          {sampleRequests.map((request) => (
              <StudentEnrollmentCard
                  key={request.id}
                  request={request}
                  onAccept={handleAccept}
                  onReject={handleReject}
                  onViewDetails={handleViewDetails}
              />
          ))}
      </div>
    </div>
  );
};

export default StudentRequests;