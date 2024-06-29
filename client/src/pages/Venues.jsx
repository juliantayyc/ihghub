import React, { useState, useEffect } from 'react';
import { Route, Routes } from 'react-router-dom';
import axios from 'axios';
import VenueCard from '../components/VenueCard';
import VenueDetails from '../components/VenueDetails';
import { APP_SERVER_URL } from '../constants';

const Venues = () => {
  const [venues, setVenues] = useState([]);
  const [searchTerm, setSearchTerm] = useState('');
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchVenues = async () => {
      try {
        const response = await axios.get(`${APP_SERVER_URL}/venuesData`);
        setVenues(response.data);
      } catch (error) {
        console.error('Error fetching venues:', error);
        setError('Failed to load venues');
      } finally {
        setLoading(false);
      }
    };

    fetchVenues();
  }, []);

  const filteredVenues = venues.filter((venue) =>
    venue.name.toLowerCase().includes(searchTerm.toLowerCase())
  );

  return (
    <div className="container mx-auto p-4">
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
