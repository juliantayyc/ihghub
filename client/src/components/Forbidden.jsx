import React from 'react';
import { useNavigate } from 'react-router-dom';

const Forbidden = () => {
  const navigate = useNavigate();

  const handleGoHome = () => {
    navigate('/');
  };

  return (
    <div className="flex flex-col items-center justify-center min-h-screen">
      <h1 className="text-6xl font-bold text-n-1 mb-4">Unauthorized</h1>
      <p className="text-xl text-n-2 mb-8">
        You do not have permission to access this page.
      </p>
      <button
        onClick={handleGoHome}
        className="px-6 py-3 bg-color-3 text-white font-semibold rounded-lg shadow-md hover:bg-color-1 transition duration-200"
      >
        Go Home
      </button>
    </div>
  );
};

export default Forbidden;
