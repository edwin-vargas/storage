//import zone
const express = require('express')
const path = require('path')
const cors = require('cors')
const sqlite = require('node:sqlite')
const crypto = require('node:crypto')
const PORT = process.env.PORT ?? 1234
const dotenv = require("dotenv")
const { S3Client, PutObjectCommand, DeleteObjectCommand, GetObjectCommand, ListObjectsCommand, CopyObjectCommand } = require("@aws-sdk/client-s3")
const { getSignedUrl } = require("@aws-sdk/s3-request-presigner")
const publicDirectoryPath = path.join(__dirname, '..', 'client')
dotenv.config()

//server init
const app = express()
app.disable('x-powered-by')
app.use(express.json())
app.use(express.static(publicDirectoryPath))
app.use(cors({
    origin: (origin, callback) => {
      const ACCEPTED_ORIGINS = [
        'http://localhost:8080',
        'http://localhost:1234'
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

//Cloudflare R2 connection
const s3 = new S3Client({
  region: "auto",
  endpoint: process.env.R2_ENDPOINT,
  credentials: {
      accessKeyId: process.env.AWS_ACCESS_KEY_ID,
      secretAccessKey: process.env.AWS_SECRET_ACCESS_KEY,
  },
});
const BUCKET_NAME = process.env.R2_BUCKET_NAME;
// Helper to convert S3 streams to strings
const streamToString = async (stream) => {
  const chunks = [];
  for await (const chunk of stream) {
      chunks.push(chunk);
  }
  return Buffer.concat(chunks).toString("utf-8");
};

//API
app.get("/", (req, res) => {
  res.sendFile(path.join(publicDirectoryPath, "inicio.html"));
});

app.post("/file", async (req, res) => {
  const { userName, fileName, fileB64 } = req.body;
  const params = {
      Bucket: BUCKET_NAME,
      Key: `${userName}/${fileName}`,
      Body: JSON.stringify(fileB64),
      ContentType: "application/json",
  };
  try {
      const command = new PutObjectCommand(params);
      await s3.send(command);
      res.status(201).send({ message: "File saved successfully :)" });
  } catch (error) {
      res.status(500).send({ error: error.message });
  }
});

app.get("/file", async (req, res) => {
  const { userName, fileName } = req.query;

  if (!userName || !fileName) {
    return res.status(400).send({ error: "Missing userName or fileName" });
  }

  const params = {
    Bucket: BUCKET_NAME,
    Key: `${userName}/${fileName}`,
  };

  try {
    const command = new GetObjectCommand(params);
    const data = await s3.send(command);
    const content = await streamToString(data.Body);

    res.status(200).json({ content: JSON.parse(content) });
  } catch (error) {
    res.status(500).send({ error: error.message });
  }
});

app.get("/files/:userName", async (req, res) => {
  const { userName } = req.params;
  
  const params = {
    Bucket: "storage", // your bucket name
    Prefix: `frida`, // Specify the user’s directory
  };
  
  try {
    const command = new ListObjectsCommand(params);
    console.log('command >> ', command)
    const { Contents } = await s3.send(command);

    if (Contents && Contents.length > 0) {
      // Extract the file names (Keys) from the list of objects
      const fileNames = Contents.map(item => item.Key);
      res.status(200).send({ files: fileNames });
    } else {
      res.status(404).send({ message: "No files found for this user" });
    }
  } catch (error) {
    res.status(500).send({ error: error.message });
  }
});

app.listen(PORT, () => {
    console.log(`server listenig on port http://localhost:${PORT}`)
})
