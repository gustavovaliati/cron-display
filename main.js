const { app, BrowserWindow, Menu, shell } = require('electron');
const { autoUpdater } = require('electron-updater');
const log = require('electron-log');
const path = require('path');

const express = require('express');
const http = require('http');
const WebSocket = require('ws');

function createWindow() {
    const mainWindow = new BrowserWindow({
        width: 800,
        height: 600,
        webPreferences: {
            preload: path.join(__dirname, 'preload.js'),
            nodeIntegration: true,
            contextIsolation: false
        },
        icon: path.join(__dirname, 'assets/icons/cron-display.png')
    });

    mainWindow.loadFile('index.html');

    mainWindow.webContents.on('before-input-event', (event, input) => {
        if (input.key === 'F11' && input.type === 'keyDown') {
            mainWindow.setFullScreen(!mainWindow.isFullScreen());
            event.preventDefault();
        }
    });

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
            label: 'Window',
            submenu: [
                {
                    label: 'Full Screen',
                    accelerator: 'F11',
                    click: () => {
                        mainWindow.setFullScreen(!mainWindow.isFullScreen());
                    }
                }
            ]
        },
        {
            label: 'Help',
            submenu: [
                {
                    label: 'About',
                    click: () => {
                        aboutWindow = new BrowserWindow({
                            width: 600,
                            height: 300,
                            title: 'About',
                            resizable: false,
                            minimizable: false,
                            maximizable: false,
                            alwaysOnTop: true,
                            webPreferences: {
                                nodeIntegration: true
                            }
                        });

                        aboutWindow.setMenu(null);

                        // Load the about.html file
                        aboutWindow.loadFile('about.html');

                        aboutWindow.on('closed', () => {
                            aboutWindow = null;
                        });
                    }
                }
            ]
        }
    ]);
    Menu.setApplicationMenu(menu); // Apply the custom menu to the app


    // Check for updates
    autoUpdater.checkForUpdatesAndNotify();
}

// Setup logging for auto-updates
autoUpdater.logger = log;
autoUpdater.logger.transports.file.level = 'info';


const server = express();
const httpServer = http.createServer(server);
const wss = new WebSocket.Server({ server: httpServer });

server.use(express.static(path.join(__dirname, 'public')));
const connectedClients = new Set();
wss.on('connection', (ws) => {
    connectedClients.add(ws);
    console.log('Novo cliente WebSocket conectado');

    ws.on('message', (message) => {
        console.log(`Recebido: ${message}`);

        connectedClients.forEach((client) => {
            if (client !== ws && client.readyState === WebSocket.OPEN) {
                client.send(message);
            }
        });
    });

    ws.on('close', () => {
        connectedClients.delete(ws);
        console.log('Cliente WebSocket desconectado');
    });
});

httpServer.listen(8085, () => {
    console.log('WebSocket and HTTP servers running on port 8085');
});

app.whenReady().then(() => {
    createWindow();
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
