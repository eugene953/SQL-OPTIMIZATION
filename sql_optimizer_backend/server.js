const express = require('express');
const mysql = require('mysql');
const bodyParser = require('body-parser');
const cors = require('cors');

const app = express();
const port = 3001;

app.use(cors());
app.use(bodyParser.json());

// Create connection to MySQL database
const db = mysql.createConnection({
  host: 'localhost',
  user: 'root',
  password: 'eugene545',
  database: 'query_optimization'
});

db.connect(err => {
  if (err) {
    console.error('Error connecting to the database:', err);
    return;
  }
  console.log('Connected to the MySQL database.');
});

// Function to provide basic optimization suggestions
const getOptimizationSuggestions = (query) => {
  const suggestions = [];
  if (!query.toLowerCase().includes('limit')) {
    suggestions.push('Consider using LIMIT to reduce the result set size.');
  }
  if (query.toLowerCase().includes('select *')) {
    suggestions.push('Avoid using SELECT *. Specify the columns you need.');
  }
  // Add more suggestions based on common optimization techniques
  return suggestions;
};

// Route to execute a SQL query
app.post('/execute-query', (req, res) => {
  const { query } = req.body;
  const startTime = process.hrtime();

  db.query(query, (error, results) => {
    const endTime = process.hrtime(startTime);
    const executionTime = (endTime[0] * 1e9 + endTime[1]) / 1e6; // Convert to milliseconds

    if (error) {
      return res.status(500).json({ error: error.message });
    }

    const suggestions = getOptimizationSuggestions(query);
    res.json({ results, executionTime, suggestions });
  });
});

app.listen(port, () => {
  console.log(`Server running on port ${port}`);
});
