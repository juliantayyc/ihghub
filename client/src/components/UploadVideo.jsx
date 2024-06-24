import React, { useState } from 'react';
import axios from 'axios';
import DatePicker from 'react-datepicker';
import 'react-datepicker/dist/react-datepicker.css';
import { APP_SERVER_URL } from '../constants';

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

const teamsOptions = ['TH', 'EH', 'KR', 'SH', 'RH', 'KE'];

const sexOptions = ['M', 'F', 'Mixed'];

const typeOptions = ['Carnival', 'Prelims', 'Semis', 'Finals'];

const UploadVideo = () => {
  const [selectedSport, setSelectedSport] = useState('');
  const [selectedTeam1, setSelectedTeam1] = useState('');
  const [selectedTeam2, setSelectedTeam2] = useState('');
  const [selectedSex, setSelectedSex] = useState('');
  const [type, setType] = useState('');
  const [date, setDate] = useState('');
  const [videoId, setVideoId] = useState('');
  const [summary, setSummary] = useState('');
  const [message, setMessage] = useState('');
  const [filteredFixtures, setFilteredFixtures] = useState([]);

  const filterFixtures = async () => {
    try {
      const filter = {
        sport: selectedSport,
        team1: selectedTeam1,
        team2: selectedTeam2,
        sex: selectedSex,
        type,
        date,
      };

      const response = await axios.get(
        `${APP_SERVER_URL}/fixturesData/search`,
        {
          params: filter,
        }
      );

      const game = response.data;

      if (game) {
        await axios.put(`${APP_SERVER_URL}/fixturesData/${game.id}/video`, {
          videoId,
          summary,
        });
        setMessage('Video ID and summary updated successfully!');
      } else {
        setMessage('No game found with the specified details');
      }
    } catch (error) {
      console.error('Error updating video ID and summary:', error);
      setMessage('Error updating video ID and summary');
    }
  };

  const handleDateChange = (selectedDate) => {
    const formattedDate = selectedDate
      ? selectedDate.toISOString().split('T')[0]
      : '';
    setDate(formattedDate);
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
      default:
        break;
    }
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    filterFixtures();
  };

  return (
    <div style={styles.container}>
      <h1 style={{ marginTop: '20px' }}>Upload Live Stream Video</h1>{' '}
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
        <DatePicker
          selected={date ? new Date(date) : null}
          onChange={handleDateChange}
          dateFormat="yyyy-MM-dd"
          className="mt-1 block w-full p-2 border border-gray-300 bg-sky-100 rounded-md shadow-sm focus:outline-none focus:ring-primary focus:border-primary"
          placeholderText="Select date"
        />
        <input
          type="text"
          style={styles.input}
          placeholder="YouTube Video ID"
          value={videoId}
          onChange={(e) => setVideoId(e.target.value)}
        />
        <textarea
          style={styles.input}
          placeholder="Enter your summary"
          value={summary}
          onChange={(e) => setSummary(e.target.value)}
          rows={4}
        />
        <button
          type="submit"
          style={styles.button}
        >
          Update Video ID and Summary
        </button>
      </form>
      {message && <p style={styles.message}>{message}</p>}
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

export default UploadVideo;
