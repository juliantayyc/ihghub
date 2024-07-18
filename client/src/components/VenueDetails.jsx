import React, { useState, useEffect } from 'react';
import { useParams } from 'react-router-dom';
import axios from 'axios';
import BigMap from './BigMap';
import { APP_SERVER_URL, WEATHER_API_KEY, WEATHER_API_URL } from '../constants';
import api from '../util/axiosInstance';

const VenueDetails = () => {
  const { id } = useParams();
  const [venue, setVenue] = useState(null);
  const [weather, setWeather] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchVenue = async () => {
      try {
        const response = await api.get(`${APP_SERVER_URL}/venuesData/${id}`);
        setVenue(response.data);
        fetchWeather(response.data.latitude, response.data.longitude);
      } catch (error) {
        console.error('Error fetching venue:', error);
        setError('Failed to load venue');
      } finally {
        setLoading(false);
      }
    };

    const fetchWeather = async (latitude, longitude) => {
      try {
        const response = await axios.get(`${WEATHER_API_URL}`, {
          params: {
            lat: latitude,
            lon: longitude,
            units: 'metric',
            appid: WEATHER_API_KEY,
          },
        });
        setWeather(response.data);
      } catch (error) {
        console.error('Error fetching weather:', error);
        setError('Failed to load weather');
      }
    };

    fetchVenue();
  }, [id]);

  if (loading) {
    return <div>Loading...</div>;
  }

  if (error) {
    return <div>{error}</div>;
  }

  if (!venue) {
    return <div>Venue not found</div>;
  }

  const handleGetDirections = () => {
    const destination = `${venue.latitude},${venue.longitude}`;
    window.open(
      `https://www.google.com/maps/dir/?api=1&destination=${destination}`,
      '_blank'
    );
  };

  return (
    <div className="container mx-auto p-4">
      <h1 className="text-2xl font-bold mb-4">{venue.name}</h1>
      <p>{venue.location}</p>
      <BigMap
        latitude={venue.latitude}
        longitude={venue.longitude}
      />
      <button
        onClick={handleGetDirections}
        className="mt-4 p-2 bg-blue-500 text-white rounded"
      >
        Get Directions
      </button>
      {weather && (
        <div className="mt-4 p-4 bg-blue-100 rounded">
          <h2 className="text-xl font-semibold">Current Weather</h2>
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
              className="w-12 h-12"
            />
          </div>
        </div>
      )}
    </div>
  );
};

export default VenueDetails;
