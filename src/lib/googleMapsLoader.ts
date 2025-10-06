// Global Google Maps API loader to prevent duplicate loading
let isGoogleMapsLoaded = false;
let isGoogleMapsLoading = false;
let loadPromise: Promise<void> | null = null;

export const loadGoogleMapsAPI = (): Promise<void> => {
  // If already loaded, return resolved promise
  if (isGoogleMapsLoaded) {
    return Promise.resolve();
  }

  // If currently loading, return the existing promise
  if (isGoogleMapsLoading && loadPromise) {
    return loadPromise;
  }

  // Start loading
  isGoogleMapsLoading = true;
  loadPromise = new Promise((resolve, reject) => {
    // Check if script already exists
    const existingScript = document.querySelector('script[src*="maps.googleapis.com"]');
    if (existingScript) {
      // Script exists, wait for it to load
      existingScript.addEventListener('load', () => {
        isGoogleMapsLoaded = true;
        isGoogleMapsLoading = false;
        resolve();
      });
      existingScript.addEventListener('error', () => {
        isGoogleMapsLoading = false;
        reject(new Error('Failed to load Google Maps API'));
      });
      return;
    }

    // Create new script
    const script = document.createElement('script');
    script.src = `https://maps.googleapis.com/maps/api/js?key=${process.env.NEXT_PUBLIC_GOOGLE_MAPS_API_KEY}&libraries=places,marker&v=weekly`;
    script.async = true;
    script.defer = true;
    
    script.onload = () => {
      isGoogleMapsLoaded = true;
      isGoogleMapsLoading = false;
      resolve();
    };
    
    script.onerror = () => {
      isGoogleMapsLoading = false;
      reject(new Error('Failed to load Google Maps API'));
    };

    document.head.appendChild(script);
  });

  return loadPromise;
};

export const isGoogleMapsAPILoaded = (): boolean => {
  return isGoogleMapsLoaded;
};

