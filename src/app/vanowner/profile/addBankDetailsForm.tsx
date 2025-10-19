'use client';

import React, { useState, useEffect } from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import * as z from 'zod';
import toast from 'react-hot-toast';
import { useSession } from 'next-auth/react';

const bankSchema = z.object({
  accountNumber: z.string().min(5, 'Account number must be at least 5 digits'),
  bankName: z.string().min(2, 'Bank name is required'),
  branch: z.string().min(2, 'Branch name is required'),
});

type BankFormData = z.infer<typeof bankSchema>;

interface AddBankDetailsFormProps {
  onSuccess?: () => void;
}

export default function AddBankDetailsForm({ onSuccess }: AddBankDetailsFormProps) {
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [hasExistingDetails, setHasExistingDetails] = useState(false);
  const { data: session } = useSession();
  
  const { register, handleSubmit, formState: { errors }, reset } = useForm<BankFormData>({
    resolver: zodResolver(bankSchema),
    defaultValues: {
      accountNumber: '',
      bankName: '',
      branch: ''
    }
  });
  
  useEffect(() => {
    // Fetch existing bank details when component mounts
    async function fetchBankDetails() {
      try {
        // Wait for session to be available
        if (!session) {
          console.log('Waiting for session to be available...');
          return; // Will retry when session changes
        }
        
        console.log('Fetching bank details for user:', session.user?.id);
        
        // Include userId as query parameter if available
        const url = session.user?.id 
          ? `/api/vanowner/bank-details?userId=${encodeURIComponent(session.user.id)}`
          : '/api/vanowner/bank-details';
          
        const response = await fetch(url);
        
        if (response.ok) {
          const data = await response.json();
          console.log('Received bank details:', data);
          
          // Check if data has non-empty values
          if (data.accountNumber || data.bankName || data.branch) {
            console.log('Setting existing details with:', data);
            setHasExistingDetails(true);
            reset({
              accountNumber: data.accountNumber || '',
              bankName: data.bankName || '',
              branch: data.branch || ''
            });
          } else {
            console.log('No existing bank details found');
          }
        } else {
          console.error('Error response:', response.status, response.statusText);
          const errorData = await response.json();
          console.error('Error details:', errorData);
        }
      } catch (err) {
        console.error('Error fetching bank details:', err);
      }
    }
    
    fetchBankDetails();
  }, [reset, session]);

  const onSubmit = async (data: BankFormData) => {
    try {
      setIsSubmitting(true);
      
      // Include the userId from session in the request
      const requestData = {
        ...data,
        userId: session?.user?.id
      };
      
      const response = await fetch('/api/vanowner/bank-details', {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(requestData),
      });

      if (!response.ok) {
        const error = await response.json();
        throw new Error(error.message || 'Failed to save bank details');
      }

      toast.success(hasExistingDetails 
        ? 'Bank details updated successfully'
        : 'Bank details saved successfully'
      );
      
      if (onSuccess) onSuccess();
      setHasExistingDetails(true);
    } catch (error) {
      console.error('Error saving bank details:', error);
      toast.error(error instanceof Error ? error.message : 'Failed to save bank details');
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="bg-white rounded-2xl shadow-lg p-8">
      <h2 className="text-xl font-semibold mb-6">
        {hasExistingDetails ? 'Update Bank Details' : 'Add Bank Details'}
      </h2>
      <p className="text-gray-600 mb-6">
        Your bank details are used for processing payments for your services.
        Please ensure all information is accurate to avoid payment delays.
      </p>
      
      <form onSubmit={handleSubmit(onSubmit)} className="space-y-5">

        <div>
          <label htmlFor="accountNumber" className="block text-sm font-medium text-gray-700 mb-1">
            Account Number
          </label>
          <input
            id="accountNumber"
            type="text"
            {...register('accountNumber')}
            className="w-full px-4 py-2 border rounded-lg focus:ring-blue-500 focus:border-blue-500"
            placeholder="Enter account number"
          />
          {errors.accountNumber && (
            <p className="text-red-500 text-xs mt-1">{errors.accountNumber.message}</p>
          )}
        </div>

        <div>
          <label htmlFor="bankName" className="block text-sm font-medium text-gray-700 mb-1">
            Bank Name
          </label>
          <input
            id="bankName"
            type="text"
            {...register('bankName')}
            className="w-full px-4 py-2 border rounded-lg focus:ring-blue-500 focus:border-blue-500"
            placeholder="Enter bank name"
          />
          {errors.bankName && (
            <p className="text-red-500 text-xs mt-1">{errors.bankName.message}</p>
          )}
        </div>

        <div>
          <label htmlFor="branch" className="block text-sm font-medium text-gray-700 mb-1">
            Branch
          </label>
          <input
            id="branch"
            type="text"
            {...register('branch')}
            className="w-full px-4 py-2 border rounded-lg focus:ring-blue-500 focus:border-blue-500"
            placeholder="Enter branch name"
          />
          {errors.branch && (
            <p className="text-red-500 text-xs mt-1">{errors.branch.message}</p>
          )}
        </div>

        <div className="pt-2">
          <button
            type="submit"
            disabled={isSubmitting}
            className="btn btn-primary"
          >
            {isSubmitting ? (
              <>
                Saving...
              </>
            ) : (
              hasExistingDetails ? 'Update Bank Details' : 'Save Bank Details'
            )}
          </button>
        </div>
      </form>
    </div>
  );
}