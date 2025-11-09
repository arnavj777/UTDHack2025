/**
 * Example: How to use the API service in your components
 * 
 * This file shows examples of how to connect your frontend components
 * to the Django backend API.
 */

import { api } from './api';
import { authService } from './auth';
import { API_ENDPOINTS } from '../config/api';

// Example 1: Using the auth service
export async function exampleLogin() {
  try {
    const response = await authService.login({
      email: 'user@example.com',
      password: 'password123'
    });
    console.log('Login successful:', response);
    return response;
  } catch (error) {
    console.error('Login failed:', error);
    throw error;
  }
}

// Example 2: Using the generic API service
export async function exampleGetData() {
  try {
    const data = await api.get(API_ENDPOINTS.HELLO);
    console.log('API response:', data);
    return data;
  } catch (error) {
    console.error('API call failed:', error);
    throw error;
  }
}

// Example 3: Creating a custom API call
export async function exampleCustomEndpoint() {
  try {
    // When you create new endpoints in Django, use them like this:
    const data = await api.post('/your-endpoint/', {
      field1: 'value1',
      field2: 'value2'
    });
    return data;
  } catch (error) {
    console.error('Custom endpoint failed:', error);
    throw error;
  }
}

// Example 4: Using in a React component
/*
import { useState } from 'react';
import { api } from '../services/api';
import { API_ENDPOINTS } from '../config/api';

export function MyComponent() {
  const [data, setData] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  const fetchData = async () => {
    setLoading(true);
    setError(null);
    try {
      const result = await api.get(API_ENDPOINTS.HELLO);
      setData(result);
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div>
      <button onClick={fetchData}>Fetch Data</button>
      {loading && <p>Loading...</p>}
      {error && <p>Error: {error}</p>}
      {data && <pre>{JSON.stringify(data, null, 2)}</pre>}
    </div>
  );
}
*/

