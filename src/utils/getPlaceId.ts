export async function getPlaceId(lat: number, lng: number, apiKey: string): Promise<string | null> {
  try {
    const url = `https://maps.googleapis.com/maps/api/geocode/json?latlng=${lat},${lng}&key=${apiKey}`;
    console.log(`Fetching placeId for coordinates: ${lat}, ${lng}`);

    const response = await fetch(url);
    const data = await response.json();

    if (data.status !== 'OK' || data.results.length === 0) {
      console.warn('Geocoding API did not return results', {
        status: data.status,
        lat,
        lng,
        results: data.results,
      });
      return null;
    }

    return data.results[0].place_id;
  } catch (error) {
    console.error('Error in getPlaceId():', error);
    return null;
  }
}
