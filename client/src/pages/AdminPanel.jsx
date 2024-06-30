import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import Forbidden from '../components/Forbidden';
import ChangeUserRole from '../components/ChangeUserRole';

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

const AdminPanel = () => {
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

  const handleChangeUserRoleClick = () => {
    navigate('/changeUserRole');
  };

  if (!userRole || userRole !== 'admin') {
    return <Forbidden />;
  }

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
        <div
          style={styles.card}
          onClick={handleChangeUserRoleClick}
        >
          <div style={styles.cardTitle}>Change User Role</div>
          <p style={styles.cardDescription}>Click here to change user roles</p>
        </div>
      </div>
    </div>
  );
};

export default AdminPanel;
