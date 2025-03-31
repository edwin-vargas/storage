const express = require('express')
const app = express()
const PORT = process.env.PORT ?? 3344

app.get('/', (req, res) => {
    res.send('<h1>Cloud Storage</h1><p>Pending name</p>')
})

app.listen(PORT, () => {
    console.log(`server listenig on port http://localhost:${PORT}`)
})
