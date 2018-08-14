const express = require('express');
const bodyParser = require('body-parser');

const qvalia = require('./routes/api/qvalia');
const exp = require('./routes/api/exp');

const app = express();

// Body Parser Config for post call
app.use(bodyParser.json({ limit: '50mb' })); // support json encoded bodies
app.use(bodyParser.urlencoded({ extended: true, limit: '50mb' })); // support encoded bodies

app.get('/', (req, res) => {
  res.send('index');
});

app.get('/api', (req, res) => {
  res.send('api route');
});

// Use routes
app.use('/api/qvalia', qvalia);
app.use('/api/exp', exp);

const port = process.env.PORT || 5000;

app.listen(port, () => console.log(`Server running on ${port}`));
