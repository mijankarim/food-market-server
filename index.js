const express = require('express')
const app = express()
const port = 5050;
require('dotenv').config();

app.get('/', (req, res) => {
  res.send('Hello World Server site')
})

console.log(process.env.DB_USER);

app.listen(port, () => {
  console.log(`Example app listening at http://localhost:${port}`)
})