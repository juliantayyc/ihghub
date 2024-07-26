import React from 'react';
import { useNavigate, useLocation } from 'react-router-dom';

const RegistrationForms = () => {
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
            navigate('/submitRegistrationForm', {
              state: { fixtureId, team1, team2 },
            })
          }
        >
          Submit Registration Form
        </button>
        <button
          className="px-8 py-4 rounded-lg bg-white text-black border border-gray-300 text-lg hover:bg-gray-100 transition-colors duration-300"
          onClick={() =>
            navigate('/updateRegistrationForm', {
              state: { fixtureId, team1, team2 },
            })
          }
        >
          Update Registration Form
        </button>
      </div>
    </div>
  );
};

export default RegistrationForms;
