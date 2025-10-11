"use client";
import TablePagination from '@/app/components/TablePagination';
import { FaSearch } from 'react-icons/fa';

const payrolls = [
  {
    makeAndModel: 'Toyota Hiace',
    vanNumber: 'Van 1',
    amountPaid: 'Rs. 45,000',
    datePaid: 'June 15, 2025',
    status: 'Recieved',
    avatar: '/Images/male_pro_pic_placeholder.png',
  },
  {
    makeAndModel: 'Toyota Hiace',
    vanNumber: 'Van 2',
    amountPaid: 'Rs. 40,000',
    datePaid: 'June 10, 2025',
    status: 'Recieved',
    avatar: '/Images/male_pro_pic_placeholder.png',
  },
  {
    makeAndModel: 'Toyota Hiace',
    vanNumber: 'Van 3',
    amountPaid: 'Rs. 38,000',
    datePaid: 'June 5, 2025',
    status: 'Recieved',
    avatar: '/Images/male_pro_pic_placeholder.png',
  },
   {
    makeAndModel: 'Toyota Hiace',
    vanNumber: 'Van 1',
    amountPaid: 'Rs. 45,000',
    datePaid: 'June 15, 2025',
    status: 'Recieved',
    avatar: '/Images/male_pro_pic_placeholder.png',
  },
  {
    makeAndModel: 'Toyota Hiace',
    vanNumber: 'Van 2',
    amountPaid: 'Rs. 40,000',
    datePaid: 'June 10, 2025',
    status: 'Recieved',
    avatar: '/Images/male_pro_pic_placeholder.png',
  },
  {
    makeAndModel: 'Toyota Hiace',
    vanNumber: 'Van 3',
    amountPaid: 'Rs. 38,000',
    datePaid: 'June 5, 2025',
    status: 'Recieved',
    avatar: '/Images/male_pro_pic_placeholder.png',
  },
   {
    makeAndModel: 'Toyota Hiace',
    vanNumber: 'Van 1',
    amountPaid: 'Rs. 45,000',
    datePaid: 'June 15, 2025',
    status: 'Recieved',
    avatar: '/Images/male_pro_pic_placeholder.png',
  },
  {
    makeAndModel: 'Toyota Hiace',
    vanNumber: 'Van 2',
    amountPaid: 'Rs. 40,000',
    datePaid: 'June 10, 2025',
    status: 'Recieved',
    avatar: '/Images/male_pro_pic_placeholder.png',
  },
  {
    makeAndModel: 'Toyota Hiace',
    vanNumber: 'Van 3',
    amountPaid: 'Rs. 38,000',
    datePaid: 'June 5, 2025',
    status: 'Recieved',
    avatar: '/Images/male_pro_pic_placeholder.png',
  },
   {
    makeAndModel: 'Toyota Hiace',
    vanNumber: 'Van 1',
    amountPaid: 'Rs. 45,000',
    datePaid: 'June 15, 2025',
    status: 'Recieved',
    avatar: '/Images/male_pro_pic_placeholder.png',
  },
];

export default function RevenueTable() {
  return (
    <div className="bg-white rounded-2xl shadow-card p-8">
      <div className="flex flex-row items-center justify-end mb-4 gap-4">
        <TablePagination totalPages={5} currentPage={1} onPageChange={(page) => console.log('Page changed to:', page)} />
      </div>
      {/* Table */}
      <div className="overflow-x-auto">
        <table className="w-full text-sm rounded-2xl overflow-hidden">
          <thead>
            <tr style={{ background: 'var(--blue-shade-dark)', color: 'white', borderTopLeftRadius: '1rem', borderTopRightRadius: '1rem' }}>
              <th className="px-4 py-3 text-left font-semibold">Van ID Number</th>
              <th className="px-4 py-3 text-left font-semibold">Make and Model</th>
              <th className="px-4 py-3 text-left font-semibold">Amount Received</th>
              <th className="px-4 py-3 text-left font-semibold">Date Received</th>
            </tr>
          </thead>
          <tbody className="text-sm">
            {payrolls.map((p, index) => (
              <tr
                key={index}
                className={`transition-colors bg-white hover:bg-[var(--blue-shade-light)]/40`}
              >
                <td className="px-4 py-3 font-semibold" style={{ color: 'var(--color-textblack)' }}>{p.vanNumber}</td>
                <td className="px-4 py-3" style={{ color: 'var(--color-textblack)' }}>
                  <span className="font-medium">{p.makeAndModel}</span>
                </td>
                <td className="px-4 py-3 font-semibold" style={{ color: 'var(--green-shade-light)' }}>{p.amountPaid}</td>
                <td className="px-4 py-3" style={{ color: 'var(--color-textblack)' }}>{p.datePaid}</td>
                {/* Status column removed */}
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}
