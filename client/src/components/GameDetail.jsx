import React from 'react';
import { useLocation } from 'react-router-dom';

const styles = {
  container: {
    padding: '20px',
    textAlign: 'center',
  },
  heading: {
    fontSize: '2em',
    marginBottom: '20px',
  },
  card: {
    border: '1px solid #ccc',
    borderRadius: '10px',
    padding: '20px',
    margin: '10px auto',
    width: '300px',
    boxShadow: '0 4px 8px rgba(0, 0, 0, 0.1)',
    backgroundColor: '#FFEDD5',
  },
  cardHeading: {
    fontSize: '1.5em',
    marginBottom: '10px',
  },
  cardText: {
    fontSize: '1em',
    margin: '5px 0',
  },
  iframe: {
    width: '100%',
    height: '390px',
    border: 'none',
  },
};

const GameDetail = () => {
  const { state } = useLocation();
  const { game } = state;

  return (
    <div style={styles.container}>
      <h1 style={styles.heading}>Game Detail</h1>
      <div style={styles.card}>
        <h2 style={styles.cardHeading}>
          {game.team1} vs {game.team2}
        </h2>
        <p style={styles.cardText}>
          Score: {game.score1} - {game.score2}
        </p>
        <p style={styles.cardText}>Venue: {game.venue}</p>
        <p style={styles.cardText}>Type: {game.type}</p>
        <p style={styles.cardText}>Date: {game.date}</p>
        <p style={styles.cardText}>
          Time: {game.startTime} - {game.endTime}
        </p>
      </div>
      <iframe
        style={styles.iframe}
        src={`https://www.youtube.com/embed/GKXgezo3qnE`} // Replace with your actual livestream video ID
        allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
        allowFullScreen
      ></iframe>
    </div>
  );
};

export default GameDetail;
