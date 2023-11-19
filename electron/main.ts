// This file was partially generated by electron-vite package (2023)
// The automatically generated code will be surrounded by EQUAL signs.

const cors = require('cors');
const bodyParser = require('body-parser')
const express = require('express');
const server = express();

server.use(cors());
server.use(bodyParser.json())
server.use(bodyParser.urlencoded({ extended: false }))

import HardwareAssetRoutes from './api/routes/HardwareAssetRoutes';
import SoftwareAssetRoutes from './api/routes/SoftwareAssetRoutes';
import EmployeeRoutes from './api/routes/EmployeeRoutes';
import AssetLinkRoutes from './api/routes/AssetLinkRoutes';


server.use('/api/assets/hardware', HardwareAssetRoutes);
server.use('/api/assets/software', SoftwareAssetRoutes);
server.use('/api/asset-link', AssetLinkRoutes);
server.use('/api/employees', EmployeeRoutes);

// ========================  GENERATED CODE ========================
import { app, BrowserWindow, ipcMain } from 'electron'
import path from 'node:path'

process.env.DIST = path.join(__dirname, '../dist')
process.env.VITE_PUBLIC = app.isPackaged ? process.env.DIST : path.join(process.env.DIST, '../public')

let win: BrowserWindow | null
const VITE_DEV_SERVER_URL = process.env['VITE_DEV_SERVER_URL']

function createWindow() {
  win = new BrowserWindow({
    icon: path.join(__dirname, 'public', 'vite.svg'),
    webPreferences: {
      preload: path.join(__dirname, 'preload.js'),
    },
    width: 1500,
    height: 1000,
    show: false
  })

  // win.removeMenu();

  win.webContents.on('did-finish-load', () => {
    win?.webContents.send('main-process-message', (new Date).toLocaleString())
  })

  win.once('ready-to-show', () => {
    win?.show();
  });

  if (VITE_DEV_SERVER_URL) {
    win.loadURL(VITE_DEV_SERVER_URL)
  } else {
    win.loadFile(path.join(process.env.DIST!, 'index.html'))
  }
}

app.on('window-all-closed', () => {
  if (process.platform !== 'darwin') {
    app.quit()
    win = null
  }
})

app.on('activate', () => {
  if (BrowserWindow.getAllWindows().length === 0) {
    createWindow()
  }
})
// ======================= END OF GENERATED CODE ================================

app.whenReady().then(() => {
  const os = require('os');
  ipcMain.handle('get-data', () => {
    const data = {
      cpu: os.cpus()[0].model
    };
    console.log('ipc data ->', data)
    return data;
  })

  createWindow();
})

app.on('ready', () => {
  server.listen(3001, () => {
    console.log('Server is running on port 3001');
  });
})