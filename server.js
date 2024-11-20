const WebSocket = require('ws');

const wss = new WebSocket.Server({ port: 8080 });

let globalStartTime = null;

wss.on('connection', (ws) => {
    if (globalStartTime) {
        ws.send(JSON.stringify({ startTime: globalStartTime }));
    }

    ws.on('message', (message) => {
        const data = JSON.parse(message);
        
        if (data.type === 'start') {
            globalStartTime = Date.now();
            wss.clients.forEach((client) => {
                if (client.readyState === WebSocket.OPEN) {
                    client.send(JSON.stringify({ startTime: globalStartTime }));
                }
            });
        }

        if (data.type === 'reset') {
            globalStartTime = null;
            wss.clients.forEach((client) => {
                if (client.readyState === WebSocket.OPEN) {
                    client.send(JSON.stringify({ reset: true }));
                }
            });
        }
    });
});
