import React from 'react';
import { useLocation } from 'react-router-dom';

const styles = {
  container: {
    padding: '20px',
    textAlign: 'center',
    marginTop: '20px',
  },
  cardContainer: {
    display: 'flex',
    flexDirection: 'column',
    alignItems: 'center',
    maxWidth: '800px',
    margin: 'auto',
  },
  card: {
    width: '100%',
    border: '1px solid #ccc',
    borderRadius: '10px',
    padding: '20px',
    margin: '10px 0',
    boxShadow: '0 4px 8px rgba(0, 0, 0, 0.1)',
    backgroundColor: '#FFE4E6',
    textAlign: 'left',
  },
  heading: {
    fontSize: '2em',
    marginBottom: '20px',
  },
  videoContainer: {
    marginTop: '20px',
    maxWidth: '100%',
    position: 'relative',
    paddingBottom: '56.25%', // Aspect ratio 16:9
    height: 0,
    overflow: 'hidden',
  },
  iframe: {
    position: 'absolute',
    top: 0,
    left: 0,
    width: '100%',
    height: '100%',
  },
  summary: {
    fontSize: '1.2em',
    margin: '20px auto',
    maxWidth: '800px',
    textAlign: 'center',
    wordWrap: 'break-word',
    'white-space': 'pre-line',
  },
};

const GameSummary = () => {
  const { state } = useLocation();

  if (!state) {
    return <div style={styles.container}>No data available.</div>;
  }

  const {
    sport,
    sex,
    team1,
    team2,
    score1,
    score2,
    type,
    date,
    videoId,
    summary,
  } = state;

  return (
    <div style={styles.container}>
      <h1 style={styles.heading}>Game Summary</h1>
      <div style={styles.cardContainer}>
        {/* Card for Game Details */}
        <div style={styles.card}>
          <p
            style={{
              textAlign: 'center',
              fontSize: '1.5em',
              marginBottom: '5px',
            }}
          >
            {team1} {score1} - {score2} {team2}
          </p>
          <p
            style={{
              textAlign: 'center',
              marginBottom: '0px',
            }}
          >
            {sport} {sex}
          </p>
          <p style={{ textAlign: 'center', marginBottom: 0 }}>{type}</p>
          <p style={{ textAlign: 'center', marginBottom: 0 }}>{date}</p>
        </div>

        {/* Card for Video */}
        {videoId && (
          <div style={styles.card}>
            <div style={styles.videoContainer}>
              <iframe
                title="Game Video"
                style={styles.iframe}
                src={`https://www.youtube.com/embed/${videoId}`}
                frameBorder="0"
                allowFullScreen
              ></iframe>
            </div>
          </div>
        )}

        {/* Card for Summary */}
        {summary && (
          <div style={{ ...styles.card, textAlign: 'center' }}>
            <h2 style={{ fontSize: '1.5em', marginBottom: '10px' }}>Summary</h2>
            <div style={{ ...styles.summary, textAlign: 'centre' }}>
              <p>{summary}</p>
            </div>
          </div>
        )}
        {!summary && (
          <div style={styles.summaryCard}>
            <div style={styles.summary}>
              <p>No summary available.</p>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default GameSummary;
