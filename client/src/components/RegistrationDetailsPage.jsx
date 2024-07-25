import React, { useState, useEffect } from 'react';
import api from '../util/axiosInstance';
import { useLocation } from 'react-router-dom';
import { APP_SERVER_URL } from '../constants';

const RegistrationDetailsPage = () => {
  const location = useLocation();
  const { fixture } = location.state || {}; // Get fixture from state
  const [registrations, setRegistrations] = useState([]);
  const [loading, setLoading] = useState(true);
  const [hallCounts, setHallCounts] = useState({});
  const [error, setError] = useState('');

  useEffect(() => {
    if (fixture) {
      const fetchRegistrations = async () => {
        try {
          const response = await api.get(
            `${APP_SERVER_URL}/registrationsData/${fixture.id}`
          );
          const registrationsData = response.data;
          setRegistrations(registrationsData);

          // Count registrations by hall
          const counts = registrationsData.reduce((acc, reg) => {
            acc[reg.hall] = (acc[reg.hall] || 0) + 1;
            return acc;
          }, {});
          setHallCounts(counts);
        } catch (error) {
          console.error('Error fetching registration data:', error);
        } finally {
          setLoading(false);
        }
      };

      fetchRegistrations();
    }
  }, [fixture]);

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

      <div className="max-h-[60vh] overflow-y-auto mb-6">
        {registrations.length > 0 ? (
          <table className="min-w-full divide-y divide-gray-200">
            <thead className="bg-gray-50">
              <tr>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Name
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  NRIC
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Hall
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
              {registrations.map((registration, index) => (
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
          <p>No registrations found for this fixture.</p>
        )}
      </div>

      <div>
        <h3 className="text-xl font-semibold mb-4">Registration Forms Count</h3>
        <ul>
          {Object.keys(hallCounts).map((hall) => (
            <li
              key={hall}
              className="mb-2"
            >
              <span className="font-medium">{hall}:</span> {hallCounts[hall]}{' '}
              form(s)
            </li>
          ))}
        </ul>
      </div>
    </div>
  );
};

export default RegistrationDetailsPage;
