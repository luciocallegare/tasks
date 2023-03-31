const {Schema,model} = require('mongoose')

const taskSchema = new Schema({
    name: String,
    description: String,
    completed: { type: Boolean, default: false },
    createdBy: String,
    createdAt: Date,
    lastUpdatedBy: String,
    lastUpdatedAt: Date
})

taskSchema.set('toJSON',{
    transform: (document,returnedObject)=>{
        returnedObject.id = returnedObject._id
        delete returnedObject._id
        delete returnedObject.__v
    }
})

const Task = model('Task',taskSchema)

module.exports = Task