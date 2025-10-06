export default async function getCountryData(country: string) {
  const apiUrl = `https://restcountries.com/v3.1/name/${country}`;

  try {
    const response = await fetch(apiUrl);
    if (!response.ok) {
      throw new Error(`HTTP error! status: ${response.status}`);
    }

    const data = await response.json();
    return data[0]; 
  } catch (error) {
    console.error("Error fetching data:", error);
    throw error;
  }
}