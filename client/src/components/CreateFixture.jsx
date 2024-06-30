import React, { useState, useEffect } from 'react';
import axios from 'axios';
import DatePicker from 'react-datepicker';
import 'react-datepicker/dist/react-datepicker.css';
import { APP_SERVER_URL } from '../constants';
import api from '../util/axiosInstance';

const styles = {
  container: {
    padding: '20px',
    textAlign: 'center',
    fontSize: '20px',
  },
  form: {
    display: 'flex',
    flexDirection: 'column',
    alignItems: 'center',
    gap: '10px',
    marginTop: '20px',
  },
  input: {
    padding: '10px',
    fontSize: '16px',
    borderRadius: '5px',
    border: '1px solid #ccc',
    width: '300px',
    backgroundColor: '#E0F2FE',
  },
  button: {
    padding: '10px 20px',
    fontSize: '16px',
    borderRadius: '5px',
    border: 'none',
    backgroundColor: '#4CAF50',
    color: 'white',
    cursor: 'pointer',
  },
  message: {
    marginTop: '20px',
  },
};

const sportsOptions = [
  'Softball',
  'Netball',
  'Table Tennis',
  'Swim',
  'Road Relay',
  'Track',
  'Touch Rugby',
  'Handball',
  'Football',
  'Basketball',
  'Floorball',
  'Squash',
  'Tennis',
  'Ultimate Frisbee',
  'Sepak Takraw',
  'Volleyball',
  'Badminton',
];

const teamsOptions = ['TH', 'EH', 'KR', 'SH', 'RH', 'KE', 'All'];

const sexOptions = ['M', 'F', 'Mixed'];

const typeOptions = ['Carnival', 'Prelims', 'Semis', 'Finals'];

const CreateFixture = () => {
  const [selectedSport, setSelectedSport] = useState('');
  const [selectedTeam1, setSelectedTeam1] = useState('');
  const [selectedTeam2, setSelectedTeam2] = useState('');
  const [selectedSex, setSelectedSex] = useState('');
  const [type, setType] = useState('');
  const [date, setDate] = useState('');
  const [startTime, setStartTime] = useState('');
  const [endTime, setEndTime] = useState('');
  const [selectedVenue, setSelectedVenue] = useState('');
  const [venues, setVenues] = useState([]);
  const [message, setMessage] = useState('');

  useEffect(() => {
    const fetchVenues = async () => {
      try {
        const response = await api.get(`${APP_SERVER_URL}/venuesData`);
        setVenues(response.data);
      } catch (error) {
        console.error('Error fetching venues:', error);
      }
    };
    fetchVenues();
  }, []);

  const handleDateChange = (selectedDate) => {
    const formattedDate = selectedDate
      ? selectedDate.toISOString().split('T')[0]
      : '';
    setDate(formattedDate);
  };

  const handleTimeChange = (e) => {
    const { name, value } = e.target;
    if (name === 'startTime') {
      setStartTime(value);
    } else {
      setEndTime(value);
    }
  };

  const handleFilterChange = (e) => {
    const { name, value } = e.target;
    switch (name) {
      case 'sport':
        setSelectedSport(value);
        break;
      case 'sex':
        setSelectedSex(value);
        break;
      case 'team1':
        setSelectedTeam1(value);
        break;
      case 'team2':
        setSelectedTeam2(value);
        break;
      case 'type':
        setType(value);
        break;
      case 'venue':
        setSelectedVenue(value);
        break;
      default:
        break;
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const fixtureData = {
        sport: selectedSport,
        team1: selectedTeam1,
        team2: selectedTeam2,
        sex: selectedSex,
        type,
        date,
        startTime,
        endTime,
        venue: selectedVenue,
      };

      await api.post(`${APP_SERVER_URL}/fixturesData`, fixtureData);
      setMessage('Fixture created successfully!');
    } catch (error) {
      console.error('Error creating fixture:', error);
      setMessage('Error creating fixture');
    }
  };

  return (
    <div style={styles.container}>
      <h1 style={{ marginTop: '20px' }}>Create Fixture</h1>
      <form
        style={styles.form}
        onSubmit={handleSubmit}
      >
        <select
          style={styles.input}
          value={selectedSport}
          name="sport"
          onChange={handleFilterChange}
        >
          <option value="">Select Sport</option>
          {sportsOptions.map((sport, index) => (
            <option
              key={index}
              value={sport}
            >
              {sport}
            </option>
          ))}
        </select>
        <select
          style={styles.input}
          value={selectedSex}
          name="sex"
          onChange={handleFilterChange}
        >
          <option value="">Select Sex</option>
          {sexOptions.map((sex, index) => (
            <option
              key={index}
              value={sex}
            >
              {sex}
            </option>
          ))}
        </select>
        <select
          style={styles.input}
          value={selectedTeam1}
          name="team1"
          onChange={handleFilterChange}
        >
          <option value="">Select Team 1</option>
          {teamsOptions.map((team, index) => (
            <option
              key={index}
              value={team}
            >
              {team}
            </option>
          ))}
        </select>
        <select
          style={styles.input}
          value={selectedTeam2}
          name="team2"
          onChange={handleFilterChange}
        >
          <option value="">Select Team 2</option>
          {teamsOptions.map((team, index) => (
            <option
              key={index}
              value={team}
            >
              {team}
            </option>
          ))}
        </select>
        <select
          style={styles.input}
          value={type}
          name="type"
          onChange={handleFilterChange}
        >
          <option value="">Select Type</option>
          {typeOptions.map((type, index) => (
            <option
              key={index}
              value={type}
            >
              {type}
            </option>
          ))}
        </select>
        <select
          style={styles.input}
          value={selectedVenue}
          name="venue"
          onChange={handleFilterChange}
        >
          <option value="">Select Venue</option>
          {venues.map((venue, index) => (
            <option
              key={index}
              value={venue.name}
            >
              {venue.name}
            </option>
          ))}
        </select>
        <DatePicker
          selected={date ? new Date(date) : null}
          onChange={handleDateChange}
          dateFormat="yyyy-MM-dd"
          className="mt-1 block w-full p-2 border border-gray-300 bg-sky-100 rounded-md shadow-sm focus:outline-none focus:ring-primary focus:border-primary"
          placeholderText="Select date"
        />
        <input
          type="time"
          style={styles.input}
          name="startTime"
          value={startTime}
          onChange={handleTimeChange}
        />
        <input
          type="time"
          style={styles.input}
          name="endTime"
          value={endTime}
          onChange={handleTimeChange}
        />
        <button
          type="submit"
          style={styles.button}
        >
          Create Fixture
        </button>
      </form>
      {message && <p style={styles.message}>{message}</p>}
    </div>
  );
};

export default CreateFixture;
