import { useEffect, useState } from 'react';
import client from '../../utils/MeiliSearchClient';
import Papa from 'papaparse'

const useMeiliUtils = (selectedIndex) => {
  const [indexName, setIndexName] = useState('');
  const [bookCSV, setBookCSV] = useState('');
  const [primaryKey, setPrimaryKey] = useState('id');
  const [tasks, setTasks] = useState([]);
  const [filter, setFilter] = useState('');
  const [generalStats, setGeneralStats] = useState({});
  const [indexStats, setIndexStats] = useState({});
  const [healthStatus, setHealthStatus] = useState('checking'); // 'checking', 'available', 'unavailable'
  const [indexSettings, setIndexSettings] = useState({});
  const [filterableAttributes, setFilterableAttributes] = useState([]);

  const createIndex = async () => {
    try {
      await client.createIndex(indexName, { primaryKey: primaryKey });
      alert('Index created successfully');
      fetchTasks();
    } catch (error) {
      alert('Failed to create index');
    }
  };

  const addBook = (file, indexName) => {
    Papa.parse(file, {
      complete: function(results) {
        const documents = results.data;
        client.index(indexName).addDocuments(documents)
          .then(() => {
            alert('Book added successfully');
            fetchTasks();
          })
          .catch((error) => {
            console.error('Failed to add book:', error);
            alert('Failed to add book');
          });
      },
      header: true
    });
  }

  const fetchTasks = async () => {
    try {
      const tasksResponse = await client.getTasks();
      setTasks(tasksResponse.results);
    } catch (error) {
      alert('Failed to fetch tasks');
    }
  };

  const deleteIndex = async (index) => {
    try {
      await client.deleteIndex(index);
      alert('Index deleted successfully');
      fetchTasks();
    } catch (error) {
      alert('Failed to delete index');
    }
  };

  const deleteAllDocuments = async (index) => {
    try {
      await client.index(index).deleteAllDocuments();
      alert('All documents deleted successfully');
      fetchTasks();
    } catch (error) {
      alert('Failed to delete documents');
    }
  };

  {/*To Be determined in advanced version later.*/}
  const deleteFilteredDocuments = async () => {
    try {
      await client.index(indexName).deleteDocuments({ filter: filter });
      alert('Filtered documents deleted successfully');
      fetchTasks();
    } catch (error) {
      alert('Failed to delete filtered documents');
    }
  };

  const fetchHealthStatus = async () => {
    try {
      const health = await client.health();
      setHealthStatus(health.status === 'available' ? 'available' : 'unavailable');
    } catch (error) {
      setHealthStatus('unavailable');
    }
  };

  const fetchStats = async (index) => {
    if (index) {
      const indexStats = await client.index(index).getStats();
      setIndexStats({ [index]: indexStats });
    } else {
      const generalStats = await client.getStats();
      setGeneralStats(generalStats);
    }
  };

  const fetchIndexSettings = async (index) => {
    const settings = await client.index(index).getSettings();
    setIndexSettings(settings);
  };

  const fetchFilterableAttributes = async (index) => {
    const attributes = await client.index(index).getFilterableAttributes();
    setFilterableAttributes(attributes);
  };

  const updateFilters = async (index, fields = ['fiction', 'type', 'subtype', 'pubyear', 'id', 'title', 'author']) => {
    // Ensure only allowed fields are updated
    const allowedFields = ['fiction', 'type', 'subtype', 'pubyear', 'id', 'title', 'author'];
    const filteredFields = fields.filter(field => allowedFields.includes(field));
  
    await client.index(index).updateFilterableAttributes(filteredFields);
    fetchFilterableAttributes(index);
  };

  useEffect(() => {
    fetchHealthStatus();
    if (selectedIndex) {
      fetchStats();
      fetchIndexSettings();
      fetchFilterableAttributes();
    }
  }, [selectedIndex]);


  return {
    indexName,
    setIndexName,
    addBook,
    bookCSV,
    setBookCSV,
    primaryKey,
    setPrimaryKey,
    tasks,
    filter,
    setFilter,
    createIndex,
    fetchTasks,
    deleteIndex,
    deleteAllDocuments,
    deleteFilteredDocuments,
    generalStats,
    indexStats,
    healthStatus,
    indexSettings,
    filterableAttributes,
    fetchHealthStatus,
    fetchStats,
    fetchIndexSettings,
    fetchFilterableAttributes,
    updateFilters,
  };
};

export default useMeiliUtils;