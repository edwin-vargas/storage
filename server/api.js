const express = require('express')
const PORT = process.env.PORT ?? 1234
const crypto = require('node:crypto')
const cors = require('cors')

const bodyParser = require("body-parser")
const dotenv = require("dotenv")
const path = require("path")
const multer = require("multer")
const { S3Client, PutObjectCommand, DeleteObjectCommand, GetObjectCommand, ListObjectsV2Command, CopyObjectCommand } = require("@aws-sdk/client-s3")
const { getSignedUrl } = require("@aws-sdk/s3-request-presigner")

dotenv.config()

const app = express()
app.use(express.json())
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
app.disable('x-powered-by')

const s3 = new S3Client({
  region: "auto",
  endpoint: process.env.R2_ENDPOINT,
  credentials: {
      accessKeyId: process.env.AWS_ACCESS_KEY_ID,
      secretAccessKey: process.env.AWS_SECRET_ACCESS_KEY,
  },
});

//const upload = multer({ storage: multer.memoryStorage() });

const BUCKET_NAME = process.env.R2_BUCKET_NAME;

app.get("/", (req, res) => {
  res.sendFile(path.join(__dirname, "..", "client", "json-file-convert.html"));
});

app.post("/file", async (req, res) => {
  const { folder, fileName, content } = req.body;

  const params = {
      Bucket: BUCKET_NAME,
      Key: `${folder}/${fileName}`,
      Body: JSON.stringify(content),
      ContentType: "application/json",
  };

  try {
      const command = new PutObjectCommand(params);
      await s3.send(command);
      res.status(201).send({ message: "File created successfully" });
  } catch (error) {
      res.status(500).send({ error: error.message });
  }
});

app.listen(PORT, () => {
    console.log(`server listenig on port http://localhost:${PORT}`)
})
