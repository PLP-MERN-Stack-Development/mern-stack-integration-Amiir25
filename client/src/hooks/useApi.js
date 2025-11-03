import { useState, useEffect } from 'react';
import axios from 'axios';

export const useApi = (endpoint) => {
  const [data, setData] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  const fetchData = async () => {
    setLoading(true);
    try {
      const res = await axios.get(endpoint);
      setData(res.data);
    } catch (err) {
      setError(err);
    } finally {
      setLoading(false);
    }
  };

  const createData = async (payload) => {
    try {
      const res = await axios.post(endpoint, payload);
      setData(prev => [...prev, res.data]);
      return res.data;
    } catch (err) {
      setError(err);
      throw err;
    }
  };

  const updateData = async (id, payload) => {
    try {
      const res = await axios.put(`${endpoint}/${id}`, payload);
      setData(prev => prev.map(item => item._id === id ? res.data : item));
      return res.data;
    } catch (err) {
      setError(err);
      throw err;
    }
  };

  const deleteData = async (id) => {
    try {
      await axios.delete(`${endpoint}/${id}`);
      setData(prev => prev.filter(item => item._id !== id));
    } catch (err) {
      setError(err);
      throw err;
    }
  };

  useEffect(() => { fetchData(); }, [endpoint]);

  return { data, loading, error, fetchData, createData, updateData, deleteData };
};
