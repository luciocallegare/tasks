const {body,header, validationResult, param } = require('express-validator')
const jwt = require("jsonwebtoken")
const User = require('../models/Users')
const bcrypt = require('bcryptjs')
const e = require('express')
const accessToken = process.env.ACCESS_SECRET_TOKEN

const createBodyChecks = [
    body('name').notEmpty().withMessage('Task needs a name'),
    body('description').notEmpty().withMessage('Please provide a description of the task')
]

const createBodyNotEmpty = [
    body('task').custom((value) => {
        if (!Object.keys(value).length) {
          throw new Error('Attributes to modify/add needed');
        }
        return true;
      }),
    body('task').isObject().withMessage('Body must be a JSON object'),
]

const createUserBodyChecks = [
    body('username')
        .notEmpty()
        .withMessage('Username needed'),
    body('password').notEmpty().withMessage('Password needed')
]

const checkUserExists = body('username')
    .custom(async (username) =>{
        const user = await User.findOne({username})
        if ( user !== null ){
            throw({ 
                error: "User already exists",
                status: 409
            })
        }
        return true
})

const createGetParamChecks = param('id')
    .if(value => typeof value !== 'undefined')
    .isMongoId().withMessage('Id should be a valid Mongo Id')

const createParamsChecks = [
    param('id').notEmpty().withMessage('Id needed'),
    param('id').isString().withMessage('Id should be String'),
    param('id').isMongoId().withMessage('Id should be a valid Mongo Id')
]

const forbiddenArgs = [
    body('createdBy').isEmpty().withMessage('Forbidden argument'),
    body('createdAt').isEmpty().withMessage('Forbidden argument'),
    body('lastUpdatedBy').isEmpty().withMessage('Forbidden argument'),
    body('lastUpdatedAt').isEmpty().withMessage('Forbidden argument'),
]

const checkResult = (req,res,next) => {
    const errors = validationResult(req)
    const errArray = errors.array()
    let status = errArray.find(e => e.msg.status)?.msg.status
    if (errArray?.[0]?.msg === 'Forbidden argument') {
        status = 401
    }
    if (!errors.isEmpty()) {
        return res.status(status || 400).json({ errors: errArray });
    }
    next()
}

const checkToken = header('authorization')
    .notEmpty()
    .withMessage('Authorization header missing')
    .custom((authHeader, { req }) => {
        const token = authHeader?.split(" ")[1]
        const task = Object.assign({},req.body)
        if (token == null) { 
            throw new Error("Token not present")
        }    
        jwt.verify(token, accessToken, (err, user) => {
            if (err) { 
                throw({
                    error: "Token invalid",
                    status: 403
                })
            }
            req.body.task = task
            req.body.payload = user
        })        
        return true
    })


const checkUserLogin = [
    body().custom(async body => {
        const {username,password} = body

        const user = await User.findOne({username})
    
        const passwordCorrect = user === null
        ? false
        : await bcrypt.compare(password, user.passwordHash)
        if (!(user && passwordCorrect)) {
            throw({ 
                error: 'invalid user or password',
                status: 401
            })
        }
        return true
    })
]

const checkNOTFOUND = (err,req,res,next) => {
    if (err === 'ERRNOTFOUND'){
        return res.status(404).json({
            msg: 'Task not found',
            param: "id",
            location: 'params'
        })
    }
}

module.exports = {
    checkResult,
    checkToken,
    checkUserExists,
    checkUserLogin,
    createBodyChecks,
    createUserBodyChecks,
    createParamsChecks,
    checkNOTFOUND,
    createGetParamChecks,
    createBodyNotEmpty,
    forbiddenArgs
}