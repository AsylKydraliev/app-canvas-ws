const express = require('express');
const cors = require('cors');
const { nanoid } = require('nanoid');
const app = express();
require('express-ws')(app);

const port = 8000;

app.use(cors());

const activeConnections = {};
const circleCoordinates = [];

app.ws('/canvas', function (ws, req) {
    const id = nanoid();
    activeConnections[id] = ws;

    ws.send(JSON.stringify({
        type: 'PREV_CIRCLES',
        coordinates: circleCoordinates
    }));

    ws.on('message', (msg) => {
        const decodedMessage = JSON.parse(msg);
        switch (decodedMessage.type) {
            case 'SEND_CIRCLE':
                Object.keys(activeConnections).forEach(id => {
                    const conn = activeConnections[id];
                    circleCoordinates.push(decodedMessage.coordinates);
                    conn.send(JSON.stringify({
                        type: 'NEW_CIRCLE',
                        circleCoordinates: decodedMessage.coordinates
                    }));
                });
                break;
            default:
                console.log('Unknown type!')
        }
    });

    ws.on('close', () => {
        console.log('Client disconnected!');
        delete activeConnections[id];
    });
});

app.listen(port, () => {
    console.log(`Server started on ${port} port!`);
});




