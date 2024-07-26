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
    matriculationNumber: '',
    dateOfBirth: '',
    medicalHistory: '',
    drugAllergies: '',
    bloodType: '',
    parQ: 'N', // Default to 'N'
    emergencyContactName: '',
    emergencyContactNumber: '',
  });

  const [parQAnswers, setParQAnswers] = useState({
    parQ1: 'N',
    parQ2: 'N',
    parQ3: 'N',
    parQ4: 'N',
    parQ5: 'N',
    parQ6: 'N',
    parQ7: 'N',
    parQ8: 'N',
    // Add more questions here
  });

  const [nricError, setNricError] = useState('');
  const [matriculationNumberError, setMatriculationNumberError] = useState('');
  const [submitError, setSubmitError] = useState('');
  const [successMessage, setSuccessMessage] = useState('');

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prevData) => ({
      ...prevData,
      [name]: value,
    }));
    // Reset errors when the user starts typing
    if (name === 'nric' && value.length === 4) {
      setNricError('');
    }
    if (name === 'matriculationNumber' && /^[aA].{8}$/.test(value)) {
      setMatriculationNumberError('');
    }
  };

  const handleParQChange = (e) => {
    const { name, value } = e.target;
    setParQAnswers((prevAnswers) => ({
      ...prevAnswers,
      [name]: value,
    }));
    // Determine the value of parQ based on all answers
    const allNo = Object.values({ ...parQAnswers, [name]: value }).every(
      (answer) => answer === 'N'
    );
    setFormData((prevData) => ({
      ...prevData,
      parQ: allNo ? 'Y' : 'N',
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    // Check if NRIC is exactly 4 characters
    if (formData.nric.length !== 4) {
      setNricError('NRIC must be exactly 4 characters long.');
      return;
    }
    // Check if matriculation number is valid
    if (!/^[aA].{8}$/.test(formData.matriculationNumber)) {
      setMatriculationNumberError(
        'Matriculation number must start with "A" or "a" and be exactly 9 characters long.'
      );
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
          <label className="block text-sm font-medium">
            NRIC/ Passport Number (Last 4 Characters)
          </label>
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
            Matriculation Number
          </label>
          <input
            type="text"
            name="matriculationNumber"
            value={formData.matriculationNumber}
            onChange={handleChange}
            className="bg-orange-200 w-full p-2 border border-gray-300 rounded"
            required
          />
          {matriculationNumberError && (
            <p className="text-red-500 text-sm mt-1">
              {matriculationNumberError}
            </p>
          )}
        </div>
        <div>
          <label className="block text-sm font-medium">Date of Birth</label>
          <input
            type="date"
            name="dateOfBirth"
            value={formData.dateOfBirth}
            onChange={handleChange}
            className="bg-orange-200 w-full p-2 border border-gray-300 rounded"
            required
          />
        </div>
        <div>
          <label className="block text-sm font-medium">Medical History</label>
          <textarea
            name="medicalHistory"
            value={formData.medicalHistory}
            onChange={handleChange}
            className="bg-orange-200 w-full p-2 border border-gray-300 rounded"
            required
          />
        </div>
        <div>
          <label className="block text-sm font-medium">Drug Allergies</label>
          <textarea
            name="drugAllergies"
            value={formData.drugAllergies}
            onChange={handleChange}
            className="bg-orange-200 w-full p-2 border border-gray-300 rounded"
            required
          />
        </div>
        <div>
          <label className="block text-sm font-medium">Blood Type</label>
          <input
            type="text"
            name="bloodType"
            value={formData.bloodType}
            onChange={handleChange}
            className="bg-orange-200 w-full p-2 border border-gray-300 rounded"
            required
          />
        </div>
        <div>
          <label className="block text-sm font-medium">PAR-Q</label>
          <div className="space-y-2">
            <label className="block text-sm font-medium">
              Has a doctor ever said that you have a heart condition and that
              you should only do physical activity recommended by a doctor?
              <input
                type="radio"
                name="parQ1"
                value="Y"
                onChange={handleParQChange}
                className="ml-2"
                required
              />{' '}
              Yes
              <input
                type="radio"
                name="parQ1"
                value="N"
                onChange={handleParQChange}
                className="ml-2"
                required
              />{' '}
              No
            </label>
            <label className="block text-sm font-medium">
              Do you feel pain in your chest when you do physical activity?
              <input
                type="radio"
                name="parQ2"
                value="Y"
                onChange={handleParQChange}
                className="ml-2"
                required
              />{' '}
              Yes
              <input
                type="radio"
                name="parQ2"
                value="N"
                onChange={handleParQChange}
                className="ml-2"
                required
              />{' '}
              No
            </label>
            <label className="block text-sm font-medium">
              In the past month, have you had chest pain when you were not doing
              physical activity?
              <input
                type="radio"
                name="parQ3"
                value="Y"
                onChange={handleParQChange}
                className="ml-2"
                required
              />{' '}
              Yes
              <input
                type="radio"
                name="parQ3"
                value="N"
                onChange={handleParQChange}
                className="ml-2"
                required
              />{' '}
              No
            </label>
            <label className="block text-sm font-medium">
              Do you lose your balance because of dizziness or do you ever lose
              consciousness?
              <input
                type="radio"
                name="parQ4"
                value="Y"
                onChange={handleParQChange}
                className="ml-2"
                required
              />{' '}
              Yes
              <input
                type="radio"
                name="parQ4"
                value="N"
                onChange={handleParQChange}
                className="ml-2"
                required
              />{' '}
              No
            </label>
            <label className="block text-sm font-medium">
              Do you have a bone or joint problem that could be made worse by a
              change in your physical activity?
              <input
                type="radio"
                name="parQ5"
                value="Y"
                onChange={handleParQChange}
                className="ml-2"
                required
              />{' '}
              Yes
              <input
                type="radio"
                name="parQ5"
                value="N"
                onChange={handleParQChange}
                className="ml-2"
                required
              />{' '}
              No
            </label>
            <label className="block text-sm font-medium">
              Is your doctor currently prescribing drugs (for example, water
              pills) for your blood pressure or heart condition?
              <input
                type="radio"
                name="parQ6"
                value="Y"
                onChange={handleParQChange}
                className="ml-2"
                required
              />{' '}
              Yes
              <input
                type="radio"
                name="parQ6"
                value="N"
                onChange={handleParQChange}
                className="ml-2"
                required
              />{' '}
              No
            </label>
            <label className="block text-sm font-medium">
              Do you know of any other reasons why you should not do physical
              activity?
              <input
                type="radio"
                name="parQ7"
                value="Y"
                onChange={handleParQChange}
                className="ml-2"
                required
              />{' '}
              Yes
              <input
                type="radio"
                name="parQ7"
                value="N"
                onChange={handleParQChange}
                className="ml-2"
                required
              />{' '}
              No
            </label>
            <label className="block text-sm font-medium">
              Do you currently participate in any regular activity program
              designed to improve or maintain your physical fitness?
              <input
                type="radio"
                name="parQ8"
                value="Y"
                onChange={handleParQChange}
                className="ml-2"
                required
              />{' '}
              Yes
              <input
                type="radio"
                name="parQ8"
                value="N"
                onChange={handleParQChange}
                className="ml-2"
                required
              />{' '}
              No
            </label>
            {/* Add more PAR-Q questions similarly */}
          </div>
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
