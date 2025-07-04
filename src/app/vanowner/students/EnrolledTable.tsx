import { FaSearch, FaChevronDown } from 'react-icons/fa';
import TablePagination from '@/app/components/TablePagination';

const students = [
  {
    name: 'Duleepa Edirisinghe',
    grade: '5',
    status: 'Active',
    van: 'Van 1',
    contactNo: '0783152739',
    date: 'March 12, 2023',
    avatar: '/Images/male_pro_pic_placeholder.png',
  },
  {
    name: 'Nimsara Wickramathanthree',
    grade: '5',
    status: 'Inactive',
    van: 'Van 2',
    contactNo: '0783152739',
    date: 'June 27, 2022',
    avatar: '/Images/male_pro_pic_placeholder.png',
  },
  {
    name: 'Lehan Munasinghe',
    grade: '5',
    status: 'Inactive',
    van: 'Van 2',
    contactNo: '0783152739',
    date: 'January 8, 2024',
    avatar: '/Images/male_pro_pic_placeholder.png',
  },
  {
    name: 'Ayanaga Wethmini',
    grade: '5',
    status: 'Active',
    van: 'Van 3',
    contactNo: '0783152739',
    date: 'October 5, 2021',
    avatar: '/Images/male_pro_pic_placeholder.png',
  },
];

const statusColors = {
  Active: 'bg-green-100 text-green-600 border-green-500',
  Inactive: 'bg-gray-100 text-gray-600 border-gray-400',
};

export default function EnrolledTable() {

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
            <option>Active</option>
            <option>Inactive</option>
          </select>
          <FaChevronDown className="ml-2 absolute top-3.5 left-40 cursor-pointer" />
        </div>

        <TablePagination totalPages={5} />

      </div>

      {/* Table */}
      <div className="overflow-x-auto">
        <table className="w-full border-collapse rounded-md overflow-hidden">
          <thead>
            <tr className="bg-primary text-white text-left text-sm">
              <th className="p-3 font-medium">
                <input type="checkbox" />
              </th>
              <th className="p-3">Full Name</th>
              <th className="p-3">Grade</th>
              <th className="p-3">Status</th>
              <th className="p-3">Van</th>
              <th className="p-3">Contact No</th>
              <th className="p-3">Joined Date</th>
              <th className="p-3">Actions</th>
            </tr>
          </thead>
          <tbody className="text-sm">
            {students.map((s, index) => (
              <tr
                key={index}
                className={`${
                  index % 2 === 0 ? 'bg-white' : 'bg-gray-50'
                } border-b border-border-light-shade`}
              >
                <td className="p-3">
                  <input type="checkbox" />
                </td>
                <td className="p-3 flex items-center gap-2">
                  <img
                    src={s.avatar}
                    alt={s.name}
                    className="w-8 h-8 rounded-full object-cover"
                  />
                  <span className="text-gray-800 font-medium">{s.name}</span>
                </td>
                <td className="p-3 text-gray-600">{s.grade}</td>
                <td className="p-3">
                  <span
                    className={`text-xs px-3 py-1 rounded-full border ${
                      // @ts-ignore
                      statusColors[s.status] || 'bg-gray-100 text-gray-600 border-gray-400'
                    }`}
                  >
                    {s.status}
                  </span>
                </td>
                <td className="p-3 text-gray-700">{s.van}</td>
                <td className="p-3 text-gray-700">{s.contactNo}</td>
                <td className="p-3 text-gray-500">{s.date}</td>
                <td className="p-3">
                  {s.status === 'Active' ?
                  <button className="text-white bg-black px-3 py-1 rounded-lg hover:bg-red-700 cursor-pointer items-center">
                      Inactive
                  </button>
                  :
                  <button className="text-white bg-red-500 px-3 py-1 rounded-lg  hover:bg-red-700 cursor-pointer items-center">
                      Remove
                  </button>
                  }
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}
