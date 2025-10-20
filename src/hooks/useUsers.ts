import { useState, useEffect } from 'react';

interface User {
  id: string;
  Name: string;
  User_ID: string;
  Email: string;
  Status: 'Active' | 'Inactive' | 'Pending';
  Role: string;
  Mobile?: string;
  Address?: string;
  District?: string;
  CreatedAt?: string;
  UpdatedAt?: string;
}

interface UseUsersProps {
  userRole: 'driver' | 'parent' | 'van owner' | 'admin' | 'all';
  searchTerm?: string;
  statusFilter?: string;
  roleFilter?: string;
}

interface UseUsersReturn {
  users: User[];
  loading: boolean;
  error: string | null;
  refetch: () => void;
  updateUser: (userId: string, data: Partial<User>) => Promise<boolean>;
  toggleUserStatus: (userId: string, activeStatus: boolean) => Promise<boolean>;
}

export const useUsers = ({ userRole, searchTerm = '', statusFilter = '', roleFilter = '' }: UseUsersProps): UseUsersReturn => {
  const [users, setUsers] = useState<User[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const fetchUsers = async () => {
    try {
      setLoading(true);
      setError(null);

      const params = new URLSearchParams({
        role: userRole,
        ...(searchTerm && { search: searchTerm }),
        ...(statusFilter && { status: statusFilter }),
        ...(roleFilter && { roleFilter: roleFilter })
      });

      const response = await fetch(`/api/admin/users?${params}`);
      const result = await response.json();

      if (!response.ok) {
        throw new Error(result.error || 'Failed to fetch users');
      }

      setUsers(result.data || []);
    } catch (err) {
      console.error('Error fetching users:', err);
      setError(err instanceof Error ? err.message : 'Failed to fetch users');
      setUsers([]);
    } finally {
      setLoading(false);
    }
  };

  const updateUser = async (userId: string, data: Partial<User>): Promise<boolean> => {
    try {
      const response = await fetch('/api/admin/users/update', {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          userId,
          ...data
        }),
      });

      const result = await response.json();

      if (!response.ok) {
        throw new Error(result.error || 'Failed to update user');
      }

      // Update the user in the local state
      setUsers(prevUsers => 
        prevUsers.map(user => 
          user.id === userId 
            ? { ...user, ...result.data }
            : user
        )
      );

      return true;
    } catch (err) {
      console.error('Error updating user:', err);
      setError(err instanceof Error ? err.message : 'Failed to update user');
      return false;
    }
  };

  const toggleUserStatus = async (userId: string, activeStatus: boolean): Promise<boolean> => {
    try {
      const response = await fetch('/api/admin/users/status', {
        method: 'PATCH',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          userId,
          activeStatus
        }),
      });

      const result = await response.json();

      if (!response.ok) {
        throw new Error(result.error || 'Failed to update user status');
      }

      // Update the user status in the local state
      setUsers(prevUsers => 
        prevUsers.map(user => 
          user.id === userId 
            ? { ...user, Status: activeStatus ? 'Active' : 'Inactive' }
            : user
        )
      );

      return true;
    } catch (err) {
      console.error('Error updating user status:', err);
      setError(err instanceof Error ? err.message : 'Failed to update user status');
      return false;
    }
  };

  useEffect(() => {
    fetchUsers();
  }, [userRole, searchTerm, statusFilter, roleFilter]);

  return {
    users,
    loading,
    error,
    refetch: fetchUsers,
    updateUser,
    toggleUserStatus
  };
};

