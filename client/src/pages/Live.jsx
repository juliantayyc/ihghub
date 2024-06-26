import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';
import { APP_SERVER_URL } from '../constants';

const styles = {
  container: {
    padding: '20px',
    textAlign: 'center',
    marginTop: '20px',
  },
  heading: {
    fontSize: '2em',
    marginBottom: '20px',
  },
  cards: {
    display: 'flex',
    flexWrap: 'wrap',
    justifyContent: 'center',
  },
  card: {
    border: '1px solid #ccc',
    borderRadius: '10px',
    padding: '20px',
    margin: '10px',
    width: '300px',
    boxShadow: '0 4px 8px rgba(0, 0, 0, 0.1)',
    backgroundColor: '#FFE4E6',
    cursor: 'pointer', // Make the card clickable
  },
  cardHeading: {
    fontSize: '1.5em',
    marginBottom: '10px',
  },
  cardText: {
    fontSize: '1em',
    margin: '5px 0',
  },
};

const Live = () => {
  const [liveGames, setLiveGames] = useState([]);
  const [venuesMap, setVenuesMap] = useState({});
  const navigate = useNavigate();

  useEffect(() => {
    fetchLiveGames();
    fetchVenues();
  }, []);

  const fetchLiveGames = async () => {
    try {
      const response = await axios.get(`${APP_SERVER_URL}/fixturesData/live`);
      setLiveGames(response.data);
    } catch (error) {
      console.error('Error fetching live games:', error);
    }
  };

  const fetchVenues = async () => {
    try {
      const response = await axios.get(`${APP_SERVER_URL}/venuesData`);
      const venues = response.data.reduce((map, venue) => {
        map[venue.id] = venue.name; // Store venue names in an object for quick lookup
        return map;
      }, {});
      setVenuesMap(venues);
    } catch (error) {
      console.error('Error fetching venues:', error);
    }
  };

  const handleCardClick = (game) => {
    navigate(`/game/${game.id}`, { state: { game } });
  };

  return (
    <div style={styles.container}>
      <h1 style={styles.heading}>Live Games</h1>
      <div style={styles.cards}>
        {liveGames.length > 0 ? (
          liveGames.map((game) => (
            <div
              key={game.id}
              style={styles.card}
              onClick={() => handleCardClick(game)}
            >
              <h2 style={styles.cardHeading}>
                {game.team1} vs {game.team2}
              </h2>
              <p style={styles.cardText}>
                {game.sport} - {game.sex}
              </p>
              <p style={styles.cardText}>
                Score: {game.score1} - {game.score2}
              </p>
              <p style={styles.cardText}>Venue: {venuesMap[game.venueId]}</p>
              <p style={styles.cardText}>Type: {game.type}</p>
              <p style={styles.cardText}>Date: {game.date}</p>
              <p style={styles.cardText}>
                Time: {game.startTime} - {game.endTime}
              </p>
            </div>
          ))
        ) : (
          <p>No live games currently.</p>
        )}
      </div>
    </div>
  );
};

export default Live;
