require('dotenv').config()
const app = require('express')()
const port = process.env.PORT
const bodyParser = require('body-parser')
const mongoose = require('mongoose')
const Functions = require('./utils/functions')
const Validator = require('./utils/validator')
const Middlewares = require('./utils/middlewares')
const swaggerUI = require('swagger-ui-express')
const swaggerJsDoc = require('swagger-jsdoc')
const path = require('path')
const swaggerSpec = {
    definition:{
        openapi: '3.0.0',
        info: {
            title: 'Task management API',
            version: '1.0.0',
        }
    },
    servers: [
        {
            url: "http://localhost:3000"
        } 
    ],
    apis:[ `${path.join(__dirname,"./index.js")}` ]
}

mongoose.connect(process.env.DB_CONNECTION)

/**
 * @swagger
 * components:
 *  schemas:
 *      User:
 *          type: object
 *          properties:
 *              username:
 *                  type: String
 *                  description: Username to identify user
 *              password:
 *                  type: String
 *                  description: Key to obtain JWT
 *          required:
 *              - username
 *              - password
 *          example:
 *              username: taskmaker
 *              password: asd123
 *      Task:
 *          type: object
 *          properties:
 *              name:
 *                  type: String
 *                  descritption: Name to summarize task
 *              description:
 *                  type: String
 *                  description: Specific activities of task
 *              completed:
 *                  type: Boolean
 *                  description: If task was completed or not
 *              createdBy:
 *                  type: String
 *                  description: Username that created the task
 *              lastUpdatedBy:
 *                  type: String
 *                  description: Username of the user that last modified the task
 *              createdAt:
 *                  type: Date
 *                  description: Date of creation of the task
 *              lastUpdatedAt:
 *                  type: Date
 *                  description: Date of last modification
 *          required:
 *              - name
 *              - description
 *          example:
 *              name: Clean sheets
 *              description: Clean the bed sheets on the washing machine then hang them outside to dry
 *                  
 */     

app.use(bodyParser.json())
const server = app.listen(port,()=>{
    console.log('App listening at port ',port)
})
app.use("/api-doc", swaggerUI.serve, swaggerUI.setup(swaggerJsDoc(swaggerSpec)) )

/**
 * @swagger
 * /signup:
 *  post:
 *      summary: Creates new user
 *      tags: [User]
 *      requestBody:
 *          required: true
 *          content:
 *              application/json:
 *                  schema:
 *                      type: object
 *                      $ref: '#/components/schemas/User'
 *      responses:
 *          200: 
 *              description: User was created sucessfully
 *          400: 
 *              description: Missing arguments
 *          409: 
 *              description: User already exists  
 */

/**
 * @swagger
 * /login:
 *  post:
 *      summary: gets jwt token for a particular user
 *      tags: [User]
 *      requestBody:
 *          required: true
 *          content:
 *              application/json:
 *                  schema:
 *                      type: object
 *                      $ref: '#/components/schemas/User'
 *      responses:
 *          200: 
 *              description: User login successfull, jwt provided in response
 *              content: 
 *                  application/json:
 *                      schema:
 *                          type: object
 *                          properties:
 *                              username:
 *                                  type: string
 *                                  description: Username of logged user
 *                              token:
 *                                  type: string
 *                                  description: Jwt token to use endpoints
 *          400:
 *              description: Missing arguments
 *          401:
 *              description: Wrong username or password
 */
//User management
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

//Data management

/**
 * @swagger
 * /tasks/{id}:
 *  get:
 *      summary: Gets one task
 *      tags: [Tasks]
 *      parameters:
 *          - in: path
 *            name: id
 *            schema:
 *              type: string
 *      responses:
 *          200:
 *              description: returns user correctly
 *              content:
 *                  application/json:
 *                      schema:
 *                          type: object
 *                          properties:
 *                              message:
 *                                  type: string
 *                              status:
 *                                  type: string
 *                              task: 
 *                                  type: object
 *                                  $ref: '#/components/schemas/Task'
 *          400:
 *              description: missing or malformed id
 *          404:
 *              description: task not found
 *  put:
 *      summary: Modifies task
 *      tags: [Tasks]
 *      parameters:
 *          - in: path
 *            name: id
 *            schema:
 *              type: string
 *      requestBody:
 *          required: true
 *          description: task attribute with assigned value
 *          content:
 *              application/json:
 *                  schema:
 *                      type: object
 *                  example:
 *                      completed: true
 *      responses:
 *          200:
 *              description: modifies task correctly
 *          400:
 *              description: missing or malformed id
 *          401:
 *              description: Trying to modify forbidden argument
 *          404:
 *              description: task not found  
 *  delete:
 *      summary: Deletes task from database
 *      tags: [Tasks]
 *      parameters:
 *          - in: path
 *            name: id
 *            schema:
 *              type: string
 *      responses:
 *          200:
 *              description: deletes task correctly
 *          400:
 *              description: missing or malformed id
 *          404:
 *              description: task not found        
 * /tasks:
 *  get:
 *      summary: Get all tasks
 *      tags: [Tasks]
 *      responses:
 *          200:
 *              description: get all tasks successfully
 *              content:
 *                  application/json:
 *                      schema:
 *                          type: array
 *                          items:
 *                              $ref: '#components/schemas/Task'
 *  post:
 *      summary: Add a task to database
 *      tags: [Tasks]
 *      requestBody:
 *          required: true
 *          content:
 *              application/json:
 *                  schema:
 *                      type: object
 *                      $ref: '#/components/schemas/Task'
 *      responses:
 *          200:
 *              description: adds tasks succesfully
 *          400:
 *              description: Missing required arguments
 *          401: 
 *              description: Attempting to modify forbidden argument
 * 
 *                       
 */

app.use(Validator.checkToken)
app.get('/tasks/:id?', 
        Validator.createGetParamChecks,
        Validator.checkResult,
        Middlewares.getTasks
    )
app.put('/tasks/:id?',
        Validator.createParamsChecks,
        Validator.createBodyNotEmpty,
        Validator.forbiddenArgs,
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
        Validator.forbiddenArgs,
        Validator.checkResult,
        async (req,res)=> res.send(await Functions.addTask(req.body))
    )
app.use(Validator.checkNOTFOUND)

module.exports = {app,server}