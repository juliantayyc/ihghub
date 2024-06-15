import { useState } from 'react';
import axios from 'axios';

function Login() {
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');

  const login = () => {
    const data = { username: username, password: password };
    axios.post('http://localhost:3001/auth/login', data).then((response) => {
      console.log(response.data);
    });
  };

  return (
    <div className="flex justify-center items-center min-h-screen bg-n-8">
      <div className="bg-orange-100 p-8 rounded-lg shadow-md w-full max-w-md">
        <h2 className="text-2xl font-semibold text-center text-gray-700 mb-6">
          Login
        </h2>

        <div className="mb-4">
          <label
            className="block text-gray-600 mb-1"
            htmlFor="username"
          >
            Username:
          </label>
          <input
            type="text"
            id="username"
            onChange={(event) => setUsername(event.target.value)}
            className="w-full px-4 py-2 bg-orange-200 text-black rounded focus:outline-none focus:ring-2 focus:ring-blue-500"
            placeholder="(Ex. John123...)"
          />
        </div>

        <div className="mb-6">
          <label
            className="block text-gray-600 mb-1"
            htmlFor="password"
          >
            Password:
          </label>
          <input
            type="password"
            id="password"
            onChange={(event) => setPassword(event.target.value)}
            className="w-full px-4 py-2 bg-orange-200 text-black rounded focus:outline-none focus:ring-2 focus:ring-blue-500"
            placeholder="Your Password..."
          />
        </div>

        <button
          onClick={login}
          className="w-full py-2 bg-blue-400 text-black font-semibold rounded hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-500"
        >
          Login
        </button>
      </div>
    </div>
  );
}

export default Login;
