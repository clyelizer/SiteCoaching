// Serveur HTTP + WebSocket pour site statique + chat direct
const http = require('http');
const fs = require('fs');
const path = require('path');
const WebSocket = require('ws');
const nodemailer = require('nodemailer');
require('dotenv').config();

const PORT = 8080;
const WS_PORT = 3001;
const ROOT = __dirname;

// Transporteur nodemailer (à configurer dans .env)
const transporter = nodemailer.createTransport({
  host: process.env.SMTP_HOST,
  port: process.env.SMTP_PORT,
  secure: true,
  auth: {
    user: process.env.SMTP_USER,
    pass: process.env.SMTP_PASS
  }
});

function sendMailFromChat(message) {
  const msg = JSON.parse(message);
  transporter.sendMail({
    from: process.env.SMTP_USER,
    to: process.env.MAIL_TO,
    subject: 'Nouveau message du chat Arfaa Coaching',
    text: `Message: ${msg.text}\nDate: ${msg.timestamp}\nExpéditeur: ${msg.sender}`
  }, (err, info) => {
    if (err) console.error('Erreur envoi mail chat:', err);
  });
}

// Serveur HTTP pour les fichiers statiques
const server = http.createServer((req, res) => {
  let filePath = req.url === '/' ? '/main.html' : req.url;
  filePath = path.join(ROOT, filePath);
  fs.readFile(filePath, (err, data) => {
    if (err) {
      res.writeHead(404);
      res.end('Not found');
      return;
    }
    const ext = path.extname(filePath).toLowerCase();
    const mimeTypes = {
      '.html': 'text/html',
      '.js': 'application/javascript',
      '.css': 'text/css',
      '.png': 'image/png',
      '.jpg': 'image/jpeg',
      '.ico': 'image/x-icon'
    };
    res.writeHead(200, { 'Content-Type': mimeTypes[ext] || 'application/octet-stream' });
    res.end(data);
  });
});

server.listen(PORT, () => {
  console.log(`Serveur HTTP statique sur http://localhost:${PORT}`);
});

// Serveur WebSocket pour le chat
const wss = new WebSocket.Server({ port: WS_PORT });
wss.on('connection', function connection(ws) {
  ws.on('message', function incoming(message) {
    sendMailFromChat(message);
    wss.clients.forEach(function each(client) {
      if (client.readyState === WebSocket.OPEN) {
        client.send(message);
      }
    });
  });
});
console.log(`Serveur WebSocket de chat sur ws://localhost:${WS_PORT}`);
