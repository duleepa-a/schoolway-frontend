import { FaSearch, FaChevronDown } from 'react-icons/fa';
import TablePagination from '@/app/components/TablePagination';

const driverRequests = [
  {
    name: 'Kavindu Perera',
    van: 'Van 1',
    status: 'Accepted',
    avatar: '/Images/male_pro_pic_placeholder.png',
  },
  {
    name: 'Thilina Jayasekara',
    van: 'Van 2',
    status: 'Pending',
    avatar: '/Images/male_pro_pic_placeholder.png',
  },
];

const statusColors = {
  Accepted: 'bg-green-100 text-green-600 border-green-500',
  Pending: 'bg-yellow-100 text-yellow-600 border-yellow-500',
};

export default function DriverTable() {

  return (
    <div className="">
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
                  <td className="p-3 flex items-center gap-2">
                    <img
                      src={d.avatar}
                      alt={d.name}
                      className="w-8 h-8 rounded-full object-cover"
                    />
                    <span className="text-gray-800 font-medium">{d.name}</span>
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
                  <td className="p-3 flex items-center gap-2">
                    <span className="text-gray-800 font-medium">{d.van}</span>
                  </td>
                  <td className="p-3">
                    <button
                      className="text-white bg-red-500 px-3 py-1 rounded-lg hover:bg-red-700"
                      disabled={d.status !== 'Accepted'}
                    >
                      Resign
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
        </table>
      </div>
    </div>
  );
}
