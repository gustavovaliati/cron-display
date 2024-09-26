const { app, BrowserWindow, Menu, shell } = require('electron');
const { autoUpdater } = require('electron-updater');
const log = require('electron-log');
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
        },
        webPreferences: {
            nodeIntegration: true,
            contextIsolation: false
        }
    });

    // Carregar a página HTML
    win.loadFile('index.html');

    // Check for updates
    autoUpdater.checkForUpdatesAndNotify();
}

// Setup logging for auto-updates
autoUpdater.logger = log;
autoUpdater.logger.transports.file.level = 'info';

// Create a custom menu
const createMenu = () => {
    const menu = Menu.buildFromTemplate([
        {
            label: 'Open',
            submenu: [
                {
                    label: 'Controller',
                    click: () => {
                        // This will open the default browser with the specified URL
                        shell.openExternal('http://localhost:8085/control.html');
                    }
                },
                {
                    role: 'quit' // Adds a "Quit" option
                }
            ]
        },
        {
            label: 'Help',
            submenu: [
                {
                    label: 'About',
                    click: () => {
                        // Add an about section or custom action
                        console.log('About clicked');
                    }
                }
            ]
        }
    ]);
    Menu.setApplicationMenu(menu); // Apply the custom menu to the app
};

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

// Iniciar o servidor WebSocket e HTTP na porta 8085
httpServer.listen(8085, () => {
    console.log('Servidor WebSocket e HTTP rodando na porta 8085');
});

// Inicialize a aplicação Electron
app.whenReady().then(() => {
    createWindow();
    createMenu();
});

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
