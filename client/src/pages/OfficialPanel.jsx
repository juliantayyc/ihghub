import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import Forbidden from '../components/Forbidden';

const styles = {
  container: {
    display: 'flex',
    flexDirection: 'column',
    alignItems: 'center',
    padding: '20px',
    textAlign: 'center',
    fontSize: '1.5rem',
  },
  cardContainer: {
    display: 'flex',
    justifyContent: 'center',
    gap: '20px',
    marginTop: '20px',
    flexWrap: 'wrap',
    maxWidth: '800px',
  },
  card: {
    padding: '20px',
    margin: '10px',
    borderRadius: '8px',
    border: '1px solid #ddd',
    boxShadow: '0 4px 8px rgba(0, 0, 0, 0.1)',
    backgroundColor: '#fff',
    cursor: 'pointer',
    transition: 'transform 0.3s ease-in-out',
    maxWidth: '300px',
    width: '100%',
  },
  cardTitle: {
    fontSize: '1.2rem',
    fontWeight: 'bold',
    marginBottom: '10px',
  },
  cardDescription: {
    fontSize: '1rem',
    color: '#555',
  },
};

const OfficialPanel = () => {
  const navigate = useNavigate();
  const [userRole, setUserRole] = useState('');

  useEffect(() => {
    const accessToken = document.cookie
      .split('; ')
      .find((row) => row.startsWith('accessToken='))
      ?.split('=')[1];

    if (accessToken) {
      const payload = JSON.parse(atob(accessToken.split('.')[1]));
      setUserRole(payload.role);
    }
  }, []);

  const handleUploadVideoClick = () => {
    navigate('/uploadvideo');
  };

  const handleUpdateScoreClick = () => {
    navigate('/updatescore');
  };

  const handleRegistrationClick = () => {
    navigate('/registration');
  };

  if (!userRole || (userRole !== 'official' && userRole !== 'admin')) {
    return <Forbidden />;
  }

  return (
    <div style={styles.container}>
      <h1>Official Panel</h1>
      <div style={styles.cardContainer}>
        <div
          style={styles.card}
          onClick={handleUploadVideoClick}
        >
          <div style={styles.cardTitle}>Upload Live Stream Video</div>
          <p style={styles.cardDescription}>
            Click here to upload a new video of your match
          </p>
        </div>
        <div
          style={styles.card}
          onClick={handleUpdateScoreClick}
        >
          <div style={styles.cardTitle}>Update Score</div>
          <p style={styles.cardDescription}>
            Click here to update scores of your match
          </p>
        </div>
        <div
          style={styles.card}
          onClick={handleRegistrationClick}
        >
          <div style={styles.cardTitle}>Registration</div>
          <p style={styles.cardDescription}>
            Click here to manage registrations
          </p>
        </div>
      </div>
    </div>
  );
};

export default OfficialPanel;
