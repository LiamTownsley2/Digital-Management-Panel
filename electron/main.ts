import { app, BrowserWindow } from 'electron'
import path from 'node:path'

const mongo = require('mongodb');
const express = require('express');
const cors = require('cors');
const bodyParser = require('body-parser')

const server = express();
server.use(cors());
server.use(bodyParser.json())
server.use(bodyParser.urlencoded({ extended: false }))

const uri = 'mongodb+srv://uni-project:9rT5qBAsDfGQgGOg@cluster0.vz4azvs.mongodb.net/?retryWrites=true&w=majority'; // Replace with your MongoDB connection string
const client = new mongo.MongoClient(uri);

let database: any;

export async function connectToMongoDB() {
  if (!database) {
    try {
      await client.connect();
      console.log('Connected to MongoDB');
      const _db = client.db('uni-project');

      database = _db;
      return _db;
    } catch (err) {
      console.error('Error connecting to MongoDB:', err);
    }
  } else {
    console.log('Connected to running MongoDB conn')
    return database;
  }
}

server.get('/api/assets', async (_: any, res: any) => {
  const db = await connectToMongoDB();
  const collection = db.collection('assets');

  const data = await collection.find().toArray();
  res.json(data);
});

server.delete('/api/delete-all-assets', async (_: any, res: any) => {
  const db = await connectToMongoDB();
  const collection = db.collection('assets');

  await collection.deleteMany({});
  res.json({ "status": true });
})

server.post('/api/assets', async (req: any, res: any) => {
  let _data = req.body;
  const db = await connectToMongoDB();
  const collection = db.collection('assets');

  const data = collection.insertOne(_data)
})

// The built directory structure
//
// ├─┬─┬ dist
// │ │ └── index.html
// │ │
// │ ├─┬ dist-electron
// │ │ ├── main.js
// │ │ └── preload.js
// │
process.env.DIST = path.join(__dirname, '../dist')
process.env.VITE_PUBLIC = app.isPackaged ? process.env.DIST : path.join(process.env.DIST, '../public')


let win: BrowserWindow | null
// 🚧 Use ['ENV_NAME'] avoid vite:define plugin - Vite@2.x
const VITE_DEV_SERVER_URL = process.env['VITE_DEV_SERVER_URL']

function createWindow() {
  win = new BrowserWindow({
    icon: path.join(process.env.VITE_PUBLIC, 'electron-vite.svg'),
    webPreferences: {
      preload: path.join(__dirname, 'preload.js'),
    },
  })

  // win.removeMenu();

  // Test active push message to Renderer-process.
  win.webContents.on('did-finish-load', () => {
    win?.webContents.send('main-process-message', (new Date).toLocaleString())
  })

  if (VITE_DEV_SERVER_URL) {
    win.loadURL(VITE_DEV_SERVER_URL)
  } else {
    // win.loadFile('dist/index.html')
    win.loadFile(path.join(process.env.DIST, 'index.html'))
  }
}

// Quit when all windows are closed, except on macOS. There, it's common
// for applications and their menu bar to stay active until the user quits
// explicitly with Cmd + Q.
app.on('window-all-closed', () => {
  if (process.platform !== 'darwin') {
    app.quit()
    win = null
  }
})

app.on('activate', () => {
  // On OS X it's common to re-create a window in the app when the
  // dock icon is clicked and there are no other windows open.
  if (BrowserWindow.getAllWindows().length === 0) {
    createWindow()
  }
})

app.on('ready', () => {
  server.listen(3001, () => {
    console.log('Server is running on port 3001');
  });
})

app.whenReady().then(createWindow)
