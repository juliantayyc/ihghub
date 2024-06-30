import React, { useState } from 'react';
import axios from 'axios';
import api from '../util/axiosInstance';
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

const CreateVenue = () => {
  const [name, setName] = useState('');
  const [location, setLocation] = useState('');
  const [longitude, setLongitude] = useState('');
  const [latitude, setLatitude] = useState('');
  const [message, setMessage] = useState('');

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const venueData = {
        name,
        location,
        longitude,
        latitude,
      };

      await api.post(`${APP_SERVER_URL}/venuesData`, venueData);
      setMessage('Venue created successfully!');
      // Optionally, clear form fields after successful submission
      setName('');
      setLocation('');
      setLongitude('');
      setLatitude('');
    } catch (error) {
      console.error('Error creating venue:', error);
      setMessage('Error creating venue');
    }
  };

  return (
    <div style={styles.container}>
      <h1 style={{ marginTop: '20px' }}>Create Venue</h1>
      <form
        style={styles.form}
        onSubmit={handleSubmit}
      >
        <input
          type="text"
          style={styles.input}
          placeholder="Venue Name"
          value={name}
          onChange={(e) => setName(e.target.value)}
          required
        />
        <input
          type="text"
          style={styles.input}
          placeholder="Location"
          value={location}
          onChange={(e) => setLocation(e.target.value)}
          required
        />
        <input
          type="text"
          style={styles.input}
          placeholder="Longitude"
          value={longitude}
          onChange={(e) => setLongitude(e.target.value)}
          required
        />
        <input
          type="text"
          style={styles.input}
          placeholder="Latitude"
          value={latitude}
          onChange={(e) => setLatitude(e.target.value)}
          required
        />
        <button
          type="submit"
          style={styles.button}
        >
          Create Venue
        </button>
      </form>
      {message && <p style={styles.message}>{message}</p>}
    </div>
  );
};

export default CreateVenue;
