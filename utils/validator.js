const {body, validationResult, param} = require('express-validator')
const jwt = require("jsonwebtoken")
const User = require('../models/Users')
const accessToken = process.env.ACCESS_TOKEN_SECRET

const checkBody = (req,res,next) => {
    body('name').notEmpty()
    body('description').notEmpty()
    const errors = validationResult(req)
    if (!errors.isEmpty()) {
        return res.status(400).json({ errors: errors.array() });
    }
    next()
}

const checkUserBody = (req,res,next) => {
    body('username').notEmpty()
    body('password').notEmpty()
    const errors = validationResult(req)
    if (!errors.isEmpty()) {
        return res.status(400).json({ errors: errors.array() });
    }
    next()
}
const checkParams = (req,res,next) => {
    param('id').notEmpty()
    param('id').isString()
    param('id').isMongoId()
    if (!errors.isEmpty()) {
        return res.status(400).json({ errors: errors.array() });
    }
    next()
}

const checkToken = (req,res,next) => {
    const authHeader = req.headers["authorization"]
    const token = authHeader.split(" ")[1]
    if (token == null) { 
        res.status(400).json("Token not present")
    }    
    jwt.verify(token, process.env.ACCESS_TOKEN_SECRET, (err, user) => {
        if (err) { 
            res.status(403).json({ error: "Token invalid" })
        }
        next() 
    })    
}

const checkUser = (req,res,next) => {
    const { username } = req.body

    const user = User.find({username})

    if (typeof user !== 'undefined'){
        res.status(409).json({ error: "User already exists"})
    }
    next()
}

const checkUserLogin = async (req,res,next) => {
    const {username,passwordHash} = req.body

    const user = User.findOne({username})

    const passwordCorrect = user === null
    ? false
    : await bcrypt.compare(password, user.passwordHash)

    if (!(user && passwordCorrect)) {
        response.status(401).json({ error: 'invalid user or password'})
    }

    const token = jwt.sign({username},accessToken,{ expiresIn: 60 * 60 * 24 })

    res.send({ username,token })
}

module.exports = {checkBody,checkParams,checkToken,checkUser,checkUserBody, checkUserLogin}