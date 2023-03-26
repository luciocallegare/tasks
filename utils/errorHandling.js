const {body, validationResult, param} = require('express-validator')
const jwt = require("jsonwebtoken")

const checkBody = (req,res,next) => {
    body('name').notEmpty()
    body('description').notEmpty()
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
        res.sendStatus(400).send("Token not present")
    }    
    jwt.verify(token, process.env.ACCESS_TOKEN_SECRET, (err, user) => {
        if (err) { 
            res.status(403).send("Token invalid")
        }
        next() 
    })    
}
module.exports = {checkBody,checkParams,checkToken}