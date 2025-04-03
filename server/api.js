//import zone
const express = require('express')
const path = require('path')
const cors = require('cors')
const PORT = process.env.PORT ?? 3000
const publicDirectoryPath = path.join(__dirname, '..', 'client')

//server init
const app = express()
app.disable('x-powered-by')
app.use(express.json())
app.use(express.static(publicDirectoryPath))
app.use(cors());

//API
app.get("/", (req, res) => {
  res.sendFile(path.join(publicDirectoryPath, "inicio.html"));
});

app.post("/file", async (req, res) => {
  res.status('200').send("up file");
});

app.listen(PORT, () => {
    console.log(`server listenig on port http://localhost:${PORT}`)
})
