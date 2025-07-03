import { FaSearch } from 'react-icons/fa';

const privateHires = [
  {
    name: 'Duleepa Edirisinghe',
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

export default function PrivatehireTable() {
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
      </div>

      {/* Table */}
      <div className="overflow-x-auto">
        <table className="w-full border-collapse rounded-md overflow-hidden">
          <thead>
            <tr className="bg-primary text-white text-left text-sm">
              <th className="p-3">Customer</th>
              <th className="p-3">Van</th>
              <th className="p-3">Seats</th>
              <th className="p-3">Pickup</th>
              <th className="p-3">Pickup Date</th>
              <th className="p-3">Drop-off</th>
              <th className="p-3">Drop of Date</th>
              <th className="p-3">Estimated Fare</th>
              <th className="p-3">Actions</th>
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
                <td className="p-3 text-gray-700">{hire.seats}</td>
                <td className="p-3 text-gray-700">{hire.pickupLocation}</td>
                <td className="p-3 text-gray-700">{hire.pickupDate}</td>
                <td className="p-3 text-gray-700">{hire.dropoffLocation}</td>
                <td className="p-3 text-gray-700">{hire.dropoffDate}</td>
                <td className="p-3 text-gray-700">{hire.amount}</td>
                <td className="p-3 flex gap-1 justify-center align-middle">
                  <button className="text-xs bg-green-300 text-white rounded-lg px-3 py-3 hover:bg-green-200 transition cursor-pointer">
                    Accept
                  </button>
                  <button className="text-xs bg-red-400 text-white rounded-lg px-3 py-3 hover:bg-red-200 transition cursor-pointer">
                    Reject
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
