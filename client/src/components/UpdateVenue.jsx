import React, { useState, useEffect } from 'react';
import axios from 'axios';
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
    alignItems: 'flex-start',
    gap: '20px',
    marginTop: '20px',
  },
  column: {
    display: 'flex',
    flexDirection: 'column',
    gap: '20px',
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
    alignSelf: 'center',
  },
  message: {
    marginTop: '20px',
  },
};

const UpdateVenue = () => {
  const [selectedCurrentName, setSelectedCurrentName] = useState('');
  const [newName, setNewName] = useState('');
  const [newLocation, setNewLocation] = useState('');
  const [newLatitude, setNewLatitude] = useState('');
  const [newLongitude, setNewLongitude] = useState('');
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

  const filterVenues = async () => {
    try {
      const filter = {
        name: selectedCurrentName,
      };

      const response = await axios.get(
        `${APP_SERVER_URL}/venuesData/getvenue`,
        {
          params: filter,
        }
      );

      const venue = response.data;

      if (venue) {
        await axios.put(`${APP_SERVER_URL}/venuesData/${venue.id}`, {
          name: newName,
          location: newLocation,
          latitude: newLatitude,
          longitude: newLongitude,
        });
        setMessage('Venue updated successfully!');
      } else {
        setMessage('No venue found with the specified details');
      }
    } catch (error) {
      console.error('Error updating venue:', error);
      setMessage('Error updating venue');
    }
  };

  const handleFilterChange = (e, type) => {
    const { name, value } = e.target;
    if (type === 'current') {
      setSelectedCurrentName(value);
    } else {
      switch (name) {
        case 'name':
          setNewName(value);
          break;
        case 'location':
          setNewLocation(value);
          break;
        case 'latitude':
          setNewLatitude(value);
          break;
        case 'longitude':
          setNewLongitude(value);
          break;
        default:
          break;
      }
    }
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    filterVenues();
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
      <h1 style={{ marginTop: '20px' }}>Update Venue</h1>
      <form
        style={{ ...styles.form, marginTop: '20px' }}
        onSubmit={handleSubmit}
      >
        <div
          style={{
            display: 'flex',
            justifyContent: 'center',
            textAlign: 'center',
          }}
        >
          {/* Current Venue Details Column */}
          <div style={{ ...styles.column, marginRight: '20px' }}>
            <h3>Current Venue Details</h3>
            <select
              style={styles.input}
              value={selectedCurrentName}
              name="name"
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
          </div>

          {/* New Venue Details Column */}
          <div style={styles.column}>
            <h3>New Venue Details</h3>
            <input
              type="text"
              style={styles.input}
              placeholder="New Venue Name"
              value={newName}
              name="name"
              onChange={(e) => handleFilterChange(e, 'new')}
              autoComplete="off"
              required
            />
            <input
              type="text"
              style={styles.input}
              placeholder="New Venue Location"
              value={newLocation}
              name="location"
              onChange={(e) => handleFilterChange(e, 'new')}
              autoComplete="off"
              required
            />
            <input
              type="text"
              style={styles.input}
              placeholder="New Venue Latitude"
              value={newLatitude}
              name="latitude"
              onChange={(e) => handleFilterChange(e, 'new')}
              autoComplete="off"
              required
            />
            <input
              type="text"
              style={styles.input}
              placeholder="New Venue Longitude"
              value={newLongitude}
              name="longitude"
              onChange={(e) => handleFilterChange(e, 'new')}
              autoComplete="off"
              required
            />
          </div>
        </div>
        <button
          type="submit"
          style={{ ...styles.button, marginTop: '20px' }}
        >
          Update Venue
        </button>
      </form>
      {message && <p style={styles.message}>{message}</p>}
    </div>
  );
};

export default UpdateVenue;
