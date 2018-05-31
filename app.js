const express = require('express');
const bodyParser = require('body-parser');
const path = require('path');
const http = require('http');
const app = express();
const sessions = require('express-session');
// API file for interacting with MongoDB
const api = require('./server/routes/api');


// Parsers
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: false}));
app.use(sessions({
  secret: 'poasd67asd54as6ds213asd',
  resave: false,
  saveUninitialized: true
}));

// Angular DIST output folder
app.use(express.static(path.join(__dirname, 'client')));
app.use('/bower_components', express.static(path.join(__dirname, 'bower_components')));

// API location
app.use('/', api);

// Send all other requests to the Angular app
app.get('*', (req, res) => {
  res.sendFile(path.join(__dirname, 'client/main.html'));
});

//Set Port
const port = process.env.PORT || '3000';
app.set('port', port);

const server = http.createServer(app);

server.listen(port, () => console.log(`Running on localhost:${port}`));
