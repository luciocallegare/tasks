require('dotenv').config()
const app = require('express')()
const port = process.env.PORT
const bodyParser = require('body-parser')
const mongoose = require('mongoose')
const Functions = require('./utils/functions')
const Validator = require('./utils/validator')

mongoose.connect(process.env.DB_CONNECTION)

app.use(bodyParser.json())
app.listen(port,()=>{
    console.log('App listening at port ',port)
})

app.use(Validator.checkUserBody)
app.post('/signup',Validator.checkUser, async (req,res) => res.send(await Functions.signUp(req.body)))
app.post('/login',Validator.checkUserLogin)

app.use(Validator.checkToken)
app.get('/tasks/:id?', async (req,res) => res.send(await Functions.getTasks(req.params?.id)))

app.use(Validator.checkParams)
app.put('/tasks/:id?',async (req,res)=> res.send(await Functions.modifyTask(req.params?.id,req.body)))
app.delete('/tasks/:id?',async (req,res)=> res.send(await Functions.deleteTask(req.params?.id)))

app.use(Validator.checkBody)
app.post('/tasks', async (req,res)=> res.send(await Functions.addTask(req.body)))