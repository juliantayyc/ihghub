import { useState, useEffect } from 'react';
import DatePicker from 'react-datepicker';
import 'react-datepicker/dist/react-datepicker.css';
import Dropdown from '../components/Dropdown';
import axios from 'axios';
import { APP_SERVER_URL } from '../constants';

const Fixtures = () => {
  const [fixtures, setFixtures] = useState([]);
  const [filter, setFilter] = useState({
    date: '',
    team: '',
    sport: '',
    sex: '',
  });

  useEffect(() => {
    axios
      .get(`${APP_SERVER_URL}/fixturesData`)
      .then((response) => {
        const sortedFixtures = [...response.data].sort((a, b) => {
          const dateComparison = a.date.localeCompare(b.date);
          if (dateComparison !== 0) return dateComparison;
          return a.startTime.localeCompare(b.startTime);
        });
        setFixtures(sortedFixtures);
      })
      .catch((error) => {
        console.error('There was an error!', error);
      });
  }, []);

  const handleFilterChange = (e) => {
    const { name, value } = e.target;
    setFilter((prevFilter) => ({ ...prevFilter, [name]: value }));
  };

  const handleDateChange = (date) => {
    setFilter((prevFilter) => ({
      ...prevFilter,
      date: date ? date.toISOString().split('T')[0] : '',
    }));
  };

  const handleClearDate = () => {
    setFilter((prevFilter) => ({ ...prevFilter, date: '' }));
  };

  const filteredFixtures = fixtures.filter((fixture) => {
    return (
      (!filter.date || fixture.date === filter.date) &&
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
      <h2 className="h2 text-center mb-8">Fixtures</h2>
      <div className="container mb-8">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
          <div className="flex">
            <div>
              <label className="block text-sm font-medium text-gray-700">
                Date
              </label>
              <DatePicker
                selected={filter.date ? new Date(filter.date) : null}
                onChange={handleDateChange}
                dateFormat="dd/MM/yyyy"
                className="mt-1 block w-full p-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-primary focus:border-primary bg-n-6"
                placeholderText="Select a date"
              />
            </div>
            <button
              onClick={handleClearDate}
              className="sml-2 mt-6 ml-1 p-2 bg-red-500 bg-opacity-75 text-white rounded-md hover:bg-red-700 focus:outline-none focus:ring-2 focus:ring-red-500 focus:ring-opacity-50"
            >
              Clear
            </button>
          </div>
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
            className="relative p-6 bg-color-3 bg-opacity-10 shadow-md rounded-xl border border-n-1/10 hover:shadow-lg transition-shadow duration-200"
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
              <span className="block text-n-3">{fixture.venue}</span>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default Fixtures;
