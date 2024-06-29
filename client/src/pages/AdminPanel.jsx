import React from 'react';
import { useNavigate } from 'react-router-dom';

const styles = {
  container: {
    display: 'flex',
    flexDirection: 'column',
    alignItems: 'center',
    padding: '20px',
    textAlign: 'center',
    fontSize: '1.5rem', // Larger font size for the entire container
  },
  cardContainer: {
    display: 'flex',
    justifyContent: 'center',
    gap: '20px',
    marginTop: '20px',
    flexWrap: 'wrap',
    maxWidth: '800px', // Optional: Limit width to prevent too wide layout
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
    fontSize: '1.2rem', // Larger font size for card titles
    fontWeight: 'bold',
    marginBottom: '10px',
  },
  cardDescription: {
    fontSize: '1rem', // Adjust font size for card descriptions
    color: '#555', // Adjust color if needed
  },
};

const AdminPanel = () => {
  const navigate = useNavigate();

  const handleCreateFixtureClick = () => {
    navigate('/createfixture');
  };

  const handleUpdateFixtureClick = () => {
    navigate('/updatefixture');
  };

  const handleCreateVenueClick = () => {
    navigate('/createvenue');
  };

  const handleUpdateVenueClick = () => {
    navigate('/updatevenue');
  };

  return (
    <div style={styles.container}>
      <h1>Admin Panel</h1>
      <div style={styles.cardContainer}>
        <div
          style={styles.card}
          onClick={handleCreateFixtureClick}
        >
          <div style={styles.cardTitle}>Create Fixture</div>
          <p style={styles.cardDescription}>
            Click here to create a new fixture
          </p>
        </div>
        <div
          style={styles.card}
          onClick={handleUpdateFixtureClick}
        >
          <div style={styles.cardTitle}>Update Fixture</div>
          <p style={styles.cardDescription}>Click here to update a fixture</p>
        </div>
        <div
          style={styles.card}
          onClick={handleCreateVenueClick}
        >
          <div style={styles.cardTitle}>Create Venue</div>
          <p style={styles.cardDescription}>Click here to create a new venue</p>
        </div>
        <div
          style={styles.card}
          onClick={handleUpdateVenueClick}
        >
          <div style={styles.cardTitle}>Update Venue</div>
          <p style={styles.cardDescription}>Click here to update a venue</p>
        </div>
      </div>
    </div>
  );
};

export default AdminPanel;
