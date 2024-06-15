import React, { useState } from 'react';
import { Route, Routes, useMatch } from 'react-router-dom';
import venuesData from '../constants/venuesData.json';
import VenueCard from '../components/VenueCard';
import VenueDetails from '../components/VenueDetails';

const Venues = () => {
  const [searchTerm, setSearchTerm] = useState('');
  const match = useMatch('/venues/:id');

  const filteredVenues = venuesData.filter((venue) =>
    venue.name.toLowerCase().includes(searchTerm.toLowerCase())
  );

  return (
    <div className="container mx-auto p-4 ">
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
                {filteredVenues.map((venue) => (
                  <VenueCard
                    key={venue.id}
                    venue={venue}
                  />
                ))}
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
