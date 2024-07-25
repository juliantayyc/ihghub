import React from 'react';
import { useNavigate, useLocation } from 'react-router-dom';

const FormsPage = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const { fixtureId, team1, team2 } = location.state;

  return (
    <div className="flex flex-col items-center p-6 text-center text-lg">
      <h2 className="text-2xl font-bold mb-5">Choose a Form</h2>
      <div className="flex flex-col items-center gap-6 mt-5">
        <button
          className="px-8 py-4 rounded-lg bg-white text-black border border-gray-300 text-lg hover:bg-gray-100 transition-colors duration-300"
          onClick={() =>
            navigate('/registrationForm', {
              state: { fixtureId, team1, team2 },
            })
          }
        >
          Registration Form
        </button>
        <button
          className="px-8 py-4 rounded-lg bg-white text-black border border-gray-300 text-lg hover:bg-gray-100 transition-colors duration-300"
          onClick={() => navigate('/indemnity', { state: { fixtureId } })}
        >
          Indemnity Form
        </button>
      </div>
    </div>
  );
};

export default FormsPage;
