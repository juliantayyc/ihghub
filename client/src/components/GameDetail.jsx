import React, { useEffect, useState } from 'react';
import axios from 'axios';
import { useLocation } from 'react-router-dom';
import { YOUTUBE_API_KEY } from '../constants';

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
  iframe: {
    width: '100%',
    height: '390px',
    border: 'none',
  },
};

const sportChannelMapping = {
  Softball: 'YOUR_SOFTBALL_CHANNEL_ID',
  Netball: 'YOUR_NETBALL_CHANNEL_ID',
  'Table Tennis': 'YOUR_TABLETENNIS_CHANNEL_ID',
  Swim: 'YOUR_SWIM_CHANNEL_ID',
  'Road Relay': 'YOUR_ROADRELAY_CHANNEL_ID',
  Track: 'YOUR_TRACK_CHANNEL_ID',
  'Touch Rugby': 'YOUR_TOUCHRUGBY_CHANNEL_ID',
  Handball: 'YOUR_HANDBALL_CHANNEL_ID',
  Football: 'UCiJTKr-wja_JVM2dVTYCELA',
  Basketball: 'YOUR_BASKETBALL_CHANNEL_ID',
  Floorball: 'YOUR_FLOORBALL_CHANNEL_ID',
  Squash: 'YOUR_SQUASH_CHANNEL_ID',
  Tennis: 'UCcyq283he07B7_KUX07mmtA',
  'Ultimate Frisbee': 'YOUR_ULTIMATEFRISBEE_CHANNEL_ID',
  'Sepak Takraw': 'UCeY0bbntWzzVIaj2z3QigXg',
  Volleyball: 'YOUR_VOLLEYBALL_CHANNEL_ID',
  Badminton: 'UCAOtE1V7Ots4DjM8JLlrYgg',
  // Add more mappings as needed
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

const GameDetail = () => {
  const { state } = useLocation();
  const { game } = state;
  const [videoId, setVideoId] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const getLiveStream = async () => {
      const id = await fetchLiveStream(game.sport);
      setVideoId(id);
      setLoading(false); // Set loading to false after fetching the video ID
    };

    getLiveStream();
  }, [game.sport]);

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
        <p style={styles.cardText}>Venue: {game.venue}</p>
        <p style={styles.cardText}>Type: {game.type}</p>
        <p style={styles.cardText}>Date: {game.date}</p>
        <p style={styles.cardText}>
          Time: {game.startTime} - {game.endTime}
        </p>
      </div>
      {loading ? (
        <p style={styles.loading}>Loading live stream...</p>
      ) : videoId ? (
        <iframe
          style={styles.iframe}
          src={`https://www.youtube.com/embed/${videoId}`}
          allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
          allowFullScreen
        ></iframe>
      ) : (
        <p>No live stream available.</p>
      )}
    </div>
  );
};

export default GameDetail;
