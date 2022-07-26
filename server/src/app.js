const express = require('express');
const path = require('path');
const cors = require('cors');
const morgan = require('morgan');
const app = express();
const planetsRouter = require('./routes/planets/planets.router');
const launchsRouter = require('../src/routes/launches/launches.router');

app.use(cors({
  origin: 'http://localhost:3000'
}));
app.use(morgan('combined'));

app.use(express.json());
app.use(express.static(path.join(__dirname, "..", "public")));

app.use('/planets', planetsRouter);
app.use('/launches', launchsRouter);
app.get('/*', (req, res) => {
  return res.sendFile(path.join(__dirname, "..", "public", "index.html"));
});

module.exports = app;