import React, { useEffect, useState } from 'react';
import axios from 'axios';
import { useLocation } from 'react-router-dom';
import { YOUTUBE_API_KEY } from '../constants';
import { APP_SERVER_URL } from '../constants';
import api from '../util/axiosInstance';

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
  card: {
    border: '1px solid #ccc',
    borderRadius: '10px',
    padding: '20px',
    margin: '10px auto',
    width: '300px',
    boxShadow: '0 4px 8px rgba(0, 0, 0, 0.1)',
    backgroundColor: '#FFE4E6',
  },
  cardHeading: {
    fontSize: '1.5em',
    marginBottom: '10px',
  },
  cardText: {
    fontSize: '1em',
    margin: '5px 0',
  },
  iframeContainer: {
    display: 'flex',
    justifyContent: 'center',
    gap: '20px',
    marginTop: '20px',
  },
  iframe: {
    width: '100%',
    height: '390px',
    border: 'none',
  },
  iframeChat: {
    width: '100%',
    height: '600px',
    border: 'none',
  },
};

const sportChannelMapping = {
  Softball: 'UC8NnosPOvXnm0O1u5YnLQiw',
  Netball: 'UC8NnosPOvXnm0O1u5YnLQiw',
  'Table Tennis': 'UC8NnosPOvXnm0O1u5YnLQiw',
  Swim: 'UC8NnosPOvXnm0O1u5YnLQiw',
  'Road Relay': 'UC8NnosPOvXnm0O1u5YnLQiw',
  Track: 'UC8NnosPOvXnm0O1u5YnLQiw',
  'Touch Rugby': 'UC8NnosPOvXnm0O1u5YnLQiw',
  Handball: 'UC8NnosPOvXnm0O1u5YnLQiw',
  Football: 'UC8NnosPOvXnm0O1u5YnLQiw',
  Basketball: 'UC8NnosPOvXnm0O1u5YnLQiw',
  Floorball: 'UC8NnosPOvXnm0O1u5YnLQiw',
  Squash: 'UC8NnosPOvXnm0O1u5YnLQiw',
  Tennis: 'UC8NnosPOvXnm0O1u5YnLQiw',
  'Ultimate Frisbee': 'UC8NnosPOvXnm0O1u5YnLQiw',
  'Sepak Takraw': 'UC8NnosPOvXnm0O1u5YnLQiw',
  Volleyball: 'UC8NnosPOvXnm0O1u5YnLQiw',
  Badminton: 'UC8NnosPOvXnm0O1u5YnLQiw',
};

const fetchLiveStream = async (sport) => {
  const channelId = sportChannelMapping[sport];
  if (!channelId) {
    console.error(`No channel ID found for sport: ${sport}`);
    return null;
  }

  const response = await axios.get(
    `https://www.googleapis.com/youtube/v3/search?part=snippet&channelId=${channelId}&eventType=live&type=video&key=${YOUTUBE_API_KEY}`
  );
  const liveStream = response.data.items[0];
  return liveStream ? liveStream.id.videoId : null;
};

const fetchVenue = async (venueId) => {
  try {
    const response = await api.get(`${APP_SERVER_URL}/venuesData/${venueId}`);
    return response.data.name;
  } catch (error) {
    console.error('Error fetching venue:', error);
    return 'Unknown Venue';
  }
};

const GameDetail = () => {
  const { state } = useLocation();
  const { game } = state;
  const [videoId, setVideoId] = useState(null);
  const [loading, setLoading] = useState(true);
  const [venue, setVenue] = useState('');

  useEffect(() => {
    const getLiveStream = async () => {
      const id = await fetchLiveStream(game.sport);
      setVideoId(id);
      setLoading(false);
    };

    const getVenueName = async () => {
      const venueName = await fetchVenue(game.venueId);
      setVenue(venueName);
    };

    getLiveStream();
    getVenueName();
  }, [game.sport, game.venueId]);

  return (
    <div style={styles.container}>
      <h1 style={styles.heading}>Game Detail</h1>
      <div style={styles.card}>
        <h2 style={styles.cardHeading}>
          {game.team1} vs {game.team2}
        </h2>
        <p style={styles.cardText}>
          {game.sport} - {game.sex}
        </p>
        <p style={styles.cardText}>
          Score: {game.score1} - {game.score2}
        </p>
        <p style={styles.cardText}>Venue: {venue}</p>
        <p style={styles.cardText}>Type: {game.type}</p>
        <p style={styles.cardText}>Date: {game.date}</p>
        <p style={styles.cardText}>
          Time: {game.startTime} - {game.endTime}
        </p>
      </div>
      {loading ? (
        <p style={styles.loading}>Loading live stream...</p>
      ) : videoId ? (
        <div style={styles.iframeContainer}>
          <iframe
            style={styles.iframe}
            src={`https://www.youtube.com/embed/${videoId}`}
            allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
            allowFullScreen
          ></iframe>
          <iframe
            style={styles.iframeChat}
            src={`https://www.youtube.com/live_chat?v=${videoId}&embed_domain=${window.location.hostname}`}
            allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
            allowFullScreen
          ></iframe>
        </div>
      ) : (
        <p>No live stream available.</p>
      )}
    </div>
  );
};

export default GameDetail;
