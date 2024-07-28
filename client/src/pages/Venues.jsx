import React, { useState, useEffect } from 'react';
import { Route, Routes } from 'react-router-dom';
import axios from 'axios';
import VenueCard from '../components/VenueCard';
import VenueDetails from '../components/VenueDetails';
import { APP_SERVER_URL, WEATHER_API_KEY, WEATHER_API_URL } from '../constants';

const NUS_COORDINATES = { latitude: 1.2966, longitude: 103.7764 };

const Venues = () => {
  const [venues, setVenues] = useState([]);
  const [searchTerm, setSearchTerm] = useState('');
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [weather, setWeather] = useState(null);

  useEffect(() => {
    const fetchVenues = async () => {
      try {
        const response = await axios.get(`${APP_SERVER_URL}/venuesData`);
        console.log('Response from venuesData endpoint:', response); // Log the entire response
        if (response.data && response.data.length > 0) {
          console.log('Fetched venues:', response.data); // Log the fetched venues
          return response.data;
        } else {
          console.error('No data in response:', response.data); // Log if response has no data
          setError('No venues found');
          return [];
        }
      } catch (error) {
        console.error('Error fetching venues:', error);
        setError('Failed to load venues');
        return [];
      }
    };

    const fetchWeatherData = async (lat, lon) => {
      if (!lat || !lon) {
        console.error('Invalid coordinates:', lat, lon); // Log invalid coordinates
        return null;
      }

      try {
        const response = await axios.get(WEATHER_API_URL, {
          params: {
            lat,
            lon,
            units: 'metric',
            appid: WEATHER_API_KEY,
          },
        });
        console.log('Fetched weather data:', response.data); // Log the fetched weather data
        return response.data;
      } catch (error) {
        console.error('Error fetching weather data:', error);
        return null;
      }
    };

    const fetchVenuesWithWeather = async () => {
      const fetchedVenues = await fetchVenues();
      if (fetchedVenues.length > 0) {
        const venuesWithWeather = await Promise.all(
          fetchedVenues.map(async (venue) => {
            try {
              const weather = await fetchWeatherData(
                venue.latitude,
                venue.longitude
              );
              console.log(`Weather for venue ${venue.name}:`, weather); // Log weather for each venue
              return { ...venue, weather };
            } catch (error) {
              console.error(
                `Error fetching weather for venue ${venue.name}:`,
                error
              );
              return { ...venue, weather: null };
            }
          })
        );
        console.log('Venues with weather data:', venuesWithWeather); // Log the venues with weather data
        setVenues(venuesWithWeather);
      } else {
        console.error('No venues found'); // Log if no venues are found
      }
      setLoading(false); // Ensure loading is set to false
    };

    const fetchWeather = async () => {
      try {
        const response = await axios.get(WEATHER_API_URL, {
          params: {
            lat: NUS_COORDINATES.latitude,
            lon: NUS_COORDINATES.longitude,
            units: 'metric',
            appid: WEATHER_API_KEY,
          },
        });
        console.log('Fetched NUS weather:', response.data); // Log the fetched NUS weather data
        setWeather(response.data);
      } catch (error) {
        console.error('Error fetching NUS weather:', error);
        setError('Failed to load weather');
      }
    };

    fetchVenuesWithWeather();
    fetchWeather();
  }, []);

  const filteredVenues = venues.filter((venue) =>
    venue.name.toLowerCase().includes(searchTerm.toLowerCase())
  );

  return (
    <div className="container mx-auto p-4">
      {weather && (
        <div className="p-4 mb-4 bg-blue-100 rounded flex items-center">
          <div className="flex-1">
            <h2 className="text-xl font-bold">Current Weather in NUS</h2>
            <div className="flex items-center">
              <div className="mr-2">
                <p>Temperature: {weather.main.temp}°C</p>
                <p>Condition: {weather.weather[0].description}</p>
                <p>Humidity: {weather.main.humidity}%</p>
                <p>Wind Speed: {weather.wind.speed} m/s</p>
              </div>
              <img
                src={`http://openweathermap.org/img/wn/${weather.weather[0].icon}@2x.png`}
                alt="Weather icon"
                className="w-16 h-16"
              />
            </div>
          </div>
        </div>
      )}
      <Routes>
        <Route
          path="/"
          element={
            <>
              <h1 className="text-2xl font-bold mb-4">Venues</h1>
              <input
                type="text"
                placeholder="Search for a venue..."
                className="p-2 border border-gray-300 rounded mb-4 w-full bg-orange-200"
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
              />
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                {loading ? (
                  <p>Loading venues...</p>
                ) : error ? (
                  <p>{error}</p>
                ) : (
                  filteredVenues.map((venue) => (
                    <VenueCard
                      key={venue.id}
                      venue={venue}
                    />
                  ))
                )}
              </div>
            </>
          }
        />
        <Route
          path="/:id"
          element={<VenueDetails />}
        />
      </Routes>
    </div>
  );
};

export default Venues;
