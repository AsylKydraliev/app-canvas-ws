const express = require('express');
const app = express();
const cors = require('cors');
const {nanoid} = require("nanoid");
const ws = require('express-ws')(app);

const port = 8000;

const activeConnections = {};

app.ws('/canvas', function (ws, req) {
    const id = nanoid();
    console.log('client connected! id=', id);
    activeConnections[id] = ws;

    ws.on('close', (msg) => {
        console.log('client disconnected! id=', id);
        delete activeConnections[id];
    });
});

app.listen(port, () => {
    console.log(`App started on ${port} port!`);
})