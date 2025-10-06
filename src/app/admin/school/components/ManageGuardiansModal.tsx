'use client';
import { useState, useEffect } from 'react';
import { X, Plus, Edit, Trash2, User } from 'lucide-react';
import AddGuardianModal from './AddGuardianModal';
import EditGuardianModal from './EditGuardianModal';
import ConfirmationBox from '@/app/dashboardComponents/ConfirmationBox';

interface Guardian {
  id: number;
  firstName: string;
  lastName: string;
  email: string;
  phone: string;
  schoolId: number;
}

interface ManageGuardiansModalProps {
  schoolId: number;
  schoolName: string;
  onClose: () => void;
}

const ManageGuardiansModal = ({ schoolId, schoolName, onClose }: ManageGuardiansModalProps) => {
  const [guardians, setGuardians] = useState<Guardian[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  
  // Modal states
  const [showAddGuardianModal, setShowAddGuardianModal] = useState(false);
  const [showEditGuardianModal, setShowEditGuardianModal] = useState(false);
  const [selectedGuardian, setSelectedGuardian] = useState<Guardian | null>(null);
  
  // Confirmation dialog states
  const [showDeleteConfirmation, setShowDeleteConfirmation] = useState(false);
  const [guardianToDelete, setGuardianToDelete] = useState<Guardian | null>(null);
  const [showSuccessConfirmation, setShowSuccessConfirmation] = useState(false);
  const [showErrorConfirmation, setShowErrorConfirmation] = useState(false);
  const [confirmationMessage, setConfirmationMessage] = useState('');

  // Fetch guardians for the school
  const fetchGuardians = async () => {
    try {
      setIsLoading(true);
      setError(null);
      const response = await fetch(`/api/admin/schools/SchoolGuardians/${schoolId}`);
      
      if (!response.ok) {
        throw new Error(`Error ${response.status}: ${response.statusText}`);
      }
      
      const data = await response.json();
      setGuardians(data);
    } catch (err) {
      console.error('Failed to fetch guardians:', err);
      setError(err instanceof Error ? err.message : 'Failed to load guardians');
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    fetchGuardians();
  }, [schoolId]);

  const handleAddGuardian = () => {
    setShowAddGuardianModal(true);
  };

  const handleEditGuardian = (guardian: Guardian) => {
    setSelectedGuardian(guardian);
    setShowEditGuardianModal(true);
  };

  const handleDeleteGuardian = (guardian: Guardian) => {
    setGuardianToDelete(guardian);
    setShowDeleteConfirmation(true);
  };

  const confirmDeleteGuardian = async () => {
    if (!guardianToDelete) return;
    
    try {
      setIsLoading(true);
      const response = await fetch(`/api/admin/guardian?id=${guardianToDelete.id}`, {
        method: 'DELETE'
      });

      if (!response.ok) {
        const errorText = await response.text();
        throw new Error(`Error ${response.status}: ${errorText || response.statusText}`);
      }

      setGuardians(prev => prev.filter(g => g.id !== guardianToDelete.id));
      setShowDeleteConfirmation(false);
      setGuardianToDelete(null);
      setConfirmationMessage('Guardian deleted successfully!');
      setShowSuccessConfirmation(true);
    } catch (err) {
      console.error('Failed to delete guardian:', err);
      const errorMessage = err instanceof Error ? err.message : 'Unknown error occurred';
      setShowDeleteConfirmation(false);
      setGuardianToDelete(null);
      setConfirmationMessage(`Failed to delete guardian: ${errorMessage}`);
      setShowErrorConfirmation(true);
    } finally {
      setIsLoading(false);
    }
  };

  const handleGuardianSuccess = () => {
    fetchGuardians(); // Refresh the list
    setShowAddGuardianModal(false);
    setShowEditGuardianModal(false);
    setSelectedGuardian(null);
  };

  return (
    <div className="fixed inset-0 bg-black/40 flex items-center justify-center z-50">
      <div className="bg-white rounded-2xl shadow-xl w-full max-w-4xl p-8 relative max-h-[90vh] overflow-y-auto">
        <button
          onClick={onClose}
          className="absolute top-4 right-4 text-gray-500 hover:text-red-600 text-xl cursor-pointer"
        >
          &times;
        </button>
        
        <h2 className="text-2xl font-semibold text-gray-800 mb-6 flex items-center">
          <User className="mr-2 text-blue-500" size={24} />
          Manage Guardians for {schoolName}
        </h2>

        {/* Add Guardian Button */}
        <div className="mb-6">
          <button
            onClick={handleAddGuardian}
            className="bg-blue-500 text-white px-4 py-2 rounded-lg hover:bg-blue-600 transition-colors flex items-center"
          >
            <Plus size={16} className="mr-2" />
            Add Guardian
          </button>
        </div>

        {/* Guardians List */}
        {isLoading ? (
          <div className="text-center py-8">
            <div className="inline-block animate-spin rounded-full h-8 w-8 border-4 border-blue-500 border-t-transparent mb-4"></div>
            <p className="text-gray-600">Loading guardians...</p>
          </div>
        ) : error ? (
          <div className="text-center py-8">
            <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded relative mb-4" role="alert">
              <strong className="font-bold">Error!</strong>
              <span className="block sm:inline"> {error}</span>
            </div>
            <button 
              onClick={fetchGuardians}
              className="bg-blue-500 text-white px-4 py-2 rounded hover:bg-blue-600"
            >
              Try Again
            </button>
          </div>
        ) : guardians.length === 0 ? (
          <div className="text-center py-8">
            <User className="mx-auto text-gray-400 mb-4" size={48} />
            <p className="text-gray-600 mb-4">No guardians found for this school.</p>
            <button
              onClick={handleAddGuardian}
              className="bg-blue-500 text-white px-4 py-2 rounded-lg hover:bg-blue-600 transition-colors"
            >
              Add First Guardian
            </button>
          </div>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full border-collapse">
              <thead>
                <tr className="bg-gray-50">
                  <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Name</th>
                  <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Email</th>
                  <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Phone</th>
                  <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Actions</th>
                </tr>
              </thead>
              <tbody className="bg-white divide-y divide-gray-200">
                {guardians.map((guardian) => (
                  <tr key={guardian.id} className="hover:bg-gray-50">
                    <td className="px-4 py-4 whitespace-nowrap">
                      <div className="text-sm font-medium text-gray-900">
                        {guardian.firstName} {guardian.lastName}
                      </div>
                    </td>
                    <td className="px-4 py-4 whitespace-nowrap">
                      <div className="text-sm text-gray-900">{guardian.email}</div>
                    </td>
                    <td className="px-4 py-4 whitespace-nowrap">
                      <div className="text-sm text-gray-900">{guardian.phone || 'N/A'}</div>
                    </td>
                    <td className="px-4 py-4 whitespace-nowrap text-sm font-medium">
                      <div className="flex space-x-2">
                        <button
                          onClick={() => handleEditGuardian(guardian)}
                          className="text-blue-600 hover:text-blue-900 p-1 rounded"
                          title="Edit Guardian"
                        >
                          <Edit size={16} />
                        </button>
                        <button
                          onClick={() => handleDeleteGuardian(guardian)}
                          className="text-red-600 hover:text-red-900 p-1 rounded"
                          title="Delete Guardian"
                        >
                          <Trash2 size={16} />
                        </button>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}

        {/* Add Guardian Modal */}
        {showAddGuardianModal && (
          <AddGuardianModal
            preselectedSchool={schoolId}
            onClose={() => setShowAddGuardianModal(false)}
            onSuccess={handleGuardianSuccess}
          />
        )}

        {/* Edit Guardian Modal */}
        {showEditGuardianModal && selectedGuardian && (
          <EditGuardianModal
            guardian={selectedGuardian}
            onClose={() => {
              setShowEditGuardianModal(false);
              setSelectedGuardian(null);
            }}
            onSuccess={handleGuardianSuccess}
          />
        )}

        {/* Delete Confirmation Dialog */}
        <ConfirmationBox
          isOpen={showDeleteConfirmation}
          title="Confirm Deletion"
          variant='warning'
          confirmationMessage="Are you sure you want to delete this guardian? This action cannot be undone."
          objectName={guardianToDelete ? `${guardianToDelete.firstName} ${guardianToDelete.lastName}` : ''}
          onConfirm={confirmDeleteGuardian}
          onCancel={() => setShowDeleteConfirmation(false)}
          confirmText="Delete"
          cancelText="Cancel"
        />

        {/* Success Confirmation Dialog */}
        <ConfirmationBox
          isOpen={showSuccessConfirmation}
          variant='success'
          title="Success"
          confirmationMessage={confirmationMessage}
          objectName=""
          onConfirm={() => setShowSuccessConfirmation(false)}
          onCancel={() => setShowSuccessConfirmation(false)}
          confirmText="OK"
          cancelText="Close"
        />

        {/* Error Confirmation Dialog */}
        <ConfirmationBox
          isOpen={showErrorConfirmation}
          title="Error"
          variant='error'
          confirmationMessage={confirmationMessage}
          objectName=""
          onConfirm={() => setShowErrorConfirmation(false)}
          onCancel={() => setShowErrorConfirmation(false)}
          confirmText="OK"
          cancelText="Close"
        />
      </div>
    </div>
  );
};

export default ManageGuardiansModal;