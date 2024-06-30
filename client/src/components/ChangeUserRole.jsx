import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { APP_SERVER_URL } from '../constants';
import api from '../util/axiosInstance';

const styles = {
  container: {
    padding: '20px',
    textAlign: 'center',
    fontSize: '20px',
  },
  form: {
    display: 'flex',
    flexDirection: 'column',
    alignItems: 'center',
    gap: '20px',
  },
  input: {
    padding: '10px',
    fontSize: '16px',
    borderRadius: '5px',
    border: '1px solid #ccc',
    width: '300px',
    backgroundColor: '#E0F2FE',
  },
  button: {
    padding: '10px 20px',
    fontSize: '16px',
    borderRadius: '5px',
    border: 'none',
    backgroundColor: '#4CAF50',
    color: 'white',
    cursor: 'pointer',
  },
  message: {
    marginTop: '20px',
    fontSize: '16px',
    color: 'green',
  },
  error: {
    marginTop: '20px',
    fontSize: '16px',
    color: 'red',
  },
};

const ChangeUserRole = () => {
  const [users, setUsers] = useState([]);
  const [selectedUser, setSelectedUser] = useState('');
  const [selectedRole, setSelectedRole] = useState('');
  const [message, setMessage] = useState('');
  const [error, setError] = useState('');

  useEffect(() => {
    const fetchUsers = async () => {
      try {
        const response = await api.get(`${APP_SERVER_URL}/users/all`);
        setUsers(response.data);
      } catch (error) {
        setError('Error fetching users');
      }
    };
    fetchUsers();
  }, []);

  const handleUserChange = (e) => {
    setSelectedUser(e.target.value);
  };

  const handleRoleChange = (e) => {
    setSelectedRole(e.target.value);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!selectedUser || !selectedRole) {
      setError('Please select a user and a role');
      return;
    }
    try {
      await api.put(`${APP_SERVER_URL}/users/role/${selectedUser}`, {
        role: selectedRole,
      });
      setMessage('User role updated successfully');
      setError('');
    } catch (error) {
      setError('Error updating user role');
    }
  };

  return (
    <div style={styles.container}>
      <h1>Change User Role</h1>
      <form
        style={styles.form}
        onSubmit={handleSubmit}
      >
        <select
          style={styles.input}
          value={selectedUser}
          onChange={handleUserChange}
        >
          <option value="">Select User</option>
          {users.map((user) => (
            <option
              key={user.id}
              value={user.id}
            >
              {user.username} ({user.email})
            </option>
          ))}
        </select>
        <select
          style={styles.input}
          value={selectedRole}
          onChange={handleRoleChange}
        >
          <option value="">Select Role</option>
          <option value="user">User</option>
          <option value="manager">Manager</option>
          <option value="official">Official</option>
          <option value="admin">Admin</option>
        </select>
        <button
          type="submit"
          style={styles.button}
        >
          Change Role
        </button>
      </form>
      {message && <p style={styles.message}>{message}</p>}
      {error && <p style={styles.error}>{error}</p>}
    </div>
  );
};

export default ChangeUserRole;
