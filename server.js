const express = require('express');
const mysql = require('mysql');
const cors = require('cors');
const http = require('http');
const socketIo = require('socket.io');

const app = express();
const server = http.createServer(app);
const io = socketIo(server);

app.use(cors()); 

const db = mysql.createConnection({
  host: 'localhost',
  user: 'root',
  password: 'teach',
  database: 'example' 
});

db.connect((err) => {
  if(err) {
    throw err;
  }
  console.log('Connected to database');
});

let marker1, marker2;

setInterval(() => {
  db.query("SELECT latitude, longitude FROM `Client Vehicle Table` WHERE `index`=1", function(err, results, fields) {
    if (err) {
      console.error('Error querying the database: ', err);
      return;
    }
    if (results.length > 0) {
      const location = results[0];
      io.emit('newLocation1', { latitude: location.latitude, longitude: location.longitude });
    }
  });

  db.query("SELECT latitude, longitude FROM `Client Vehicle Table` WHERE `index`=2", function(err, results, fields) {
    if (err) {
      console.error('Error querying the database: ', err);
      return;
    }
    if (results.length > 0) {
      const location = results[0];
      io.emit('newLocation2', { latitude: location.latitude, longitude: location.longitude });
    }
  });

  db.query("SELECT latitude, longitude FROM `Identified Objects Table`", function(err, results, fields) {
    if (err) {
      console.error('Error querying the database: ', err);
      return;
    }
    io.emit('newObjectLocations', results.map(location => ({ latitude: location.latitude, longitude: location.longitude })));
  });
}, 500); 

app.use(express.static(__dirname)); 

server.listen('3000', () => {
  console.log('Server started on port 3000');
});

