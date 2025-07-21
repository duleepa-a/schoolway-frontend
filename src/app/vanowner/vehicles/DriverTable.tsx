import { FaSearch, FaChevronDown } from 'react-icons/fa';
import TablePagination from '@/app/components/TablePagination';
import { useEffect, useState } from 'react';
import { MdLogout } from 'react-icons/md';
import { FaTrash } from 'react-icons/fa';


const statusColors = {
  ACCEPTED: 'bg-green-100 text-green-600 border-green-500',
  PENDING: 'bg-yellow-100 text-yellow-600 border-yellow-500',
  REJECTED: 'bg-red-100 text-red-600 border-red-500',
};

export default function DriverTable() {
  const [driverRequests, setDriverRequests] = useState([]);

  useEffect(() => {
    const fetchDriverRequests = async () => {
      try {
        const res = await fetch('/api/driver-requests');
        const data = await res.json();
        setDriverRequests(data);
      } catch (err) {
        console.error('Failed to fetch driver requests:', err);
      }
    };

    fetchDriverRequests();
  }, []);

  return (
    <div className="">
      <div className="flex flex-col md:flex-row md:items-center md:justify-between lg:justify-start  mb-4 gap-4">
        <div className="relative w-full md:w-1/3">
          <FaSearch className="absolute left-3 top-3 text-gray-400" />
          <input
            type="text"
            placeholder="Search Driver Name.."
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
            <option>Accepted</option>
            <option>Pending</option>
          </select>
          <FaChevronDown className="ml-2 absolute top-3.5 left-40 cursor-pointer" />
        </div>

        {/* <TablePagination totalPages={5} /> */}

      </div>

      {/* Table */}
      <div className="overflow-x-auto">
        <table className="w-full border-collapse rounded-md overflow-hidden">
          <thead>
            <tr className="bg-primary text-white text-left text-sm">
              <th className="p-3">Driver Name</th>
              <th className="p-3">Van</th>
              <th className="p-3">Status</th>
              <th className="p-3">Action</th>
            </tr>
          </thead>
          <tbody className="text-sm">
              {driverRequests.map((d, index) => (
                <tr
                  key={index}
                  className={`${
                    index % 2 === 0 ? 'bg-white' : 'bg-gray-50'
                  } border-b border-border-light-shade`}
                >
                  <td className="p-3 gap-2">
                    <span className="text-gray-800 font-medium">{d.name}</span>
                  </td>
                  <td className="p-3 gap-2">
                    <span className="text-gray-800 font-medium">{d.van}</span>
                  </td>
                  <td className="p-3">
                    <span
                      className={`text-xs px-3 py-1 rounded-full border ${
                        statusColors[d.status as keyof typeof statusColors] || 'bg-gray-100 text-gray-600 border-gray-400'
                      }`}
                    >
                      {d.status}
                    </span>
                  </td>
                  
                  <td className="p-3 gap-2">
                    <div className="flex items-center justify-start">
                      {d.status === 'ACCEPTED' ? (
                        <button
                          className="text-red-600 hover:text-red-800 text-lg cursor-pointer"
                          title="Resign"
                        >
                          <MdLogout />
                        </button>
                      ) : d.status === 'REJECTED' ? (
                        <button
                          className="text-gray-600 hover:text-gry-800 text-lg cursor-pointer"
                          title="Delete"
                        >
                          <FaTrash />
                        </button>
                      ) : 
                        <div className='flex items-center justify-center'>
                            <span className="text-gray-600 text-sm">
                              N/A
                            </span>
                        </div>
                      }
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
        </table>
      </div>
    </div>
  );
}
