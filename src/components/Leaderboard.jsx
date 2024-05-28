import { useState } from 'react';
import {halls} from '../constants/database';
import Profiles from './Profiles';
import Button from './Button';
import { data } from 'autoprefixer';

const Leaderboard = () => {
    const [selectedSex, setSelectedSex] = useState('All');
  
    const handleClick = (e) => {
      setSelectedSex(e.currentTarget.dataset.id);
    };
  
    return (
      <div id="leaderboard" className="container" style={{ scrollMarginTop: "120px" }}>
        <div className="relative z-1 flex flex-col items-center mb-10 mt-10 p-8 border border-n-1/10 rounded-3xl overflow-hidden lg:p-20 bg-purple-500 bg-opacity-10">
          <h1 className="h1">Leaderboard</h1>
          <div className="mt-8">
            <Button className="items-center px-10 text-lg w-60 h-1/2" onClick={handleClick} dataId="All" px="px-20">Overall</Button>
            <Button className="items-center px-10 text-lg w-60 h-1/2" onClick={handleClick} dataId="M" px="px-20">Male</Button>
            <Button className="items-center px-10 text-lg w-60 h-1/2" onClick={handleClick} dataId="F" px="px-20">Female</Button>
          </div>
          <Profiles Leaderboard={sortLeaderboard(halls, selectedSex)} sex={selectedSex} />
        </div>
      </div>
    );
  };
  

const sortLeaderboard = (data, sex) => {
    
    return data.sort((a, b) => {
        let scoreA = sex === 'All' ? a.score['M'] + a.score['F'] : a.score[sex];
        let scoreB = sex === 'All' ? b.score['M'] + b.score['F'] : b.score[sex];
        if (scoreA > scoreB) {
            return scoreB - scoreA;
        }
    })
}

export default Leaderboard; 