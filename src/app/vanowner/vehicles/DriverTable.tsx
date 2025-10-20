import { FaSearch, FaChevronDown } from 'react-icons/fa';
import TablePagination from '@/app/components/TablePagination';
import { useEffect, useState } from 'react';
import { MdLogout } from 'react-icons/md';
import { FaTrash } from 'react-icons/fa';

const statusColors = {
  ACCEPTED: 'text-[var(--green-shade-dark)] border-[var(--green-shade-dark)] bg-green-50',
  PENDING: 'text-[var(--blue-shade-dark)] border-[var(--blue-shade-dark)] bg-[var(--blue-shade-light)]/20',
  REJECTED: 'text-red-600 border-red-600 bg-red-50',
};

export default function DriverTable() {
  const [driverRequests, setDriverRequests] = useState([]);
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedVan, setSelectedVan] = useState('');
  const [selectedStatus, setSelectedStatus] = useState('');
  const [page, setPage] = useState(1);

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

  const filteredDrivers = driverRequests.filter(driver => {
    const matchesSearch = driver.name.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesVan = !selectedVan || driver.van === selectedVan;
    const matchesStatus = !selectedStatus || driver.status === selectedStatus;
    return matchesSearch && matchesVan && matchesStatus;
  });

  return (
    <div className="space-y-4">
      {/* Filters Section */}
      <div className="flex flex-col md:flex-row md:items-center md:justify-between lg:justify-start gap-4 mb-4">
        {/* Search Input */}
        <div className="relative flex-1 max-w-md">
          <FaSearch className="absolute left-3 top-3.5 text-gray-400 text-sm" />
          <input
            type="text"
            placeholder="Search driver name.."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="w-full pl-10 pr-4 py-2.5 border border-gray-200 rounded-md bg-white text-sm focus:outline-none focus:ring-2 focus:ring-[var(--blue-shade-light)] focus:border-[var(--blue-shade-light)] transition"
          />
        </div>

        {/* Van Filter */}
        <div className="relative w-full md:w-48">
          <select
            value={selectedVan}
            onChange={(e) => setSelectedVan(e.target.value)}
            className="w-full px-4 py-2.5 pr-10 border border-gray-200 rounded-md bg-white text-sm cursor-pointer appearance-none focus:outline-none focus:ring-2 focus:ring-[var(--blue-shade-light)] focus:border-[var(--blue-shade-light)] transition"
          >
            <option value="">Select Van</option>
            <option value="Van 1">Van 1</option>
            <option value="Van 2">Van 2</option>
            <option value="Van 3">Van 3</option>
          </select>
          <FaChevronDown className="absolute right-3 top-3.5 text-gray-400 text-xs pointer-events-none" />
        </div>

        {/* Status Filter */}
        <div className="relative w-full md:w-48">
          <select
            value={selectedStatus}
            onChange={(e) => setSelectedStatus(e.target.value)}
            className="w-full px-4 py-2.5 pr-10 border border-gray-200 rounded-md bg-white text-sm cursor-pointer appearance-none focus:outline-none focus:ring-2 focus:ring-[var(--blue-shade-light)] focus:border-[var(--blue-shade-light)] transition"
          >
            <option value="">Student Status</option>
            <option value="ACCEPTED">Accepted</option>
            <option value="PENDING">Pending</option>
            <option value="REJECTED">Rejected</option>
          </select>
          <FaChevronDown className="absolute right-3 top-3.5 text-gray-400 text-xs pointer-events-none" />
        </div>

        <TablePagination totalPages={5} onPageChange={(p) => setPage(p)} currentPage={page} />
      </div>

      {/* Table Section */}
      <div className="overflow-x-auto">
        <table className="w-full border-collapse rounded-md overflow-hidden">
          <thead>
            <tr style={{ background: 'var(--blue-shade-light)' }} className="text-left text-sm">
              <th className="p-3 font-medium text-white">Driver Name</th>
              <th className="p-3 text-white">Van</th>
              <th className="p-3 text-white">Status</th>
              <th className="p-3 text-white">Action</th>
            </tr>
          </thead>
          <tbody className="text-sm">
            {filteredDrivers.length > 0 ? (
              filteredDrivers.map((d, idx) => (
                <tr
                  key={idx}
                  className="transition-colors"
                  style={{
                    background: idx % 2 === 0 ? 'white' : 'var(--blue-shade-light)/10',
                    color: 'black',
                  }}
                >
                  <td className="p-3 font-medium">{d.name}</td>
                  <td className="p-3">{d.van}</td>
                  <td className="p-3">
                    <span
                      className={`text-xs px-3 py-1 rounded-full border ${
                        statusColors[d.status as keyof typeof statusColors] || 'bg-gray-100 text-gray-600 border-gray-400'
                      }`}
                    >
                      {d.status}
                    </span>
                  </td>
                  <td className="p-3">
                    <div className="flex items-center gap-2">
                      {d.status === 'ACCEPTED' ? (
                        <button
                          className="text-white bg-[var(--blue-shade-dark)] px-3 py-1 rounded-lg hover:bg-[var(--blue-shade-light)] cursor-pointer text-xs font-medium transition-colors"
                          title="Resign"
                        >
                          Resign
                        </button>
                      ) : d.status === 'REJECTED' ? (
                        <button
                          className="text-white bg-[var(--red-shade-dark)] px-3 py-1 rounded-lg hover:bg-red-700 cursor-pointer text-xs font-medium transition-colors"
                          title="Delete"
                        >
                          Delete
                        </button>
                      ) : (
                        <span className="text-xs text-gray-500">N/A</span>
                      )}
                    </div>
                  </td>
                </tr>
              ))
            ) : (
              <tr>
                <td colSpan={4} className="p-4 text-center text-gray-500">
                  No drivers found.
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
}
