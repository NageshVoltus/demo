const express = require('express')
const app = express(express)

app.get('/', (req, res) => res.send("Hello world"))

app.listen(3030, () => console.log("Runing"))