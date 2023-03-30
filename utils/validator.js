const {body,header, validationResult, param} = require('express-validator')
const jwt = require("jsonwebtoken")
const User = require('../models/Users')
const bcrypt = require('bcryptjs')

const createBodyChecks = () => [
    body('name').notEmpty().withMessage('Task needs a name'),
    body('description').notEmpty().withMessage('Please provide a description of the task')
]

const createUserBodyChecks = () => [
    body('username')
        .exists()
        .notEmpty()
        .withMessage('Username needed'),
    body('password').exists().notEmpty().withMessage('Password needed')
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

const createParamsChecks = () => [
    param('id').notEmpty(),
    param('id').isString(),
    param('id').isMongoId()
]

const checkResult = (req,res,next) => {
    const errors = validationResult(req)
    if (!errors.isEmpty()) {
        return res.status(400).json({ errors: errors.array() });
    }
    next()
}

const checkToken = header('authorization')
    .notEmpty()
    .withMessage('Authorization header missing')
    .custom(authHeader => {
        const token = authHeader?.split(" ")[1]
        if (token == null) { 
            throw new Error("Token not present")
        }    
        jwt.verify(token, process.env.ACCESS_TOKEN_SECRET, (err, user) => {
            if (err) { 
                throw({
                    error: "Token invalid",
                    status: 403
                })
            }
            return true
        })        
    })


const checkUserLogin = [
    body().custom(async body => {
        const {username,password} = body

        const user = await User.findOne({username})
    
        const passwordCorrect = user === null
        ? false
        : await bcrypt.compare(password, user.passwordHash)
        if (!(user && passwordCorrect)) {
            throw({ error: 'invalid user or password'})
        }
        return true
    })
]

module.exports = {
    checkResult,
    checkToken,
    checkUserExists,
    checkUserLogin,
    createBodyChecks,
    createUserBodyChecks,
    createParamsChecks,
}