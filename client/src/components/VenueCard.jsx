import React from 'react';
import { Link } from 'react-router-dom';
import MiniMap from './MiniMap';

const VenueCard = ({ venue }) => {
  return (
    <div className="border p-4 rounded shadow flex items-center space-x-4 bg-orange-100">
      <div className="flex-1">
        <h2 className="text-xl font-semibold">{venue.name}</h2>
        <p>{venue.location}</p>
        {venue.weather ? (
          <div className="mt-2">
            <p>Temperature: {venue.weather.main.temp}°C</p>
            <p>Condition: {venue.weather.weather[0].description}</p>
          </div>
        ) : (
          <p>Weather information not available</p>
        )}
        <Link
          to={`/venues/${venue.id}`}
          className="text-blue-500 mt-2 inline-block"
        >
          View Details
        </Link>
      </div>
      <div className="w-16 h-16">
        <MiniMap
          latitude={venue.latitude}
          longitude={venue.longitude}
          smallSize
        />
      </div>
    </div>
  );
};

export default VenueCard;
