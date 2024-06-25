import React, { useState, useEffect } from 'react';
import { useParams } from 'react-router-dom';
import axios from 'axios';
import BigMap from './BigMap';
import { APP_SERVER_URL } from '../constants';

const VenueDetails = () => {
  const { id } = useParams();
  const [venue, setVenue] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchVenue = async () => {
      try {
        const response = await axios.get(`${APP_SERVER_URL}/venuesData/${id}`);
        setVenue(response.data);
      } catch (error) {
        console.error('Error fetching venue:', error);
        setError('Failed to load venue');
      } finally {
        setLoading(false);
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
    </div>
  );
};

export default VenueDetails;
