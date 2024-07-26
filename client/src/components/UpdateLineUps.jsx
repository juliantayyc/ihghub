import React, { useState, useEffect } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import axios from 'axios';
import { APP_SERVER_URL } from '../constants';

const UpdateLineUps = () => {
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
    }
  };

  const handleInputChange = (index, name, value) => {
    const updatedLineUps = [...lineUps];
    updatedLineUps[index][name] = value;
    setLineUps(updatedLineUps);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    const errorEntries = [];

    try {
      await Promise.all(
        lineUps.map(async (lineUp) => {
          try {
            await axios.put(
              `${APP_SERVER_URL}/lineUpsData/${lineUp.registrationId}`,
              {
                ...lineUp,
                fixtureId,
              }
            );
          } catch (error) {
            errorEntries.push(lineUp.registrationId);
          }
        })
      );

      if (errorEntries.length === 0) {
        setSuccessMessage('Line-Ups Updated Successfully!');
      } else {
        setErrorMessage('Error updating line-ups');
      }
    } catch (error) {
      console.error('Error updating line-ups:', error);
      setErrorMessage('Error updating line-ups');
    }
  };

  return (
    <div className="container mx-auto my-10">
      <h2 className="text-2xl font-bold mb-5">Update Line-Ups</h2>
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
              Update
            </button>
            {successMessage && (
              <p className="text-green-500 mt-3">{successMessage}</p>
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

export default UpdateLineUps;
