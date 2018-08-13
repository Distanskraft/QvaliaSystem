const express = require('express');
const bodyParser = require('body-parser');

const qvalia = require('./routes/api/qvalia');

const app = express();

// Bodyparser middleware
app.use(bodyParser.urlencoded({ extended: false }));
app.use(bodyParser.json());

app.get('/', (req, res) => {
  res.send('index');
});

app.get('/api', (req, res) => {
  res.send('api route');
});

// Use routes
app.use('/api/qvalia', qvalia);

const port = process.env.PORT || 5000;

app.listen(port, () => console.log(`Server running on ${port}`));
