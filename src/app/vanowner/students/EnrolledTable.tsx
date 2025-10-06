// components/EnrolledTable.tsx
'use client';
import { useEffect, useState } from 'react';
import { FaSearch, FaChevronDown } from 'react-icons/fa';
import TablePagination from '@/app/components/TablePagination';
import Image from 'next/image';

type StudentRow = {
  id: number;
  name: string;
  grade: number | string;
  status: 'Active' | 'Inactive';
  van?: { id: number; name?: string; plateNumber?: string } | null;
  contactParent?: string | null;
  joinedDate: string;
  profilePicture?: string;
};

const statusColors: Record<string, string> = {
  Active: 'bg-green-100 text-green-600 border-green-500',
  Inactive: 'bg-gray-100 text-gray-600 border-gray-400',
};

export default function EnrolledTable() {
  const [students, setStudents] = useState<StudentRow[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [page, setPage] = useState(1);

  useEffect(() => {
    const fetchStudents = async () => {
      setLoading(true);
      setError(null);
      try {
        const res = await fetch('/api/vanowner/enrolled-students');
        if (!res.ok) {
          const b = await res.json().catch(() => ({}));
          throw new Error(b?.error || 'Failed to fetch students');
        }
        const data: StudentRow[] = await res.json();
        setStudents(data.map(s => ({ ...s, joinedDate: new Date(s.joinedDate).toLocaleDateString('en-US', { year: 'numeric', month: 'long', day: 'numeric' }) })));
      } catch (err: any) {
        console.error(err);
        setError(err.message || 'Something went wrong');
      } finally {
        setLoading(false);
      }
    };

    fetchStudents();
  }, [page]);

  const handleAction = async (childId: number, action: 'inactive' | 'remove') => {
    try {
      const res = await fetch(`api/vanowner/enrolled-students/${childId}`, {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ action }),
      });

      const data = await res.json();
      if (res.ok) {
        alert(`Child ${action === 'inactive' ? 'set to INACTIVE' : 'removed from van'}`);
        // optionally refresh list or update UI state
      } else {
        alert(data.error || 'Failed to update child');
      }
    } catch (err) {
      console.error(err);
      alert('Something went wrong');
    }
  };

  return (
    <div className="">
      <div className="flex flex-col md:flex-row md:items-center md:justify-between lg:justify-start  mb-4 gap-4">
        <div className="relative w-full md:w-1/3">
          <FaSearch className="absolute left-3 top-3 text-gray-400" />
          <input
            type="text"
            placeholder="Search students"
            className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-md bg-search-bar-bg"
          />
        </div>

        <div className="relative w-full md:w-48">
          <select className="w-full px-4 py-3 bg-search-bar-bg rounded-md text-sm cursor-pointer appearance-none" defaultValue="Van 1">
            <option disabled>Select Van</option>
            <option>Van 1</option>
          </select>
          <FaChevronDown className="ml-2 absolute top-3.5 left-40 cursor-pointer" />
        </div>

        <div className="relative w-full md:w-48">
          <select className="w-full px-4 py-3 bg-search-bar-bg rounded-md text-sm cursor-pointer appearance-none" defaultValue="Van 1">
            <option disabled>Student Status</option>
            <option>All</option>
            <option>Active</option>
            <option>Inactive</option>
          </select>
          <FaChevronDown className="ml-2 absolute top-3.5 left-40 cursor-pointer" />
        </div>

        <TablePagination totalPages={5} onPageChange={(p) => setPage(p)} currentPage={page} />
      </div>

      {loading && <div className="p-4">Loading students...</div>}
      {error && <div className="p-4 text-red-600">Error: {error}</div>}
      {loading || error ? null : 
        <div className="overflow-x-auto">
          <table className="w-full border-collapse rounded-md overflow-hidden">
            <thead>
              <tr className="bg-primary text-white text-left text-sm">
                <th className="p-3 font-medium"><input type="checkbox" /></th>
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
              {students.map((s, idx) => (
                <tr key={s.id} className={`${idx % 2 === 0 ? 'bg-white' : 'bg-gray-50'} border-b border-border-light-shade`}>
                  <td className="p-3"><input type="checkbox" /></td>
                  <td className="p-3 flex items-center gap-2">
                    <Image src={s.profilePicture ?? '/Images/male_pro_pic_placeholder.png'} alt={s.name} width={32} height={32} className="rounded-full object-cover" />
                    <span className="text-gray-800 font-medium">{s.name}</span>
                  </td>
                  <td className="p-3 text-gray-600">{s.grade}</td>
                  <td className="p-3">
                    <span className={`text-xs px-3 py-1 rounded-full border ${statusColors[s.status] || statusColors.Inactive}`}>{s.status}</span>
                  </td>
                  <td className="p-3 text-gray-700">{s.van?.name ?? '—'}</td>
                  <td className="p-3 text-gray-700">{s.contactParent ?? '—'}</td>
                  <td className="p-3 text-gray-500">{s.joinedDate}</td>
                  <td className="p-3">
                    {s.status === 'Active' ? (
                      <button
                        onClick={() => handleAction(s.id, 'inactive')}
                        className="text-white bg-black px-3 py-1 rounded-lg hover:bg-red-700 cursor-pointer items-center"
                      >
                        Inactive
                      </button>
                    ) : (
                      <button
                        onClick={() => handleAction(s.id, 'remove')}
                        className="text-white bg-red-500 px-3 py-1 rounded-lg hover:bg-red-700 cursor-pointer items-center"
                      >
                        Remove
                      </button>
                    )}
                  </td>
                </tr>
              ))}
              {students.length === 0 && !loading && <tr><td colSpan={8} className="p-4 text-center text-gray-500">No enrolled students found.</td></tr>}
            </tbody>
          </table>
        </div>
    }
    </div>
  );
}
