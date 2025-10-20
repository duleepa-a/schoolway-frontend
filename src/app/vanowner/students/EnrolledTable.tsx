// components/EnrolledTable.tsx
'use client';
import { useEffect, useState } from 'react';
import { FaChevronDown } from 'react-icons/fa';
import TablePagination from '@/app/components/TablePagination';
import Image from 'next/image';

type StudentRow = {
  id: number;
  name: string;
  grade: number | string;
  status: string; // Accept any status value
  van?: { id: number; name?: string; plateNumber?: string } | null;
  contactParent?: string | null;
  joinedDate: string;
  profilePicture?: string;
};

const statusColors: Record<string, string> = {
  Active: 'text-[var(--green-shade-dark)] border-[var(--green-shade-dark)]',
  Inactive: 'bg-gray-100 text-gray-600 border-gray-400',
  AT_HOME: 'bg-yellow-100 text-yellow-700 border-yellow-400', // Example for extra status
};

export default function EnrolledTable() {
  const [students, setStudents] = useState<StudentRow[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [page, setPage] = useState(1);

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
    
  useEffect(() => {
    fetchStudents();
  }, [page]);

  const handleAction = async (childId: number, action: 'inactive' | 'remove' | 'active') => {
    try {
      const res = await fetch(`/api/vanowner/enrolled-students/${childId}`, {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ action }),
      });

      const data = await res.json();
      if (res.ok) {
        alert(`Child ${action === 'inactive' ? 'set to INACTIVE' : action === 'active' ? 'set to ACTIVE' : 'removed from van'}`);
        fetchStudents();
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

      {loading && <div className="p-4">Loading students...</div>}
      {error && <div className="p-4 text-red-600">Error: {error}</div>}
      {loading || error ? null : 
        <div className="overflow-x-auto">
          <table className="w-full border-collapse rounded-md overflow-hidden">
            <thead>
              <tr style={{background: 'var(--blue-shade-light)'}} className="text-left text-sm">
                <th className="p-3 text-white">Full Name</th>
                <th className="p-3 text-white">Grade</th>
                <th className="p-3 text-white">Status</th>
                <th className="p-3 text-white">Van</th>
                <th className="p-3 text-white">Contact No</th>
                <th className="p-3 text-white">Joined Date</th>
                <th className="p-3 text-white">Actions</th>
              </tr>
            </thead>
            <tbody className="text-sm">
              {students.map((s, idx) => (
                <tr
                  key={s.id}
                  className={`transition-colors ${idx === 0 ? 'bg-white' : ''}`}
                  style={{
                    background: idx === 0 ? 'white' : undefined,
                    color: 'black',
                  }}
                >
                  <td className="p-3 flex items-center gap-2">
                    <div style={{width: 32, height: 32}} className="rounded-full overflow-hidden flex items-center justify-center bg-gray-200">
                      <Image src={s.profilePicture ?? '/Images/male_pro_pic_placeholder.png'} alt={s.name} width={32} height={32} className="object-cover w-full h-full" />
                    </div>
                    <span className="font-medium" style={{color: 'black'}}>{s.name}</span>
                  </td>
                  <td className="p-3" style={{color: 'black'}}>{s.grade}</td>
                  <td className="p-3">
                    <span className={`text-xs px-3 py-1 rounded-full border ${statusColors[s.status] || statusColors.Inactive}`}>{s.status}</span>
                  </td>
                  <td className="p-3" style={{color: 'black'}}>{s.van?.name ?? '—'}</td>
                  <td className="p-3" style={{color: 'black'}}>{s.contactParent ?? '—'}</td>
                  <td className="p-3" style={{color: 'black'}}>{s.joinedDate}</td>
                  <td className="p-3">
                    {s.status === 'Active' ? (
                      <button
                        onClick={() => handleAction(s.id, 'inactive')}
                        className="text-white bg-[var(--blue-shade-dark)] px-3 py-1 rounded-lg hover:bg-[var(--green-shade-dark)] cursor-pointer items-center"
                      >
                        Inactive
                      </button>
                    ) : (
                      <div>
                        <button
                          onClick={() => handleAction(s.id, 'active')}
                          className="text-white bg-[var(--green-shade-dark)] px-5 py-1 rounded-lg hover:bg-[var(--blue-shade-dark)] cursor-pointer items-center"
                        >
                          Active
                        </button>
                        <button
                          onClick={() => handleAction(s.id, 'remove')}
                          className="text-white bg-[var(--red-shade-dark)] ml-1 px-3 py-1 rounded-lg hover:bg-red-700 cursor-pointer items-center"
                        >
                          Remove
                        </button>
                        
                      </div>
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