"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
require("dotenv/config");
require('dotenv').config();
const electron_1 = require("electron");
function createWindow() {
    const win = new electron_1.BrowserWindow({
        width: 800,
        height: 600,
        webPreferences: {
            nodeIntegration: true,
        },
    });
    return win;
}
electron_1.app
    .whenReady()
    .then(() => {
    const window = createWindow();
    if (process.env.NODE_ENV == "production") {
        window.loadFile('./html/index.html');
    }
    else {
        window.loadFile('../html/index.html');
    }
});
electron_1.app
    .on('activate', () => {
    if (electron_1.BrowserWindow.getAllWindows().length === 0) {
        createWindow();
    }
});
electron_1.app
    .on('window-all-closed', () => {
    if (process.platform !== 'darwin') {
        electron_1.app.quit();
    }
});
