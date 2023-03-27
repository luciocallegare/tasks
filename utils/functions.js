const Tasks = require('../models/Tasks')
const mongoose = require('mongoose')
const ObjectId = mongoose.Types.ObjectId
const NOTFOUND_CODE = 'ERRNOTFOUND'
const jwt = require("jsonwebtoken")
const User = require('../models/Users')
const bcrypt = require('bcryptjs')

const getTasks = async (taskId) => {
    if (typeof taskId != 'undefined'){
        const tasks = await Tasks.findById(taskId)
        if (typeof tasks === 'undefined'){
            throw(NOTFOUND_CODE)
        }
        return tasks
    }
    return await Tasks.find({})
}

const modifyTask = async (taskId,mod) => {
    const modification =await Tasks.updateOne({_id:new ObjectId(taskId)},{$set:mod})
    if (modification.matchedCount === 0){
        throw(NOTFOUND_CODE)
    }
    const result = {
        status:'ok',
        message: 'Task modified successfully'
    }
    if (modification.modifiedCount === 0){
        result.message = 'No tasks modified through the command'
    }
    return result
}

const deleteTask = async (taskId) => {
    const deletion = await Tasks.deleteOne({_id:new ObjectId(taskId)})
    if (deletion.deletedCount === 0){
        throw(NOTFOUND_CODE)
    }
    return {
        status:'ok',
        message: 'Task deleted successfully'
    }
}

const addTask = async (task)=>{
    const taskSaved = await Tasks(task).save()
    return {
        message: 'Task saved successfully',
        status: 'ok',
        task: taskSaved
    }
}

const signUp = async (userObj) => {
    userObj.passwordHash = await bcrypt.hash(userObj.password,10)
    await User(userObj).save()
    return {
        message: 'User created successfully',
        status: 'ok'
    }
}

module.exports = {getTasks,modifyTask,deleteTask,addTask,signUp}