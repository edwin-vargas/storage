//import zone
const express = require('express')
const fs = require('node:fs')
const path = require('path')
const cors = require('cors')
const PORT = process.env.PORT ?? 1234
const publicDirectoryPath = path.join(__dirname, '..', 'client')

//server init
const app = express()
app.disable('x-powered-by')
app.use(express.json({ limit: '10mb' }));
app.use(express.static(publicDirectoryPath))
app.use(cors({
    origin: (origin, callback) => {
      const ACCEPTED_ORIGINS = [
        'http://localhost:8080',
        'http://localhost:1234',
        'https://movies.com',
        'https://midu.dev'
      ]
  
      if (ACCEPTED_ORIGINS.includes(origin)) {
        return callback(null, true)
      }
  
      if (!origin) {
        return callback(null, true)
      }
  
      return callback(new Error('Not allowed by CORS'))
    }
  }))

const usersDir = path.join(__dirname, 'users');
if (!fs.existsSync(usersDir)) {
    fs.mkdirSync(usersDir, { recursive: true });
}

//API
app.get("/", (req, res) => {
  res.sendFile(path.join(publicDirectoryPath, "inicio.html"));
});

app.post('/file', (req, res) => {
    try {
        const { filename, fileData } = req.body;
        
        if (!filename || !fileData) {
            return res.status(400).json({ error: 'Missing filename or fileData' });
        }
        
        // Decode base64 data
        const buffer = Buffer.from(fileData, 'base64');
        
        // Save file in 'users' directory
        const filePath = path.join(usersDir, filename);
        fs.writeFileSync(filePath, buffer);
        
        res.json({ message: 'File uploaded successfully', filePath });
    } catch (error) {
        res.status(500).json({ error: 'Server error', details: error.message });
    }
});

app.listen(PORT, () => {
    console.log(`server listenig on port http://localhost:${PORT}`)
})
