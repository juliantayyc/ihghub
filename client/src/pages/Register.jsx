import React, { useState, useEffect } from 'react';
import Dropdown from '../components/Dropdown';
import api from '../util/axiosInstance';
import { useNavigate } from 'react-router-dom';
import { APP_SERVER_URL } from '../constants';

const Register = () => {
  const [fixtures, setFixtures] = useState([]);
  const [filter, setFilter] = useState({
    team: '',
    sport: '',
    sex: '',
  });
  const [venuesMap, setVenuesMap] = useState({});
  const navigate = useNavigate();

  useEffect(() => {
    fetchTodaysGames();
    fetchVenues();
  }, []);

  const fetchTodaysGames = async () => {
    try {
      const response = await api.get(`${APP_SERVER_URL}/fixturesData`);
      const today = new Date(new Date().getTime() + 8 * 60 * 60 * 1000)
        .toISOString()
        .split('T')[0]; // Get today's date in YYYY-MM-DD format
      const filteredGames = response.data.filter(
        (fixture) => fixture.date === today
      );

      // Sort games based on startTime (assuming startTime and endTime are in HH:mm:ss format)
      filteredGames.sort((a, b) => {
        const startTimeA = convertTimeToSeconds(a.startTime);
        const startTimeB = convertTimeToSeconds(b.startTime);
        return startTimeA - startTimeB;
      });

      setFixtures(filteredGames);
    } catch (error) {
      console.error('There was an error fetching the fixtures data!', error);
    }
  };

  // Function to convert HH:mm:ss to total seconds
  const convertTimeToSeconds = (timeString) => {
    const [hours, minutes, seconds] = timeString.split(':').map(Number);
    return hours * 3600 + minutes * 60 + seconds;
  };

  const fetchVenues = async () => {
    try {
      const response = await api.get(`${APP_SERVER_URL}/venuesData`);
      const venues = response.data.reduce((map, venue) => {
        map[venue.id] = venue.name; // Store venue names in an object for quick lookup
        return map;
      }, {});
      setVenuesMap(venues);
    } catch (error) {
      console.error('Error fetching venues:', error);
    }
  };

  const handleFilterChange = (e) => {
    const { name, value } = e.target;
    setFilter((prevFilter) => ({ ...prevFilter, [name]: value }));
  };

  const handleCardClick = (fixture) => {
    navigate(`/forms`, {
      state: {
        fixtureId: fixture.id,
        team1: fixture.team1,
        team2: fixture.team2,
      },
    });
  };

  const filteredFixtures = fixtures.filter((fixture) => {
    return (
      (!filter.team ||
        fixture.team1 === filter.team ||
        fixture.team2 === filter.team) &&
      (!filter.sport || fixture.sport === filter.sport) &&
      (!filter.sex || fixture.sex === filter.sex)
    );
  });

  return (
    <div
      id="fixtures"
      className="py-10"
    >
      <h2 className="h2 text-center mb-8">Register for Games</h2>
      <div className="container mb-8">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
          <Dropdown
            label="Team"
            name="team"
            value={filter.team}
            options={[...new Set(fixtures.flatMap((f) => [f.team1, f.team2]))]}
            onChange={handleFilterChange}
          />
          <Dropdown
            label="Sport"
            name="sport"
            value={filter.sport}
            options={[...new Set(fixtures.map((f) => f.sport))]}
            onChange={handleFilterChange}
          />
          <Dropdown
            label="Gender"
            name="sex"
            value={filter.sex}
            options={[...new Set(fixtures.map((f) => f.sex))]}
            onChange={handleFilterChange}
          />
        </div>
      </div>
      <div className="container grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        {filteredFixtures.map((fixture, index) => (
          <div
            key={index}
            className="relative p-6 bg-color-3 bg-opacity-10 shadow-md rounded-xl border border-n-1/10 hover:shadow-lg transition-shadow duration-200 cursor-pointer"
            onClick={() => handleCardClick(fixture)}
          >
            <div className="mb-4 text-center">
              <span className="h6 block">
                {new Date(fixture.date).toLocaleDateString('en-GB', {
                  weekday: 'short',
                  day: 'numeric',
                  month: 'numeric',
                  year: 'numeric',
                })}
              </span>
              <span className="block text-n-2 code">
                {fixture.startTime} - {fixture.endTime}
              </span>
            </div>
            <div className="mb-4 text-center">
              <span className="block text-xl font-bold text-[#6c2f1e8d]">
                {fixture.team1} vs {fixture.team2}
              </span>
            </div>
            <div className="text-n-13 text-center">
              <span className="block">
                {fixture.sport} {fixture.sex}
              </span>
              <span className="block text-n-3">{fixture.type}</span>
              <span className="block text-n-3">
                {venuesMap[fixture.venueId]}
              </span>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default Register;
