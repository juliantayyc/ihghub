import React, { useState, useEffect } from 'react';
import api from '../util/axiosInstance';
import { useLocation } from 'react-router-dom';
import { APP_SERVER_URL } from '../constants';

const RegistrationDetailsPage = () => {
  const location = useLocation();
  const { fixture } = location.state || {}; // Get fixture from state
  const [registrations, setRegistrations] = useState([]);
  const [lineUps, setLineUps] = useState({});
  const [lineUpStats, setLineUpStats] = useState({});
  const [loading, setLoading] = useState(true);
  const [hallCounts, setHallCounts] = useState({});
  const [error, setError] = useState('');

  useEffect(() => {
    if (fixture) {
      const fetchData = async () => {
        try {
          // Fetch registrations
          const regResponse = await api.get(
            `${APP_SERVER_URL}/registrationsData/${fixture.id}`
          );
          const registrationsData = regResponse.data;
          setRegistrations(registrationsData);

          // Count registrations by hall
          const counts = registrationsData.reduce((acc, reg) => {
            acc[reg.hall] = (acc[reg.hall] || 0) + 1;
            return acc;
          }, {});
          setHallCounts(counts);

          // Create a map of registrationId to hall and other details
          const registrationIdToDetails = registrationsData.reduce(
            (acc, reg) => {
              acc[reg.id] = {
                hall: reg.hall,
                name: reg.name,
                matriculationNumber: reg.matriculationNumber,
                parQ: reg.parQ, // Include Par-Q for sorting
              };
              return acc;
            },
            {}
          );

          // Fetch line-ups data
          const lineUpsResponse = await api.get(
            `${APP_SERVER_URL}/lineUpsData/${fixture.id}`
          );
          const lineUpsData = lineUpsResponse.data;

          // Organize line-ups by hall and include name and matriculation number
          const lineUpsByHall = {};
          const statsByHall = {};

          lineUpsData.forEach((lineUp) => {
            const details = registrationIdToDetails[lineUp.registrationId];
            if (!details) return; // Skip if no details found

            const hall = details.hall;
            if (!lineUpsByHall[hall]) {
              lineUpsByHall[hall] = [];
              statsByHall[hall] = {
                total: 0,
                starters: 0,
                substitutes: 0,
                ivpStarters: 0,
                ivpSubstitutes: 0,
              };
            }

            lineUpsByHall[hall].push({
              ...lineUp,
              name: details.name,
              matriculationNumber: details.matriculationNumber,
            });

            // Update statistics
            statsByHall[hall].total += 1;
            if (lineUp.role === 'Starter') {
              statsByHall[hall].starters += 1;
              if (lineUp.ivp === 'Y') {
                statsByHall[hall].ivpStarters += 1;
              }
            } else if (lineUp.role === 'Substitute') {
              statsByHall[hall].substitutes += 1;
              if (lineUp.ivp === 'Y') {
                statsByHall[hall].ivpSubstitutes += 1;
              }
            }
          });

          setLineUps(lineUpsByHall);
          setLineUpStats(statsByHall);
        } catch (error) {
          console.error('Error fetching data:', error);
          setError('Failed to load data.');
        } finally {
          setLoading(false);
        }
      };

      fetchData();
    }
  }, [fixture]);

  const sortRegistrationsByHall = (registrations) => {
    // Group registrations by hall
    const groupedByHall = registrations.reduce((acc, reg) => {
      if (!acc[reg.hall]) {
        acc[reg.hall] = [];
      }
      acc[reg.hall].push(reg);
      return acc;
    }, {});

    // Sort registrations in each hall
    for (const hall in groupedByHall) {
      groupedByHall[hall] = groupedByHall[hall]
        .slice()
        .sort((a, b) => (a.parQ === 'N' ? -1 : b.parQ === 'N' ? 1 : 0));
    }

    return groupedByHall;
  };

  const sortedRegistrations = sortRegistrationsByHall(registrations);

  const sortLineUps = (lineUps) => {
    return lineUps.slice().sort((a, b) => {
      if (a.role !== b.role) {
        return a.role === 'Starter' ? -1 : 1;
      }
      if (a.ivp !== b.ivp) {
        return a.ivp === 'Y' ? -1 : 1;
      }
      return (a.jerseyNumber || 0) - (b.jerseyNumber || 0);
    });
  };

  if (loading) {
    return <div>Loading...</div>;
  }

  return (
    <div className="py-10 container mx-auto">
      <h2 className="text-2xl font-bold mb-5">
        Registration Data for {fixture?.sport} {fixture?.sex} {fixture?.team1}{' '}
        vs {fixture?.team2} on{' '}
        {new Date(fixture?.date).toLocaleDateString('en-GB')}
      </h2>

      <h3 className="text-xl font-semibold mb-4">Registration Forms</h3>

      {Object.keys(sortedRegistrations).map((hall) => (
        <div
          key={hall}
          className="mb-8"
        >
          <h4 className="text-lg font-semibold mb-2">{hall}</h4>

          <div className="max-h-[60vh] overflow-y-auto mb-6">
            {sortedRegistrations[hall].length > 0 ? (
              <table className="min-w-full divide-y divide-gray-200">
                <thead className="bg-gray-50">
                  <tr>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Name
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      NRIC/ Passport No.
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Hall
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Matriculation Number
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Date of Birth
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Medical History
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Drug Allergies
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Blood Type
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Par-Q
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Emergency Contact Name
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Emergency Contact Number
                    </th>
                  </tr>
                </thead>
                <tbody className="bg-white divide-y divide-gray-200">
                  {sortedRegistrations[hall].map((registration, index) => (
                    <tr key={index}>
                      <td className="px-6 py-4 whitespace-nowrap">
                        {registration.name}
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        {registration.nric}
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        {registration.hall}
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        {registration.matriculationNumber}
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        {registration.dateOfBirth}
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        {registration.medicalHistory}
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        {registration.drugAllergies}
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        {registration.bloodType}
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        {registration.parQ}
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        {registration.emergencyContactName}
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        {registration.emergencyContactNumber}
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            ) : (
              <p>No registrations found for this hall.</p>
            )}
          </div>
          <div className="mb-4">
            <h5 className="text-md font-semibold mb-2">
              Registration Forms Count for {hall}
            </h5>
            <ul>
              <li>
                <span className="font-medium">Total Registrations:</span>{' '}
                {hallCounts[hall] || 0}
              </li>
            </ul>
          </div>
        </div>
      ))}

      <div>
        <h3 className="text-xl font-semibold mb-4">Line-Up Details by Hall</h3>
        {Object.keys(lineUps).map((hall) => (
          <div
            key={hall}
            className="mb-8"
          >
            <h4 className="text-lg font-semibold mb-2">{hall}</h4>

            <div className="max-h-[60vh] overflow-y-auto mb-6">
              {lineUps[hall].length > 0 ? (
                <table className="min-w-full divide-y divide-gray-200">
                  <thead className="bg-gray-50">
                    <tr>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                        Name
                      </th>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                        Matriculation Number
                      </th>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                        Role
                      </th>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                        Jersey Number
                      </th>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                        IVP
                      </th>
                    </tr>
                  </thead>
                  <tbody className="bg-white divide-y divide-gray-200">
                    {sortLineUps(lineUps[hall]).map((lineUp, index) => (
                      <tr key={index}>
                        <td className="px-6 py-4 whitespace-nowrap">
                          {lineUp.name}
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap">
                          {lineUp.matriculationNumber}
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap">
                          {lineUp.role}
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap">
                          {lineUp.jerseyNumber}
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap">
                          {lineUp.ivp}
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              ) : (
                <p>No line-ups found for this hall.</p>
              )}
            </div>
            <div className="mb-4">
              <h5 className="text-md font-semibold mb-2">
                Line-Up Statistics for {hall}
              </h5>
              <ul>
                <li>
                  <span className="font-medium">Total Players:</span>{' '}
                  {lineUpStats[hall]?.total || 0}
                </li>
                <li>
                  <span className="font-medium">Starters:</span>{' '}
                  {lineUpStats[hall]?.starters || 0}
                </li>
                <li>
                  <span className="font-medium">Substitutes:</span>{' '}
                  {lineUpStats[hall]?.substitutes || 0}
                </li>
                <li>
                  <span className="font-medium">IVP Starters:</span>{' '}
                  {lineUpStats[hall]?.ivpStarters || 0}
                </li>
                <li>
                  <span className="font-medium">IVP Substitutes:</span>{' '}
                  {lineUpStats[hall]?.ivpSubstitutes || 0}
                </li>
              </ul>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default RegistrationDetailsPage;
