// Serveur WebSocket simple pour chat direct
const WebSocket = require('ws');
const wss = new WebSocket.Server({ port: 3001 });

wss.on('connection', function connection(ws) {
  ws.on('message', function incoming(message) {
    // Diffuse à tous les clients connectés
    wss.clients.forEach(function each(client) {
      if (client.readyState === WebSocket.OPEN) {
        client.send(message);
      }
    });
  });
});

console.log('Serveur WebSocket de chat lancé sur ws://localhost:3001');
