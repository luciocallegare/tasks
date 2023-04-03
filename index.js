require('dotenv').config()
const app = require('express')()
const port = process.env.PORT
const bodyParser = require('body-parser')
const mongoose = require('mongoose')
const Functions = require('./utils/functions')
const Validator = require('./utils/validator')
const Middlewares = require('./utils/middlewares')

mongoose.connect(process.env.DB_CONNECTION)

app.use(bodyParser.json())
const server = app.listen(port,()=>{
    console.log('App listening at port ',port)
})

//Manejo de usuarios
app.post('/signup',
        Validator.createUserBodyChecks,
        Validator.checkUserExists, 
        Validator.checkResult,
        async (req,res) => res.send(await Functions.signUp(req.body)),
    )
app.post('/login',
        Validator.createUserBodyChecks,
        Validator.checkUserLogin,
        Validator.checkResult,
        Functions.sendToken
    )

//Manejo de datos
app.use(Validator.checkToken)
app.get('/tasks/:id?', 
        Validator.createGetParamChecks,
        Validator.checkResult,
        Middlewares.getTasks
    )
app.put('/tasks/:id?',
        Validator.createParamsChecks,
        Validator.createBodyNotEmpty,
        Validator.checkResult,
        Middlewares.modifyTask
    )
app.delete('/tasks/:id?',
        Validator.createParamsChecks,
        Validator.checkResult,
        Middlewares.deleteTask
    )
app.post('/tasks',
        Validator.createBodyChecks,
        Validator.checkResult,
        async (req,res)=> res.send(await Functions.addTask(req.body))
    )
app.use(Validator.checkNOTFOUND)

module.exports = {app,server}