import React, { useState, useEffect } from 'react';
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
    flexDirection: 'column', // Adjusted to display as columns
    alignItems: 'flex-start', // Align items to the top
    gap: '20px', // Gap between columns
    marginTop: '20px',
  },
  column: {
    display: 'flex',
    flexDirection: 'column',
    gap: '20px', // Vertical gap between inputs
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
    alignSelf: 'center', // Align the button vertically in the center
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

const UpdateFixture = () => {
  const [selectedCurrentSport, setSelectedCurrentSport] = useState('');
  const [selectedCurrentTeam1, setSelectedCurrentTeam1] = useState('');
  const [selectedCurrentTeam2, setSelectedCurrentTeam2] = useState('');
  const [selectedCurrentSex, setSelectedCurrentSex] = useState('');
  const [currentType, setCurrentType] = useState('');
  const [currentDate, setCurrentDate] = useState('');
  const [currentVenueId, setCurrentVenueId] = useState('');
  const [currentVenue, setCurrentVenue] = useState('');
  const [currentStartTime, setCurrentStartTime] = useState('');
  const [currentEndTime, setCurrentEndTime] = useState('');
  const [selectedNewSport, setSelectedNewSport] = useState('');
  const [selectedNewTeam1, setSelectedNewTeam1] = useState('');
  const [selectedNewTeam2, setSelectedNewTeam2] = useState('');
  const [selectedNewSex, setSelectedNewSex] = useState('');
  const [newType, setNewType] = useState('');
  const [newDate, setNewDate] = useState('');
  const [newVenue, setNewVenue] = useState('');
  const [newStartTime, setNewStartTime] = useState('');
  const [newEndTime, setNewEndTime] = useState('');
  const [venues, setVenues] = useState([]);
  const [message, setMessage] = useState('');

  useEffect(() => {
    const fetchVenues = async () => {
      try {
        const response = await axios.get(`${APP_SERVER_URL}/venuesData`);
        setVenues(response.data);
      } catch (error) {
        console.error('Error fetching venues:', error);
      }
    };
    fetchVenues();
  }, []);

  const filterFixtures = async () => {
    try {
      const filter = {
        sport: selectedCurrentSport,
        team1: selectedCurrentTeam1,
        team2: selectedCurrentTeam2,
        sex: selectedCurrentSex,
        type: currentType,
        venueId: currentVenueId,
        date: currentDate,
        startTime: currentStartTime,
        endTime: currentEndTime,
      };

      const response = await axios.get(
        `${APP_SERVER_URL}/fixturesData/getfixture`,
        {
          params: filter,
        }
      );

      const game = response.data;

      if (game) {
        await axios.put(`${APP_SERVER_URL}/fixturesData/${game.id}`, {
          sport: selectedNewSport,
          team1: selectedNewTeam1,
          team2: selectedNewTeam2,
          sex: selectedNewSex,
          type: newType,
          venue: newVenue,
          date: newDate,
          startTime: newStartTime,
          endTime: newEndTime,
        });
        setMessage('Fixture updated successfully!');
      } else {
        setMessage('No game found with the specified details');
      }
    } catch (error) {
      console.error('Error updating fixture:', error);
      setMessage('Error updating fixture');
    }
  };

  const handleCurrentDateChange = (date, type) => {
    const formattedDate = date ? date.toISOString().split('T')[0] : '';
    setCurrentDate(formattedDate);
  };

  const handleNewDateChange = (date, type) => {
    const formattedDate = date ? date.toISOString().split('T')[0] : '';
    setNewDate(formattedDate);
  };

  const handleFilterChange = (e, type) => {
    const { name, value } = e.target;
    if (type === 'current') {
      switch (name) {
        case 'sport':
          setSelectedCurrentSport(value);
          break;
        case 'sex':
          setSelectedCurrentSex(value);
          break;
        case 'team1':
          setSelectedCurrentTeam1(value);
          break;
        case 'team2':
          setSelectedCurrentTeam2(value);
          break;
        case 'type':
          setCurrentType(value);
          break;
        case 'venue':
          try {
            const selectedVenue = venues.find((venue) => venue.name === value);
            if (selectedVenue) {
              setCurrentVenueId(selectedVenue.id);
              setCurrentVenue(value);
              console.log(selectedVenue.id);
            }
          } catch (error) {
            console.error('Error finding venue ID:', error);
          }
          break;
        default:
          break;
      }
    } else {
      switch (name) {
        case 'sport':
          setSelectedNewSport(value);
          break;
        case 'sex':
          setSelectedNewSex(value);
          break;
        case 'team1':
          setSelectedNewTeam1(value);
          break;
        case 'team2':
          setSelectedNewTeam2(value);
          break;
        case 'type':
          setNewType(value);
          break;
        case 'venue':
          setNewVenue(value);
          break;
        default:
          break;
      }
    }
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    filterFixtures();
  };

  return (
    <div
      style={{
        ...styles.container,
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'center',
      }}
    >
      <h1 style={{ marginTop: '20px' }}>Update Fixture</h1>
      <form
        style={{ ...styles.form, marginTop: '20px' }}
        onSubmit={handleSubmit}
      >
        <div
          style={{
            display: 'flex',
            justifyContent: 'center',
            textAlign: 'centre',
          }}
        >
          {/* Current Fixture Details Column */}
          <div style={{ ...styles.column, marginRight: '20px' }}>
            <h3>Current Fixture Details</h3>
            <select
              style={styles.input}
              value={selectedCurrentSport}
              name="sport"
              onChange={(e) => handleFilterChange(e, 'current')}
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
              value={selectedCurrentSex}
              name="sex"
              onChange={(e) => handleFilterChange(e, 'current')}
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
              value={selectedCurrentTeam1}
              name="team1"
              onChange={(e) => handleFilterChange(e, 'current')}
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
              value={selectedCurrentTeam2}
              name="team2"
              onChange={(e) => handleFilterChange(e, 'current')}
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
              value={currentType}
              name="type"
              onChange={(e) => handleFilterChange(e, 'current')}
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
              value={currentVenue}
              name="venue"
              onChange={(e) => handleFilterChange(e, 'current')}
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
              selected={currentDate ? new Date(currentDate) : null}
              onChange={(date) => handleCurrentDateChange(date)}
              dateFormat="yyyy-MM-dd"
              className="mt-1 block w-full p-2 border border-gray-300 bg-sky-100 rounded-md shadow-sm focus:outline-none focus:ring-primary focus:border-primary"
              placeholderText="Select date"
            />
            <input
              type="time"
              style={styles.input}
              name="startTime"
              value={currentStartTime}
              onChange={(e) => setCurrentStartTime(e.target.value)}
            />
            <input
              type="time"
              style={styles.input}
              name="endTime"
              value={currentEndTime}
              onChange={(e) => setCurrentEndTime(e.target.value)}
            />
          </div>

          {/* New Fixture Details Column */}
          <div style={styles.column}>
            <h3>New Fixture Details</h3>
            <select
              style={styles.input}
              value={selectedNewSport}
              name="sport"
              onChange={(e) => handleFilterChange(e, 'new')}
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
              value={selectedNewSex}
              name="sex"
              onChange={(e) => handleFilterChange(e, 'new')}
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
              value={selectedNewTeam1}
              name="team1"
              onChange={(e) => handleFilterChange(e, 'new')}
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
              value={selectedNewTeam2}
              name="team2"
              onChange={(e) => handleFilterChange(e, 'new')}
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
              value={newType}
              name="type"
              onChange={(e) => handleFilterChange(e, 'new')}
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
              value={newVenue}
              name="venue"
              onChange={(e) => handleFilterChange(e, 'new')}
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
              selected={newDate ? new Date(newDate) : null}
              onChange={(date) => handleNewDateChange(date)}
              dateFormat="yyyy-MM-dd"
              className="mt-1 block w-full p-2 border border-gray-300 bg-sky-100 rounded-md shadow-sm focus:outline-none focus:ring-primary focus:border-primary"
              placeholderText="Select date"
            />
            <input
              type="time"
              style={styles.input}
              name="startTime"
              value={newStartTime}
              onChange={(e) => setNewStartTime(e.target.value)}
            />
            <input
              type="time"
              style={styles.input}
              name="endTime"
              value={newEndTime}
              onChange={(e) => setNewEndTime(e.target.value)}
            />
          </div>
        </div>
        <button
          type="submit"
          style={{ ...styles.button, marginTop: '20px' }}
        >
          Update Fixture
        </button>
      </form>
      {message && <p style={styles.message}>{message}</p>}
    </div>
  );
};

export default UpdateFixture;
