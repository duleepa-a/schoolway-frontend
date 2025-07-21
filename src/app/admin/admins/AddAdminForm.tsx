'use client'
import React from 'react'


const AddAdminForm = () => {
  const [formData, setFormData] = React.useState({
    email: '',
    firstName: '',
    lastName: '',
    contact: ''
  });

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    // TODO: Implement submit logic
    alert('Admin submitted: ' + JSON.stringify(formData));
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-4 max-w-md mx-auto p-4 bg-white rounded shadow">
      <div>
        <label className="block mb-1 font-medium">Email</label>
        <input
          type="email"
          name="email"
          value={formData.email}
          onChange={handleChange}
          required
          className="w-full px-3 py-2 border border-gray-300 rounded"
          placeholder="Enter email"
        />
      </div>
      <div>
        <label className="block mb-1 font-medium">First Name</label>
        <input
          type="text"
          name="firstName"
          value={formData.firstName}
          onChange={handleChange}
          required
          className="w-full px-3 py-2 border border-gray-300 rounded"
          placeholder="Enter first name"
        />
      </div>
      <div>
        <label className="block mb-1 font-medium">Last Name</label>
        <input
          type="text"
          name="lastName"
          value={formData.lastName}
          onChange={handleChange}
          required
          className="w-full px-3 py-2 border border-gray-300 rounded"
          placeholder="Enter last name"
        />
      </div>
      <div>
        <label className="block mb-1 font-medium">Contact</label>
        <input
          type="text"
          name="contact"
          value={formData.contact}
          onChange={handleChange}
          required
          className="w-full px-3 py-2 border border-gray-300 rounded"
          placeholder="Enter contact number"
        />
      </div>
      <button type="submit" className="w-full bg-yellow-400 text-white py-2 rounded hover:bg-yellow-500">Add Admin</button>
    </form>
  );
}

export default AddAdminForm
