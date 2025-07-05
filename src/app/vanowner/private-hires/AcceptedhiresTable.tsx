import { FaSearch, FaChevronDown } from 'react-icons/fa';
import TablePagination from '@/app/components/TablePagination';

const privateHires = [
  {
    name: 'Duleepa Edirisinghe',
    driver: 'Nimsara Wickramathanthree',
    vanNumber: 'Van 1',
    seats:2,
    amount: 'Rs. 12,000',
    pickupDate: 'July 10, 2025',
    dropoffDate: 'July 10, 2025',
    pickupLocation: 'Colombo 07',
    dropoffLocation: 'Kandy',
    avatar: '/Images/male_pro_pic_placeholder.png',
  },
  {
    name: 'Tharindu Perera',
    driver: 'Nimsara Wickramathanthree',
    vanNumber: 'Van 2',
    seats:2,
    amount: 'Rs. 15,000',
    pickupDate: 'July 12, 2025',
    dropoffDate: 'July 12, 2025',
    pickupLocation: 'Galle',
    dropoffLocation: 'Matara',
    avatar: '/Images/male_pro_pic_placeholder.png',
  },
  {
    name: 'Nimasha Fernando',
    driver: 'Nimsara Wickramathanthree',
    vanNumber: 'Van 3',
    seats:2,
    amount: 'Rs. 10,500',
    pickupDate: 'July 13, 2025',
    dropoffDate: 'July 13, 2025',
    pickupLocation: 'Nugegoda',
    dropoffLocation: 'Negombo',
    avatar: '/Images/female_pro_pic_placeholder.png',
  },
];

export default function AcceptedhiresTable() {
  return (
    <div>
      {/* Search Bar */}
      <div className="flex flex-col md:flex-row md:items-center md:justify-between mb-4 gap-4">
        <div className="relative w-full md:w-1/3">
          <FaSearch className="absolute left-3 top-3 text-gray-400" />
          <input
            type="text"
            placeholder="Search private hires..."
            className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-md bg-search-bar-bg"
          />
        </div>
        <div className="relative w-full md:w-48">
          <select
            className="w-full px-4 py-3 bg-search-bar-bg rounded-md text-sm cursor-pointer appearance-none"
            defaultValue="Van 1"
          >
            <option disabled>Select Van</option>
            <option>All</option>
            <option>Van 1</option>
            <option>Van 2</option>
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
              <th className="p-3">Customer</th>
              <th className="p-3">Van</th>
              <th className="p-3">Driver</th>
              <th className="p-3">Seats</th>
              <th className="p-3">Pickup</th>
              <th className="p-3">Pickup Date</th>
              <th className="p-3">Drop-off</th>
              <th className="p-3">Drop of Date</th>
              <th className="p-3">Fare</th>
            </tr>
          </thead>
          <tbody className="text-sm">
            {privateHires.map((hire, index) => (
              <tr
                key={index}
                className={`${
                  index % 2 === 0 ? 'bg-white' : 'bg-gray-50'
                } border-b border-border-light-shade`}
              >
                <td className="p-3 flex items-center gap-2">
                  <span className="text-gray-700">{hire.name}</span>
                </td>
                <td className="p-3 text-gray-700">{hire.vanNumber}</td>
                <td className="p-3 text-gray-700">{hire.driver}</td>
                <td className="p-3 text-gray-700">{hire.seats}</td>
                <td className="p-3 text-gray-700">{hire.pickupLocation}</td>
                <td className="p-3 text-gray-700">{hire.pickupDate}</td>
                <td className="p-3 text-gray-700">{hire.dropoffLocation}</td>
                <td className="p-3 text-gray-700">{hire.dropoffDate}</td>
                <td className="p-3 text-gray-700">{hire.amount}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}
