const {
    api,
    token,
    cleanDB, 
    closeConnection,
    addUser
} = require('./helpers')
const jwt = require('jsonwebtoken')

let userAdded
beforeAll(async ()=>{
    await cleanDB()
    userAdded = await addUser()
})

describe('Testing login',() => {

    test('Normal login', async() => {
        const res = await api
            .post('/login')
            .set('Authorization', `Bearer ${token}`)
            .send(userAdded)
            .expect(200)
            .expect('Content-Type', /application\/json/)
        jwt.verify(res.body.token,process.env.ACCESS_SECRET_TOKEN, (err,user)=>{
            if (err) { 
                throw({
                    error: "Token invalid",
                    status: 403
                })
            }
            expect(res.body.username).toBe(userAdded.username) 
        })
    })

    test('User does not exist', async() => {
        const userNotExists = {
            username: "unexistant",
            password: "any"
        }
        const res = await api
            .post('/login')
            .set('Authorization', `Bearer ${token}`)
            .send(userNotExists)
            .expect(401)
            .expect('Content-Type', /application\/json/)
    })
    test('Wrong password', async() => {
        userAdded.password = 'wrongPassword'
        const res = await api
            .post('/login')
            .set('Authorization', `Bearer ${token}`)
            .send(userAdded)
            .expect(401)
            .expect('Content-Type', /application\/json/)
    })
    test('Missing password', async() => {
        delete userAdded.password
        const res = await api
            .post('/login')
            .set('Authorization', `Bearer ${token}`)
            .send(userAdded)
            .expect(400)
            .expect('Content-Type', /application\/json/)
        expect(res.body.errors[0].msg).toBe('Password needed')
    })
})

afterAll(async ()=>{
    await closeConnection()
})