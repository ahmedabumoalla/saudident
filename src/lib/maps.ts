export function getGoogleMapsUrl(latitude: number, longitude: number): string {
  const query = encodeURIComponent(`${latitude},${longitude}`);
  return `https://www.google.com/maps/search/?api=1&query=${query}`;
}
