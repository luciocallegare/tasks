
const Functions = require('./functions')

const getTasks = async (req,res,next) => {
    try{
        res.send(await Functions.getTasks(req.params?.id))
    } catch (err){
        next(err)
    }
}

const modifyTask = async (req,res,next) => {
    try{
        res.send(await Functions.modifyTask(req.params?.id,req.body))
    } catch (err){
        next(err)
    }
}

const deleteTask = async (req,res,next) => {
    try{
        res.send(await Functions.deleteTask(req.params?.id))
    } catch (err){
        next(err)
    }
}

module.exports = { getTasks,modifyTask,deleteTask }