import React from 'react';
import { useNavigate, useLocation } from 'react-router-dom';

const LineUpForms = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const { fixtureId, team1, team2 } = location.state;

  return (
    <div className="flex flex-col items-center p-6 text-center text-lg">
      <h2 className="text-2xl font-bold mb-5">Choose an Action</h2>
      <div className="flex flex-col items-center gap-6 mt-5">
        <button
          className="px-8 py-4 rounded-lg bg-white text-black border border-gray-300 text-lg hover:bg-gray-100 transition-colors duration-300"
          onClick={() =>
            navigate('/submitLineUps', {
              state: { fixtureId, team1, team2 },
            })
          }
        >
          Submit Line-Ups
        </button>
        <button
          className="px-8 py-4 rounded-lg bg-white text-black border border-gray-300 text-lg hover:bg-gray-100 transition-colors duration-300"
          onClick={() =>
            navigate('/updateLineUps', { state: { fixtureId, team1, team2 } })
          }
        >
          Update Line-Ups
        </button>
      </div>
    </div>
  );
};

export default LineUpForms;
