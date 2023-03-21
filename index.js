require('dotenv').config()
const app = require('express')()
const port = process.env.PORT
const bodyParser = require('body-parser')
const mongoose = require('mongoose')

mongoose.connect(process.env.DB_CONNECTION)
app.use(bodyParser.json())


app.get('/tasks/:id?')
app.put('/tasks/:id?')
app.delete('/tasks/:id?')
app.post('/tasks')