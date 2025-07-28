'use client'
import React from 'react'
import ConfirmationBox from '@/app/dashboardComponents/ConfirmationBox'
import CustomTable from '@/app/dashboardComponents/CustomTable'


const AddAdminForm = () => {
  const [formData, setFormData] = React.useState({
    email: '',
    firstName: '',
    lastName: '',
    contact: ''
  });
  const [admins, setAdmins] = React.useState<Array<{
    email: string;
    firstname?: string;
    lastname?: string;
  }>>([]);
  const [loading, setLoading] = React.useState(false);
  // Removed unused error/success state
  const [confirmOpen, setConfirmOpen] = React.useState(false);
  const [dialogVariant, setDialogVariant] = React.useState<'warning'|'success'|'error'>('warning');
  const [dialogMessage, setDialogMessage] = React.useState('');

  // Fetch admins from backend
  React.useEffect(() => {
    const fetchAdmins = async () => {
      try {
        const res = await fetch('/api/admin/admins');
        if (!res.ok) return;
        const data = await res.json();
        setAdmins(Array.isArray(data) ? data : [data]);
      } catch {
        // ignore
      }
    };
    fetchAdmins();
  }, []);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setDialogVariant('warning');
    setDialogMessage('Do you want to add this admin?');
    setConfirmOpen(true);
  };

  const handleConfirm = async () => {
    setConfirmOpen(false);
    setLoading(true);
    const payload = {
      email: formData.email,
      firstname: formData.firstName,
      lastname: formData.lastName,
      contact: formData.contact,
      password: 'admin',
    };
    try {
      const res = await fetch('/api/admin/admins', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(payload),
      });
      const data = await res.json();
      if (!res.ok) {
        setDialogVariant('error');
        setDialogMessage(data.error || 'Failed to add admin');
        setConfirmOpen(true);
      } else {
        setDialogVariant('success');
        setDialogMessage('Admin added successfully');
        setAdmins(prev => [...prev, data]);
        setFormData({ email: '', firstName: '', lastName: '', contact: '' });
        setConfirmOpen(true);
      }
    } catch {
      setDialogVariant('error');
      setDialogMessage('Network error');
      setConfirmOpen(true);
    } finally {
      setLoading(false);
    }
  };

  const handleCancel = () => {
    setConfirmOpen(false);
  };

  // Delete handler (mock, remove from local state)
  const handleDelete = (row: { email: string }) => {
    setAdmins(prev => prev.filter(a => a.email !== row.email));
    // TODO: Add backend delete logic if needed
  };

  return (
    <>
      <div className="min-h-screen py-10 px-4 flex gap-5">
        <div className="w-full max-w-lg bg-white rounded-lg shadow-lg p-8 mb-10">
          <h2 className="text-2xl font-bold mb-6 text-gray-800 text-center">Add New Admin</h2>
          <form onSubmit={handleSubmit} className="space-y-5">
            <div>
              <label className="block mb-1 font-semibold text-gray-700">Email</label>
              <input
                type="email"
                name="email"
                value={formData.email}
                onChange={handleChange}
                required
                className="w-full px-4 py-2 border border-gray-300 rounded focus:outline-none focus:ring-2 focus:ring-yellow-400"
                placeholder="Enter email"
              />
            </div>
            <div>
              <label className="block mb-1 font-semibold text-gray-700">First Name</label>
              <input
                type="text"
                name="firstName"
                value={formData.firstName}
                onChange={handleChange}
                required
                className="w-full px-4 py-2 border border-gray-300 rounded focus:outline-none focus:ring-2 focus:ring-yellow-400"
                placeholder="Enter first name"
              />
            </div>
            <div>
              <label className="block mb-1 font-semibold text-gray-700">Last Name</label>
              <input
                type="text"
                name="lastName"
                value={formData.lastName}
                onChange={handleChange}
                required
                className="w-full px-4 py-2 border border-gray-300 rounded focus:outline-none focus:ring-2 focus:ring-yellow-400"
                placeholder="Enter last name"
              />
            </div>
            <div>
              <label className="block mb-1 font-semibold text-gray-700">Contact</label>
              <input
                type="text"
                name="contact"
                value={formData.contact}
                onChange={handleChange}
                required
                className="w-full px-4 py-2 border border-gray-300 rounded focus:outline-none focus:ring-2 focus:ring-yellow-400"
                placeholder="Enter contact number"
              />
            </div>
            <button type="submit" className="w-full bg-yellow-400 text-white py-2 rounded font-semibold hover:bg-yellow-500 transition" disabled={loading}>{loading ? 'Adding...' : 'Add Admin'}</button>
          </form>
        </div>
        <div className="w-full max-w-2xl bg-white rounded-lg shadow p-6">
          <h2 className="text-xl font-bold mb-4 text-gray-800">All Admins</h2>
          <CustomTable
            columns={[
              { key: 'email', label: 'Email' },
              { key: 'fullName', label: 'Name' },
            ]}
            data={admins.map(a => ({
              ...a,
              fullName: `${a.firstname ?? ''} ${a.lastname ?? ''}`.trim(),
            }))}
            actions={[
              {
                type: 'delete',
                label: 'Delete',
                onClick: (row) => handleDelete(row),
                className: 'delete-icon',
              },
            ]}
            renderCell={(column, value, row) => {
              if (column === 'fullName') return <span>{value}</span>;
              return value;
            }}
          />
        </div>

      </div>
      <ConfirmationBox
        isOpen={confirmOpen}
        variant={dialogVariant}
        title={dialogVariant === 'warning' ? 'Confirm Add Admin' : dialogVariant === 'success' ? 'Success' : 'Error'}
        message={dialogVariant === 'error' || dialogVariant === 'success' ? dialogMessage : ''}
        confirmationMessage={dialogVariant === 'warning' ? dialogMessage : ''}
        objectName={formData.email || ''}
        onConfirm={dialogVariant === 'warning' ? handleConfirm : handleCancel}
        onCancel={handleCancel}
        confirmText={dialogVariant === 'warning' ? 'Add Admin' : 'Close'}
        cancelText={dialogVariant === 'warning' ? 'Cancel' : 'Close'}
      />
    </>
  );
}

export default AddAdminForm
