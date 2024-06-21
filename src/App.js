import React, { useState } from 'react';
import axios from 'axios';
import './App.css';

function App() {
  const [query, setQuery] = useState('');
  const [results, setResults] = useState([]);
  const [error, setError] = useState('');

  const executeQuery = async () => {
    try {
      const response = await axios.post('http://localhost:3001/execute-query', { query });
      setResults(response.data);
      setError('');
    } catch (err) {
      setError(err.response.data.error);
      setResults([]);
    }
  };

  return (
    <div className="App">
      <header className="App-header">
        <h1>Query Optimization Interface</h1>
      </header>
      <main>
        <textarea
          value={query}
          onChange={(e) => setQuery(e.target.value)}
          placeholder="Enter your SQL query here"
          rows="10"
          cols="50"
        />
        <button onClick={executeQuery}>Execute Query</button>
        {error && <p className="error">{error}</p>}
        <table>
          <thead>
            <tr>
              {results.length > 0 && Object.keys(results[0]).map((key) => (
                <th key={key}>{key}</th>
              ))}
            </tr>
          </thead>
          <tbody>
            {results.map((row, index) => (
              <tr key={index}>
                {Object.values(row).map((value, i) => (
                  <td key={i}>{value}</td>
                ))}
              </tr>
            ))}
          </tbody>
        </table>
      </main>
    </div>
  );
}

export default App;
