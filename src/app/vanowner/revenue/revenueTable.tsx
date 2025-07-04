import TablePagination from '@/app/components/TablePagination';
import { FaSearch } from 'react-icons/fa';

const payrolls = [
  {
    name: 'Duleepa Edirisinghe',
    vanNumber: 'Van 1',
    amountPaid: 'Rs. 45,000',
    datePaid: 'June 15, 2025',
    status: 'Paid',
    avatar: '/Images/male_pro_pic_placeholder.png',
  },
  {
    name: 'Duleepa Edirisinghe',
    vanNumber: 'Van 2',
    amountPaid: 'Rs. 40,000',
    datePaid: 'June 10, 2025',
    status: 'Paid',
    avatar: '/Images/male_pro_pic_placeholder.png',
  },
  {
    name: 'Duleepa Edirisinghe',
    vanNumber: 'Van 3',
    amountPaid: 'Rs. 38,000',
    datePaid: 'June 5, 2025',
    status: 'Paid',
    avatar: '/Images/male_pro_pic_placeholder.png',
  },
];

export default function RevenueTable() {
  return (
    <div className="">
      <div className="flex flex-col md:flex-row md:items-center md:justify-between mb-4 gap-4">
        <div className="relative w-full md:w-1/3">
          <FaSearch className="absolute left-3 top-3 text-gray-400" />
          <input
            type="text"
            placeholder="Search payroll.."
            className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-md bg-search-bar-bg"
          />
        </div>
        <TablePagination totalPages={5}/>
      </div>

      {/* Table */}
      <div className="overflow-x-auto">
        <table className="w-full border-collapse rounded-md overflow-hidden">
          <thead>
            <tr className="bg-primary text-white text-left text-sm">
              <th className="p-3">Owner Name</th>
              <th className="p-3">Van Number</th>
              <th className="p-3">Amount Paid</th>
              <th className="p-3">Date Paid</th>
              <th className="p-3">Status</th>
            </tr>
          </thead>
          <tbody className="text-sm">
            {payrolls.map((p, index) => (
              <tr
                key={index}
                className={`${
                  index % 2 === 0 ? 'bg-white' : 'bg-gray-50'
                } border-b border-border-light-shade`}
              >
                <td className="p-3 flex items-center gap-2">
                  <img
                    src={p.avatar}
                    alt={p.name}
                    className="w-8 h-8 rounded-full object-cover"
                  />
                  <span className="text-gray-800 font-medium">{p.name}</span>
                </td>
                <td className="p-3 text-gray-700">{p.vanNumber}</td>
                <td className="p-3 text-gray-700">{p.amountPaid}</td>
                <td className="p-3 text-gray-500">{p.datePaid}</td>
                <td className="p-3">
                  <span className="text-xs px-3 py-1 rounded-full border bg-green-100 text-green-600 border-green-500">
                    {p.status}
                  </span>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}
