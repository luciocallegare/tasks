require('dotenv').config()
const app = require('express')()
const port = process.env.PORT
const bodyParser = require('body-parser')
const mongoose = require('mongoose')
const Functions = require('./utils/functions')
const Validator = require('./utils/errorHandling')

mongoose.connect(process.env.DB_CONNECTION)

app.use(bodyParser.json())
app.listen(port,()=>{
    console.log('App listening at port ',port)
})

app.use(Validator.checkToken)
app.get('/tasks/:id?', async (req,res) => res.send(Functions.getTasks(req.params?.id)))

app.use(Validator.checkParams)
app.put('/tasks/:id?',async (req,res)=> res.send(Functions.modifyTask(req.params?.id,req.body)))
app.delete('/tasks/:id?',async (req,res)=> res.send(Functions.deleteTask(req.params?.id)))

app.use(Validator.checkBody)
app.post('/tasks', async (req,res)=> res.send(Functions.addTask(req.body)))