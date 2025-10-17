export async function getPlaceName(lat: number, lng: number, apiKey: string): Promise<string | null> {
  try {
    const url = `https://maps.googleapis.com/maps/api/geocode/json?latlng=${lat},${lng}&key=${apiKey}`;
    const response = await fetch(url);
    const data = await response.json();

    if (data.status === 'OK' && data.results.length > 0) {
      return data.results[0].formatted_address; // Full place name
    } else {
      console.warn('No results found for place name lookup:', { lat, lng, status: data.status });
      return null;
    }
  } catch (error) {
    console.error('Error fetching place name:', error);
    return null;
  }
}
