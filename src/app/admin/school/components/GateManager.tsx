import React, { useState, useEffect } from 'react';
import { Plus, Trash2, Edit, MapPin, Save, X, School } from 'lucide-react';
import MapLocationPicker from './MapLocationPicker';
import ConfirmationBox from '@/app/dashboardComponents/ConfirmationBox';

// Define interfaces to match your pattern
interface Location {
    lat: number;
    lng: number;
}

interface Gate {
    id?: number;
    gateName: string;
    location: Location;
    description?: string;
    isActive: boolean;
    placeName?: string;
    address?: string;
}

interface GateManagerProps {
    schoolId: number | null;
    onGatesUpdate?: (gates: Gate[]) => void;
}

interface LocationData {
    lat: number;
    lng: number;
    placeName?: string;
    address?: string;
}

const GateManager: React.FC<GateManagerProps> = ({ schoolId, onGatesUpdate }) => {
    const [gates, setGates] = useState<Gate[]>([]);
    const [isAddingGate, setIsAddingGate] = useState<boolean>(false);
    const [editingGate, setEditingGate] = useState<Gate | null>(null);
    const [isLoading, setIsLoading] = useState<boolean>(false);
    const [error, setError] = useState<string | null>(null);
    
    // Confirmation dialog states
    const [showDeleteConfirmation, setShowDeleteConfirmation] = useState(false);
    const [gateToDelete, setGateToDelete] = useState<number | null>(null);
    const [showSuccessConfirmation, setShowSuccessConfirmation] = useState(false);
    const [showErrorConfirmation, setShowErrorConfirmation] = useState(false);
    const [confirmationMessage, setConfirmationMessage] = useState('');

    const [newGate, setNewGate] = useState<Gate>({
        gateName: '',
        location: { lat: 7.8731, lng: 80.7718 }, // Default to Colombo, Sri Lanka
        description: '',
        isActive: true,
        placeName: '',
        address: ''
    });

    // Fetch gates when schoolId changes
    useEffect(() => {
        if (schoolId) {
            fetchGates();
        } else {
            setGates([]);
        }
    }, [schoolId]);

    const fetchGates = async (): Promise<void> => {
        if (!schoolId) return;

        setIsLoading(true);
        setError(null);

        try {
            const response = await fetch(`/api/admin/schools/gates?schoolId=${schoolId}`);
            if (response.ok) {
                const data = await response.json();
                // Transform the data if it comes with separate lat/lng fields
                const transformedGates: Gate[] = (data.gates || []).map((gate: any) => ({
                    ...gate,
                    location: gate.location || { lat: gate.latitude || 0, lng: gate.longitude || 0 }
                }));
                setGates(transformedGates);
                if (onGatesUpdate) {
                    onGatesUpdate(transformedGates);
                }
            } else {
                throw new Error('Failed to fetch gates');
            }
        } catch (error) {
            console.error('Error fetching gates:', error);
            setError('Failed to load gates. Please try again.');
        } finally {
            setIsLoading(false);
        }
    };

    const handleAddGate = async (): Promise<void> => {
        if (!schoolId || !newGate.gateName.trim()) {
            setError('Please enter a gate name');
            return;
        }

        setIsLoading(true);
        setError(null);

        try {
            // Prepare data with location object
            const gateData = {
                schoolId,
                gateName: newGate.gateName,
                location: newGate.location,
                description: newGate.description,
                isActive: newGate.isActive,
                placeName: newGate.placeName,
                address: newGate.address
            };

            const response = await fetch('/api/admin/schools/gates', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify(gateData)
            });

            if (response.ok) {
                const data = await response.json();
                const newGateData: Gate = {
                    ...data.gate,
                    location: data.gate.location || { lat: data.gate.latitude || 0, lng: data.gate.longitude || 0 }
                };
                const updatedGates = [...gates, newGateData];
                setGates(updatedGates);

                // Reset form
                setNewGate({
                    gateName: '',
                    location: { lat: 7.8731, lng: 80.7718 },
                    description: '',
                    isActive: true,
                    placeName: '',
                    address: ''
                });
                setIsAddingGate(false);

                if (onGatesUpdate) {
                    onGatesUpdate(updatedGates);
                }
                
                setConfirmationMessage('Gate added successfully!');
                setShowSuccessConfirmation(true);
            } else {
                const errorData = await response.json();
                throw new Error(errorData.error || 'Failed to add gate');
            }
        } catch (error) {
            console.error('Error adding gate:', error);
            setError(error instanceof Error ? error.message : 'Failed to add gate');
            setConfirmationMessage(`Failed to add gate: ${error instanceof Error ? error.message : 'Unknown error'}`);
            setShowErrorConfirmation(true);
        } finally {
            setIsLoading(false);
        }
    };

    const handleEditGate = async (): Promise<void> => {
        if (!editingGate || !editingGate.id) return;

        setIsLoading(true);
        setError(null);

        try {
            const response = await fetch('/api/admin/schools/gates', {
                method: 'PUT',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify(editingGate)
            });

            if (response.ok) {
                const data = await response.json();
                const updatedGateData: Gate = {
                    ...data.gate,
                    location: data.gate.location || { lat: data.gate.latitude || 0, lng: data.gate.longitude || 0 }
                };
                const updatedGates = gates.map(gate =>
                    gate.id === editingGate.id ? updatedGateData : gate
                );
                setGates(updatedGates);
                setEditingGate(null);

                if (onGatesUpdate) {
                    onGatesUpdate(updatedGates);
                }
                
                setConfirmationMessage('Gate updated successfully!');
                setShowSuccessConfirmation(true);
            } else {
                const errorData = await response.json();
                console.error('Update gate error response:', errorData);
                throw new Error(errorData.error || 'Failed to update gate');
            }
        } catch (error) {
            console.error('Error updating gate:', error);
            setError(error instanceof Error ? error.message : 'Failed to update gate');
            setConfirmationMessage(`Failed to update gate: ${error instanceof Error ? error.message : 'Unknown error'}`);
            setShowErrorConfirmation(true);
        } finally {
            setIsLoading(false);
        }
    };

    const handleDeleteGate = (gateId: number): void => {
        setGateToDelete(gateId);
        setShowDeleteConfirmation(true);
    };

    const confirmDeleteGate = async (): Promise<void> => {
        if (!gateToDelete) return;

        setIsLoading(true);
        setError(null);

        try {
            const response = await fetch(`/api/admin/schools/gates?gateId=${gateToDelete}`, {
                method: 'DELETE'
            });

            if (response.ok) {
                const updatedGates = gates.filter(gate => gate.id !== gateToDelete);
                setGates(updatedGates);

                if (onGatesUpdate) {
                    onGatesUpdate(updatedGates);
                }
                
                setShowDeleteConfirmation(false);
                setGateToDelete(null);
                setConfirmationMessage('Gate deleted successfully!');
                setShowSuccessConfirmation(true);
            } else {
                const errorData = await response.json();
                throw new Error(errorData.error || 'Failed to delete gate');
            }
        } catch (error) {
            console.error('Error deleting gate:', error);
            setError(error instanceof Error ? error.message : 'Failed to delete gate');
            setShowDeleteConfirmation(false);
            setGateToDelete(null);
            setConfirmationMessage(`Failed to delete gate: ${error instanceof Error ? error.message : 'Unknown error'}`);
            setShowErrorConfirmation(true);
        } finally {
            setIsLoading(false);
        }
    };

    const handleToggleGateStatus = async (gateId: number, currentStatus: boolean): Promise<void> => {
        setIsLoading(true);
        setError(null);

        // Find the gate to get its name
        const gate = gates.find(g => g.id === gateId);
        if (!gate) {
            setError('Gate not found');
            setIsLoading(false);
            return;
        }

        try {
            const response = await fetch('/api/admin/schools/gates', {
                method: 'PUT',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({
                    id: gateId,
                    gateName: gate.gateName,
                    isActive: !currentStatus
                })
            });

            if (response.ok) {
                const updatedGates = gates.map(gate =>
                    gate.id === gateId ? { ...gate, isActive: !currentStatus } : gate
                );
                setGates(updatedGates);

                if (onGatesUpdate) {
                    onGatesUpdate(updatedGates);
                }
                
                setConfirmationMessage(`Gate ${!currentStatus ? 'activated' : 'deactivated'} successfully!`);
                setShowSuccessConfirmation(true);
            } else {
                const errorData = await response.json();
                throw new Error(errorData.error || 'Failed to update gate status');
            }
        } catch (error) {
            console.error('Error updating gate status:', error);
            setError(error instanceof Error ? error.message : 'Failed to update gate status');
            setConfirmationMessage(`Failed to update gate status: ${error instanceof Error ? error.message : 'Unknown error'}`);
            setShowErrorConfirmation(true);
        } finally {
            setIsLoading(false);
        }
    };

    const handleLocationSelect = (locationData: LocationData, isEditing = false): void => {
        const location: Location = {
            lat: locationData.lat,
            lng: locationData.lng
        };

        if (isEditing && editingGate) {
            setEditingGate({
                ...editingGate,
                location: location,
                placeName: locationData.placeName || '',
                address: locationData.address || ''
            });
        } else {
            setNewGate({
                ...newGate,
                location: location,
                placeName: locationData.placeName || '',
                address: locationData.address || ''
            });
        }
    };

    const resetForm = (): void => {
        setNewGate({
            gateName: '',
            location: { lat: 7.8731, lng: 80.7718 },
            description: '',
            isActive: true,
            placeName: '',
            address: ''
        });
        setIsAddingGate(false);
        setError(null);
    };

    if (!schoolId) {
        return (
            <div className="p-6 text-center text-gray-500 bg-gray-50 rounded-lg border-2 border-dashed border-gray-300">
                <School className="mx-auto mb-3 text-gray-400" size={48} />
                <h3 className="text-lg font-medium text-gray-700 mb-1">No School Selected</h3>
                <p>Please save the school first to manage gates</p>
            </div>
        );
    }

    // @ts-ignore
    return (
        <div className="space-y-6">
            {/* Header */}
            <div className="flex justify-between items-center">
                <div>
                    <h3 className="text-xl font-bold text-gray-800">School Gates Management</h3>
                    <p className="text-sm text-gray-600">Manage entry and exit points for the school</p>
                </div>
                <button
                    onClick={() => setIsAddingGate(true)}
                    disabled={isLoading}
                    className="flex items-center px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
                >
                    <Plus size={18} className="mr-2" />
                    Add Gate
                </button>
            </div>

            {/* Error Display */}
            {error && (
                <div className="p-4 bg-red-50 border border-red-200 rounded-lg">
                    <div className="flex items-center">
                        <div className="text-red-800">
                            <strong>Error:</strong> {error}
                        </div>
                        <button
                            onClick={() => setError(null)}
                            className="ml-auto text-red-600 hover:text-red-800"
                        >
                            ✕
                        </button>
                    </div>
                </div>
            )}

            {/* Existing Gates List */}
            <div className="space-y-4">
                {gates.map((gate) => (
                    <div key={gate.id} className="border border-gray-200 rounded-lg p-4 bg-white shadow-sm">
                        {editingGate?.id === gate.id ? (
                            // Edit Mode
                            <div className="space-y-4">
                                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                    <div>
                                        <label className="block text-sm font-medium text-gray-700 mb-1">
                                            Gate Name *
                                        </label>
                                        <input
                                            type="text"
                                            value={editingGate?.gateName || ''}
                                            onChange={(e) => setEditingGate({...editingGate!, gateName: e.target.value})}
                                            className="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                                            placeholder="e.g., Main Gate, Side Gate"
                                        />
                                    </div>
                                    <div>
                                        <label className="block text-sm font-medium text-gray-700 mb-1">
                                            Description
                                        </label>
                                        <input
                                            type="text"
                                            value={editingGate?.description || ''}
                                            onChange={(e) => setEditingGate({...editingGate!, description: e.target.value})}
                                            className="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                                            placeholder="Optional description"
                                        />
                                    </div>
                                </div>

                                <div>
                                    <label className="block text-sm font-medium text-gray-700 mb-2">
                                        Gate Location *
                                    </label>
                                    <MapLocationPicker
                                        onLocationSelect={(location: LocationData) => {
                                            if (editingGate) {
                                                handleLocationSelect(location, true);
                                            }
                                        }}
                                        initialLocation={editingGate?.location}
                                        height="300px"
                                        searchPlaceholder="Search for gate location..."
                                    />
                                </div>

                                <div className="flex justify-end space-x-3">
                                    <button
                                        onClick={() => setEditingGate(null)}
                                        className="flex items-center px-4 py-2 text-gray-600 hover:text-gray-800 border border-gray-300 rounded-md hover:bg-gray-50"
                                    >
                                        <X size={16} className="mr-1" />
                                        Cancel
                                    </button>
                                    <button
                                        onClick={handleEditGate}
                                        disabled={isLoading || !editingGate?.gateName?.trim()}
                                        className="flex items-center px-4 py-2 bg-green-600 text-white rounded-md hover:bg-green-700 disabled:opacity-50 disabled:cursor-not-allowed"
                                    >
                                        <Save size={16} className="mr-1" />
                                        {isLoading ? 'Saving...' : 'Save Changes'}
                                    </button>
                                </div>
                            </div>
                        ) : (
                            // View Mode
                            <div className="flex justify-between items-start">
                                <div className="flex-grow">
                                    <div className="flex items-center justify-between mb-2">
                                        <div className="flex items-center">
                                            <h4 className="text-lg font-semibold text-gray-800">{gate.gateName}</h4>
                                            {gate.isActive ? (
                                                <span className="ml-2 px-2 py-1 bg-green-100 text-green-800 text-xs rounded-full">Active</span>
                                            ) : (
                                                <span className="ml-2 px-2 py-1 bg-red-100 text-red-800 text-xs rounded-full">Inactive</span>
                                            )}
                                        </div>
                                        <button
                                            onClick={() => gate.id && handleToggleGateStatus(gate.id, gate.isActive)}
                                            disabled={isLoading}
                                            className={`px-3 py-1 text-xs rounded-full font-medium transition-colors ${
                                                gate.isActive
                                                    ? 'bg-yellow-100 text-yellow-800 hover:bg-yellow-200'
                                                    : 'bg-green-100 text-green-800 hover:bg-green-200'
                                            } disabled:opacity-50 disabled:cursor-not-allowed`}
                                            title={gate.isActive ? 'Click to deactivate gate' : 'Click to activate gate'}
                                        >
                                            {isLoading ? '...' : (gate.isActive ? 'Deactivate' : 'Activate')}
                                        </button>
                                    </div>

                                    {gate.description && (
                                        <p className="text-sm text-gray-600 mb-2">{gate.description}</p>
                                    )}

                                    {gate.address && (
                                        <p className="text-sm text-gray-500 mb-2">{gate.address}</p>
                                    )}

                                    <div className="flex items-center text-sm text-gray-500">
                                        <MapPin size={14} className="mr-1" />
                                        <span className="font-mono">
                                            {gate.location?.lat?.toFixed(6) || 'N/A'}, {gate.location?.lng?.toFixed(6) || 'N/A'}
                                        </span>
                                    </div>
                                </div>

                                <div className="flex space-x-2 ml-4">
                                    <button
                                        onClick={() => setEditingGate(gate)}
                                        className="p-2 text-blue-600 hover:text-blue-800 hover:bg-blue-50 rounded-md transition-colors"
                                        title="Edit gate"
                                    >
                                        <Edit size={18} />
                                    </button>
                                    <button
                                        onClick={() => gate.id && handleDeleteGate(gate.id)}
                                        className="p-2 text-red-600 hover:text-red-800 hover:bg-red-50 rounded-md transition-colors"
                                        title="Delete gate"
                                    >
                                        <Trash2 size={18} />
                                    </button>
                                </div>
                            </div>
                        )}
                    </div>
                ))}

                {gates.length === 0 && !isLoading && (
                    <div className="text-center py-8 bg-gray-50 rounded-lg border-2 border-dashed border-gray-300">
                        <MapPin className="mx-auto mb-3 text-gray-400" size={48} />
                        <h3 className="text-lg font-medium text-gray-700 mb-1">No Gates Added</h3>
                        <p className="text-gray-500">Add gates to help with location tracking and access management.</p>
                    </div>
                )}
            </div>

            {/* Add New Gate Form */}
            {isAddingGate && (
                <div className="border border-gray-300 rounded-lg p-6 bg-white shadow-lg">
                    <h4 className="text-lg font-semibold text-gray-800 mb-4">Add New Gate</h4>
                    <div className="space-y-4">
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                            <div>
                                <label className="block text-sm font-medium text-gray-700 mb-1">
                                    Gate Name *
                                </label>
                                <input
                                    type="text"
                                    value={newGate.gateName}
                                    onChange={(e) => setNewGate({...newGate, gateName: e.target.value})}
                                    className="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                                    placeholder="e.g., Main Gate, Side Gate"
                                    required
                                />
                            </div>
                            <div>
                                <label className="block text-sm font-medium text-gray-700 mb-1">
                                    Description
                                </label>
                                <input
                                    type="text"
                                    value={newGate.description || ''}
                                    onChange={(e) => setNewGate({...newGate, description: e.target.value})}
                                    className="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                                    placeholder="Optional description"
                                />
                            </div>
                        </div>

                        <div>
                            <label className="block text-sm font-medium text-gray-700 mb-2">
                                Gate Location *
                            </label>
                            <MapLocationPicker
                                onLocationSelect={(location: LocationData) => handleLocationSelect(location, false)}
                                initialLocation={newGate.location}
                                height="350px"
                                searchPlaceholder="Search for gate location..."
                            />
                        </div>

                        <div className="flex justify-end space-x-3">
                            <button
                                onClick={resetForm}
                                className="px-4 py-2 text-gray-600 hover:text-gray-800 border border-gray-300 rounded-md hover:bg-gray-50"
                            >
                                Cancel
                            </button>
                            <button
                                onClick={handleAddGate}
                                disabled={isLoading || !newGate.gateName.trim()}
                                className="px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 disabled:opacity-50 disabled:cursor-not-allowed"
                            >
                                {isLoading ? 'Adding...' : 'Add Gate'}
                            </button>
                        </div>
                    </div>
                </div>
            )}

            {/* Loading Indicator */}
            {isLoading && (
                <div className="text-center py-4">
                    <div className="inline-flex items-center">
                        <div className="animate-spin rounded-full h-5 w-5 border-2 border-blue-500 border-t-transparent mr-3"></div>
                        <span className="text-gray-600">Processing...</span>
                    </div>
                </div>
            )}

            {/* Delete Confirmation Dialog */}
            <ConfirmationBox
                isOpen={showDeleteConfirmation}
                title="Confirm Deletion"
                variant='warning'
                confirmationMessage="Are you sure you want to delete this gate? This action cannot be undone."
                objectName=""
                onConfirm={confirmDeleteGate}
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
    );
};

export default GateManager;