const { app, BrowserWindow } = require('electron');
const path = require('path');

// Criação do servidor WebSocket
const express = require('express');
const http = require('http');
const WebSocket = require('ws');

// Função para criar a janela do Electron
function createWindow() {
    const win = new BrowserWindow({
        width: 800,
        height: 600,
        webPreferences: {
            preload: path.join(__dirname, 'preload.js')
        }
    });

    // Carregar a página HTML
    win.loadFile('index.html');
}

// Criar o servidor HTTP para servir o WebSocket
const server = express();
const httpServer = http.createServer(server);
const wss = new WebSocket.Server({ server: httpServer });

// Serve a página control.html via Express
server.use(express.static(path.join(__dirname, 'public')));
const connectedClients = new Set();
// WebSocket endpoint
wss.on('connection', (ws) => {
    connectedClients.add(ws);
    console.log('Novo cliente WebSocket conectado');

    ws.on('message', (message) => {
        console.log(`Recebido: ${message}`);

        // Enviar a mensagem para todos os outros clientes conectados
        connectedClients.forEach((client) => {
            if (client !== ws && client.readyState === WebSocket.OPEN) {
                client.send(message);
            }
        });
    });

    // Remover o cliente da lista ao desconectar
    ws.on('close', () => {
        connectedClients.delete(ws);
        console.log('Cliente WebSocket desconectado');
    });
});

// Iniciar o servidor WebSocket e HTTP na porta 3000
httpServer.listen(3000, () => {
    console.log('Servidor WebSocket e HTTP rodando na porta 3000');
});

// Inicialize a aplicação Electron
app.whenReady().then(createWindow);

app.on('window-all-closed', () => {
    if (process.platform !== 'darwin') {
        app.quit();
    }
});

app.on('activate', () => {
    if (BrowserWindow.getAllWindows().length === 0) {
        createWindow();
    }
});
