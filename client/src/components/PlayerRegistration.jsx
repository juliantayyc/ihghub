import React, { useState } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import axios from 'axios';
import { APP_SERVER_URL } from '../constants';

const PlayerRegistration = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const { fixtureId, team1, team2 } = location.state;

  const [formData, setFormData] = useState({
    name: '',
    nric: '',
    hall: '',
    emergencyContactName: '',
    emergencyContactNumber: '',
  });

  const [nricError, setNricError] = useState('');
  const [submitError, setSubmitError] = useState('');
  const [successMessage, setSuccessMessage] = useState('');

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prevData) => ({
      ...prevData,
      [name]: value,
    }));
    // Reset NRIC error when the user starts typing
    if (name === 'nric' && value.length === 4) {
      setNricError('');
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    // Check if NRIC is exactly 4 characters
    if (formData.nric.length !== 4) {
      setNricError('NRIC must be exactly 4 characters long.');
      return;
    }
    try {
      await axios.post(`${APP_SERVER_URL}/registrationsData`, {
        ...formData,
        fixtureId,
      });
      setSuccessMessage('Registration successful!');
      setSubmitError(''); // Clear any previous errors
    } catch (error) {
      console.error('Error submitting registration:', error);
      setSubmitError('There was an error submitting the registration.');
      setSuccessMessage(''); // Clear any previous success messages
    }
  };

  const getHallOptions = () => {
    if (team1 === 'All' && team2 === 'All') {
      return ['TH', 'EH', 'KR', 'SH', 'RH', 'KE'];
    }
    return [team1, team2].filter((team) => team !== 'All');
  };

  return (
    <div className="container mx-auto my-10">
      <h2 className="text-2xl font-bold mb-5">Registration Form</h2>
      <form
        onSubmit={handleSubmit}
        className="space-y-4"
      >
        <div>
          <label className="block text-sm font-medium">Name</label>
          <input
            type="text"
            name="name"
            value={formData.name}
            onChange={handleChange}
            className="bg-orange-200 w-full p-2 border border-gray-300 rounded"
            required
          />
        </div>
        <div>
          <label className="block text-sm font-medium">NRIC</label>
          <input
            type="text"
            name="nric"
            value={formData.nric}
            onChange={handleChange}
            className="bg-orange-200 w-full p-2 border border-gray-300 rounded"
            required
          />
          {nricError && (
            <p className="text-red-500 text-sm mt-1">{nricError}</p>
          )}
        </div>
        <div>
          <label className="block text-sm font-medium">Hall</label>
          <select
            name="hall"
            value={formData.hall}
            onChange={handleChange}
            className="bg-orange-200 w-full p-2 border border-gray-300 rounded"
            required
          >
            <option value="">Select Hall</option>
            {getHallOptions().map((hall) => (
              <option
                key={hall}
                value={hall}
              >
                {hall}
              </option>
            ))}
          </select>
        </div>
        <div>
          <label className="block text-sm font-medium">
            Emergency Contact Name
          </label>
          <input
            type="text"
            name="emergencyContactName"
            value={formData.emergencyContactName}
            onChange={handleChange}
            className="bg-orange-200 w-full p-2 border border-gray-300 rounded"
            required
          />
        </div>
        <div>
          <label className="block text-sm font-medium">
            Emergency Contact Number
          </label>
          <input
            type="text"
            name="emergencyContactNumber"
            value={formData.emergencyContactNumber}
            onChange={handleChange}
            className="bg-orange-200 w-full p-2 border border-gray-300 rounded"
            required
          />
        </div>
        <div className="flex items-center">
          <button
            type="submit"
            className="bg-blue-500 text-white p-3 rounded-lg"
          >
            Submit
          </button>
          {submitError && (
            <p className="text-red-500 text-sm mt-1 ml-4">{submitError}</p>
          )}
        </div>
        {successMessage && (
          <p className="text-green-500 text-sm mt-4">{successMessage}</p>
        )}
      </form>
    </div>
  );
};

export default PlayerRegistration;
