const {
    api,
    token,
    cleanDB, 
    populateDB,
    getAllTasks,
    addExample,
    closeConnection,
    addUser
} = require('./helpers')

beforeAll(async ()=>{
    await cleanDB()
})

describe('Sign up testing', ()=>{

    test('User added correctly', async ()=>{
        const newUser = {
            username: "Test_user2",
            password: "test_password"
        }
        const res = await api
            .post('/signup')
            .set('Authorization', `Bearer ${token}`)
            .send(newUser)
            .expect(200)
            .expect('Content-Type', /application\/json/)
        expect(res.body).toStrictEqual({
            "message": "User created successfully",
            "status": "ok"
        })
    })

    test('Missing username', async() => {
        const newUser = {
            password: "test_password"
        }      
        const res = await api
            .post('/signup')
            .set('Authorization', `Bearer ${token}`)
            .send(newUser)
            .expect(400)
            .expect('Content-Type', /application\/json/)
        expect(res.body.errors[0].msg).toBe('Username needed')  
    })

    test('Missing password', async() => {
        const newUser = {
            username: "Test_user3"
        }      
        const res = await api
            .post('/signup')
            .set('Authorization', `Bearer ${token}`)
            .send(newUser)
            .expect(400)
            .expect('Content-Type', /application\/json/)
        expect(res.body.errors[0].msg).toBe('Password needed')  
    })

    test('User already exists', async() => {
        const newUser = await addUser()
        const res = await api
            .post('/signup')
            .set('Authorization', `Bearer ${token}`)
            .send(newUser)
            .expect(409)
            .expect('Content-Type', /application\/json/)   
        expect(res.body.errors[0].msg).toStrictEqual({
            "error": "User already exists",
            "status": 409
        })      
    })

})

afterAll(async ()=>{
    await closeConnection()
})