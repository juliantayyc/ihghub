import React, { useState, useEffect } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import axios from 'axios';
import { APP_SERVER_URL } from '../constants';

const SubmitLineUps = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const { fixtureId, team1, team2 } = location.state;

  const [hall, setHall] = useState('');
  const [registrations, setRegistrations] = useState([]);
  const [lineUps, setLineUps] = useState([]);
  const [successMessage, setSuccessMessage] = useState('');
  const [errorMessage, setErrorMessage] = useState('');

  const getHallOptions = () => {
    if (team1 === 'All' && team2 === 'All') {
      return ['TH', 'EH', 'KR', 'SH', 'RH', 'KE'];
    }
    return [team1, team2].filter((team) => team !== 'All');
  };

  const handleHallChange = async (e) => {
    const selectedHall = e.target.value;
    setHall(selectedHall);

    try {
      const response = await axios.get(
        `${APP_SERVER_URL}/registrationsData/${fixtureId}/${selectedHall}`
      );
      setRegistrations(response.data);
      setLineUps(
        response.data.map((registration) => ({
          registrationId: registration.id,
          role: 'substitute',
          jerseyNumber: '',
          ivp: 'N',
        }))
      );
    } catch (error) {
      console.error('Error fetching registrations:', error);
      setErrorMessage('Error fetching registrations.');
    }
  };

  const handleInputChange = (index, name, value) => {
    const updatedLineUps = [...lineUps];
    updatedLineUps[index][name] = value;
    setLineUps(updatedLineUps);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    const successEntries = [];
    const failedEntries = [];

    try {
      await Promise.all(
        lineUps.map(async (lineUp) => {
          try {
            await axios.post(`${APP_SERVER_URL}/lineUpsData`, {
              ...lineUp,
              fixtureId,
            });
            successEntries.push(lineUp.registrationId);
          } catch (error) {
            failedEntries.push(lineUp.registrationId);
          }
        })
      );

      if (successEntries.length > 0 && failedEntries.length === 0) {
        setSuccessMessage('Line-Ups Submitted!');
        setErrorMessage('');
      } else if (successEntries.length > 0 && failedEntries.length > 0) {
        const successMatricNumbers = registrations
          .filter((reg) => successEntries.includes(reg.id))
          .map((reg) => reg.matriculationNumber);
        const failedMatricNumbers = registrations
          .filter((reg) => failedEntries.includes(reg.id))
          .map((reg) => reg.matriculationNumber);
        setSuccessMessage(
          `Line-Up submitted for ${successMatricNumbers.join(
            ', '
          )} but failed for ${failedMatricNumbers.join(', ')}`
        );
        setErrorMessage('');
      } else {
        setErrorMessage('Error submitting line-ups.');
        setSuccessMessage('');
      }
    } catch (error) {
      console.error('Error submitting line-ups:', error);
      setErrorMessage('Error submitting line-ups.');
      setSuccessMessage('');
    }
  };

  return (
    <div className="container mx-auto my-10">
      <h2 className="text-2xl font-bold mb-5">Submit Line-Ups</h2>
      <form
        onSubmit={handleSubmit}
        className="space-y-4"
      >
        <div>
          <label className="block text-sm font-medium">Select Hall</label>
          <select
            name="hall"
            value={hall}
            onChange={handleHallChange}
            className="bg-orange-200 w-full p-2 border border-gray-300 rounded"
            required
          >
            <option value="">Select Hall</option>
            {getHallOptions().map((hallOption) => (
              <option
                key={hallOption}
                value={hallOption}
              >
                {hallOption}
              </option>
            ))}
          </select>
        </div>

        {registrations.length > 0 && (
          <>
            <h3 className="text-xl font-bold mb-5">Players</h3>
            <div className="overflow-x-auto">
              <table className="min-w-full bg-white">
                <thead>
                  <tr>
                    <th className="px-4 py-2">Name</th>
                    <th className="px-4 py-2">Matriculation Number</th>
                    <th className="px-4 py-2">Starter/Substitute</th>
                    <th className="px-4 py-2">Jersey Number</th>
                    <th className="px-4 py-2">IVP</th>
                  </tr>
                </thead>
                <tbody>
                  {registrations.map((registration, index) => (
                    <tr
                      key={registration.id}
                      className="border-t"
                    >
                      <td className="px-4 py-2">{registration.name}</td>
                      <td className="px-4 py-2">
                        {registration.matriculationNumber}
                      </td>
                      <td className="px-4 py-2">
                        <div className="flex gap-4">
                          <label className="flex items-center">
                            <input
                              type="radio"
                              name={`role-${registration.id}`}
                              value="starter"
                              checked={lineUps[index].role === 'starter'}
                              onChange={(e) =>
                                handleInputChange(index, 'role', e.target.value)
                              }
                              className="mr-2"
                            />
                            Starter
                          </label>
                          <label className="flex items-center">
                            <input
                              type="radio"
                              name={`role-${registration.id}`}
                              value="substitute"
                              checked={lineUps[index].role === 'substitute'}
                              onChange={(e) =>
                                handleInputChange(index, 'role', e.target.value)
                              }
                              className="mr-2"
                            />
                            Substitute
                          </label>
                        </div>
                      </td>
                      <td className="px-4 py-2">
                        <input
                          type="number"
                          value={lineUps[index].jerseyNumber}
                          onChange={(e) =>
                            handleInputChange(
                              index,
                              'jerseyNumber',
                              e.target.value
                            )
                          }
                          className="bg-orange-200 w-full p-2 border border-gray-300 rounded"
                          required
                        />
                      </td>
                      <td className="px-4 py-2">
                        <div className="flex gap-4">
                          <label className="flex items-center">
                            <input
                              type="radio"
                              name={`ivp-${registration.id}`}
                              value="Y"
                              checked={lineUps[index].ivp === 'Y'}
                              onChange={(e) =>
                                handleInputChange(index, 'ivp', e.target.value)
                              }
                              className="mr-2"
                            />
                            Yes
                          </label>
                          <label className="flex items-center">
                            <input
                              type="radio"
                              name={`ivp-${registration.id}`}
                              value="N"
                              checked={lineUps[index].ivp === 'N'}
                              onChange={(e) =>
                                handleInputChange(index, 'ivp', e.target.value)
                              }
                              className="mr-2"
                            />
                            No
                          </label>
                        </div>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
            <button
              type="submit"
              className="bg-blue-500 text-white p-3 rounded-lg mt-4"
            >
              Submit
            </button>
            {successMessage && (
              <p
                className={`mt-3 ${successMessage.includes('but failed') ? 'text-blue-500' : 'text-green-500'}`}
              >
                {successMessage}
              </p>
            )}
            {errorMessage && (
              <p className="text-red-500 mt-3">{errorMessage}</p>
            )}
          </>
        )}
      </form>
    </div>
  );
};

export default SubmitLineUps;
