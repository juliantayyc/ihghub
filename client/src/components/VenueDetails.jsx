import React from 'react';
import { useParams } from 'react-router-dom';
import venuesData from '../constants/venuesData.json';
import BigMap from './BigMap';

const VenueDetails = () => {
  const { id } = useParams();
  const venue = venuesData.find((v) => v.id.toString() === id);

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
