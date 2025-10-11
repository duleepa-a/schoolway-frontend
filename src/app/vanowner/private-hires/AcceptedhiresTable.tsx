import { FaChevronDown } from 'react-icons/fa';
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
    <div className="bg-white rounded-2xl shadow-card p-6">
      <div className="flex flex-row items-center justify-between mb-4 gap-4">
        <div className="relative w-full md:w-48">
          <select
            className="w-full px-4 py-3 rounded-md text-sm cursor-pointer appearance-none focus:outline-none bg-white border border-gray-300"
            defaultValue="Van 1"
            style={{ color: 'var(--blue-shade-dark)', fontWeight: 500 }}
            onChange={e => console.log('Selected van:', e.target.value)}
          >
            <option disabled>Select Van</option>
            <option>All</option>
            <option>Van 1</option>
            <option>Van 2</option>
          </select>
          <FaChevronDown className="ml-2 absolute top-3.5 left-40 cursor-pointer" style={{ color: 'var(--blue-shade-dark)' }} />
        </div>
        <TablePagination totalPages={5} currentPage={1} onPageChange={(page) => console.log('Page changed to:', page)} />
      </div>
      <div className="overflow-x-auto">
        <table className="w-full text-sm rounded-2xl overflow-hidden">
          <thead>
            <tr style={{ background: 'var(--blue-shade-dark)', color: 'white', borderTopLeftRadius: '1rem', borderTopRightRadius: '1rem' }}>
              <th className="px-4 py-3 text-left font-semibold">Customer</th>
              <th className="px-4 py-3 text-left font-semibold">Van</th>
              <th className="px-4 py-3 text-left font-semibold">Driver</th>
              <th className="px-4 py-3 text-left font-semibold">Seats</th>
              <th className="px-4 py-3 text-left font-semibold">Pickup</th>
              <th className="px-4 py-3 text-left font-semibold">Pickup Date</th>
              <th className="px-4 py-3 text-left font-semibold">Drop-off</th>
              <th className="px-4 py-3 text-left font-semibold">Drop of Date</th>
              <th className="px-4 py-3 text-left font-semibold">Fare</th>
            </tr>
          </thead>
          <tbody className="text-sm">
            {privateHires.map((hire, index) => (
              <tr
                key={index}
                className={`transition-colors bg-white hover:bg-[var(--blue-shade-light)]/40`}
              >
                <td className="px-4 py-3 font-semibold" style={{ color: 'var(--color-textblack)' }}>{hire.name}</td>
                <td className="px-4 py-3" style={{ color: 'var(--color-textblack)' }}>{hire.vanNumber}</td>
                <td className="px-4 py-3" style={{ color: 'var(--color-textblack)' }}>{hire.driver}</td>
                <td className="px-4 py-3" style={{ color: 'var(--color-textblack)' }}>{hire.seats}</td>
                <td className="px-4 py-3" style={{ color: 'var(--color-textblack)' }}>{hire.pickupLocation}</td>
                <td className="px-4 py-3" style={{ color: 'var(--color-textblack)' }}>{hire.pickupDate}</td>
                <td className="px-4 py-3" style={{ color: 'var(--color-textblack)' }}>{hire.dropoffLocation}</td>
                <td className="px-4 py-3" style={{ color: 'var(--color-textblack)' }}>{hire.dropoffDate}</td>
                <td className="px-4 py-3 font-semibold" style={{ color: 'var(--green-shade-light)' }}>{hire.amount}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}
