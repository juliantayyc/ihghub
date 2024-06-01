import { useState, useEffect } from 'react';
import Profiles from './Profiles';
import Button from './Button';
import axios from 'axios';
import { APP_SERVER_URL } from '../constants';
import { halls } from '../constants/database'; // Import the halls data

const Leaderboard = () => {
  const [selectedSex, setSelectedSex] = useState('All');
  const [leaderboard, setLeaderboard] = useState([]);

  useEffect(() => {
    fetchLeaderboard();
  }, []);

  const fetchLeaderboard = async () => {
    try {
      const response = await axios.get(
        `${APP_SERVER_URL}/leaderboardData/totals`
      );
      console.log('Fetched leaderboard data:', response.data); // Log the fetched data
      const updatedLeaderboard = halls.map((hall) => ({
        ...hall,
        scoreM: response.data[hall.name]?.M || 0,
        scoreF: response.data[hall.name]?.F || 0,
      }));
      console.log('Updated leaderboard:', updatedLeaderboard); // Log the updated leaderboard
      setLeaderboard(updatedLeaderboard);
    } catch (error) {
      console.error('There was an error fetching the leaderboard data!', error);
    }
  };

  const handleClick = (e) => {
    setSelectedSex(e.currentTarget.dataset.id);
  };

  return (
    <div
      id="leaderboard"
      className="container"
      style={{ scrollMarginTop: '120px' }}
    >
      <div className="relative z-1 flex flex-col items-center mb-10 mt-10 p-8 border border-n-1/10 rounded-3xl overflow-hidden lg:p-20 bg-color-3 bg-opacity-10">
        <h1 className="h1">Leaderboard</h1>
        <div className="mt-8">
          <Button
            className="items-center px-10 text-lg w-60 h-1/2"
            onClick={handleClick}
            dataId="All"
            px="px-20"
          >
            Overall
          </Button>
          <Button
            className="items-center px-10 text-lg w-60 h-1/2"
            onClick={handleClick}
            dataId="M"
            px="px-20"
          >
            Male
          </Button>
          <Button
            className="items-center px-10 text-lg w-60 h-1/2"
            onClick={handleClick}
            dataId="F"
            px="px-20"
          >
            Female
          </Button>
        </div>
        <Profiles
          leaderboard={sortLeaderboard(leaderboard, selectedSex)}
          sex={selectedSex}
        />
      </div>
    </div>
  );
};

const sortLeaderboard = (data, sex) => {
  return data.sort((a, b) => {
    let scoreA =
      sex === 'All'
        ? a.scoreM + a.scoreF
        : a[sex === 'M' ? 'scoreM' : 'scoreF'];
    let scoreB =
      sex === 'All'
        ? b.scoreM + b.scoreF
        : b[sex === 'M' ? 'scoreM' : 'scoreF'];
    return scoreB - scoreA;
  });
};

export default Leaderboard;
