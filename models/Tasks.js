const {Schema,model} = require('mongoose')

const taskSchema = new Schema({
    name: String,
    description: String,
    completed: { type: Boolean, default: false }
})

taskSchema.set('toJSON',{
    transform: (document,returnedObject)=>{
        returnedObject.id = returnedObject._id
        delete returnedObject._id
        delete returnedObject.__v
        delete returnedObject.passwordHash        
    }
})

const Task = model('Task',taskSchema)

module.exports = Task