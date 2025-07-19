import { useState, useEffect } from 'react';
import { useSession } from 'next-auth/react';

interface JobOfferState {
  [key: string]: {
    hasExistingRequest: boolean;
    loading: boolean;
    error: string | null;
  };
}

export const useJobOffers = () => {
  const { data: session } = useSession();
  const [jobOfferStates, setJobOfferStates] = useState<JobOfferState>({});

  const checkExistingRequest = async (driverId: string, vanId: string) => {
    const key = `${driverId}-${vanId}`;
    
    try {
      setJobOfferStates(prev => ({
        ...prev,
        [key]: { hasExistingRequest: false, loading: true, error: null }
      }));

      const response = await fetch(
        `/api/van_service/job_offer?driverId=${driverId}&vanId=${vanId}`
      );

      if (!response.ok) {
        throw new Error('Failed to check existing requests');
      }

      const data = await response.json();
      
      setJobOfferStates(prev => ({
        ...prev,
        [key]: {
          hasExistingRequest: data.hasExistingRequest,
          loading: false,
          error: null
        }
      }));

    } catch (error) {
      setJobOfferStates(prev => ({
        ...prev,
        [key]: {
          hasExistingRequest: false,
          loading: false,
          error: error instanceof Error ? error.message : 'Unknown error'
        }
      }));
    }
  };

  const sendJobOffer = async (
    driverId: string,
    vanId: string,
    message?: string
  ) => {
    const key = `${driverId}-${vanId}`;
    
    try {
      const response = await fetch('/api/van_service/job_offer', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          driverId,
          vanId: parseInt(vanId),
          message
        })
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.error || 'Failed to send job offer');
      }

      // Update state to reflect that request has been sent
      setJobOfferStates(prev => ({
        ...prev,
        [key]: {
          hasExistingRequest: true,
          loading: false,
          error: null
        }
      }));

      return data;

    } catch (error) {
      const errorMessage = error instanceof Error ? error.message : 'Unknown error';
      
      setJobOfferStates(prev => ({
        ...prev,
        [key]: {
          ...prev[key],
          loading: false,
          error: errorMessage
        }
      }));
      
      throw error;
    }
  };

  const getJobOfferState = (driverId: string, vanId: string) => {
    const key = `${driverId}-${vanId}`;
    return jobOfferStates[key] || {
      hasExistingRequest: false,
      loading: false,
      error: null
    };
  };

  return {
    checkExistingRequest,
    sendJobOffer,
    getJobOfferState,
    isAuthenticated: !!session?.user
  };
};
