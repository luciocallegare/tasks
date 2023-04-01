const supertest = require('supertest')
const { app,server } = require('../index')
const jwt = require('jsonwebtoken')
const Task = require('../models/Tasks')
const mongoose = require('mongoose')

const api = supertest(app)
const closeConnection =async () => {
/*     await mongoose.disconnect()
 */    server.close()
}
const token = jwt.sign({ username: 'tester' },process.env.ACCESS_SECRET_TOKEN)

const cleanDB = async ()=>{
    await Task.deleteMany({})
}

const addExample = async () => {
    const taskExample = {
        name:'Test task',
        description: 'This task was created in an automated test'
    }
    return await Task(taskExample).save()
}

const populateDB = async (nTasks) => {

    for (let i =0 ; i<nTasks ; i++) {
        await Task({
            name: `Task nº${i}`,
            description: 'This task was created in an automated test'
        }).save()
    }
}

const getAllTasks = async ()=>{
    return await Task.find({})
}

module.exports = { 
    api,
    closeConnection,
    token,
    cleanDB,
    addExample,
    populateDB,
    getAllTasks
}

