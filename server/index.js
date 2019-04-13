// const express = require('express');
// const http = require('http');
// const path = require('path');

// let app = express();
// const port = process.env.PORT || '8080';
// const server = http.createServer(app);

// app.use(express.static(path.join(__dirname, '../build')));

// app.set('port', port);

// server.listen(port, () => console.log(`Running on localhost:${port}`));


const express = require('express');
const http = require('http');
const path = require('path');

const app = express();
const port = process.env.PORT || '8080';
const server = http.createServer(app);

app.use(express.static(path.join(__dirname, '../build')));

// Handles any requests that don't match the ones above
app.get('*', (req,res) =>{
    res.sendFile(path.join(__dirname+'../build/index.html'));
});

server.listen(port, () => console.log(`Running on localhost:${port}`));