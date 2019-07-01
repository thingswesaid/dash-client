const express = require('express');
const http = require('http');
const path = require('path');

const app = express();
const port = process.env.PORT || '8080';
const server = http.createServer(app);

app.use(express.static(path.join(__dirname, '../build')));

app.get('/ping', (req, res) => {
  res.send("PONG")
});

app.get('/*', (req, res) => {
  res.sendFile(path.join(__dirname, '../build/index.html'), (err) => {
    if (err) {
      res.status(500).send(err);
    }
  });
});

server.listen(port, () => {
  console.log('>>>>>>>> PORT <<<<<<<<<', port);
  console.log(`Running on localhost:${port}`)
});
