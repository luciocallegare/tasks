const {api,token,cleanDB, populateDB,getAllTasks,addExample,closeConnection} = require('./helpers')
const NUM_OF_TASKS = 3

beforeAll(async ()=>{
    await cleanDB()
    await populateDB(NUM_OF_TASKS)
})

describe('Testing task addition', ()=>{

    test('Adding Task',async ()=>{
        const example = {
            name:"Adding test task",
            description:"This task was added in an automated test"
        }
        const res = await api
            .post('/tasks')
            .set('Authorization', `Bearer ${token}`)
            .send(example)
            .expect(200)
            .expect('Content-Type', /application\/json/)
        example.completed = false
        expect(res.body.task).toMatchObject(example)
    })

    test('Missing attributes: description', async ()=>{
        const exampleMissing = {
            "name":"Missing description task"
        }
        const res = await api
            .post('/tasks')
            .set('Authorization', `Bearer ${token}`)
            .send(exampleMissing)
            .expect(400)
            .expect('Content-Type', /application\/json/)
        expect(res.body.errors[0].msg).toBe('Please provide a description of the task')
    })

    test('Missing attributes: name', async ()=> {
        const exampleMissing = {
            "description":"Missing name task"
        }
        const res = await api
            .post('/tasks')
            .set('Authorization', `Bearer ${token}`)
            .send(exampleMissing)
            .expect(400)
            .expect('Content-Type', /application\/json/)
        expect(res.body.errors[0].msg).toBe('Task needs a name')        
    })

    test('Forbidden argument added: createdBy', async ()=>{
        const forbidden = {
            name:"Adding test task",
            description:"This task was added in an automated test",
            "createdBy":"anotherUser"
        }
        const res = await api
            .post('/tasks')
            .set('Authorization', `Bearer ${token}`)
            .send(forbidden)
            .expect(401)
            .expect('Content-Type', /application\/json/)
        expect(res.body.errors[0].msg).toBe('Forbidden argument')   

    })
    test('Forbidden argument added: createdAt', async ()=>{
        const forbidden = {
            name:"Adding test task",
            description:"This task was added in an automated test",
            "createdAt":new Date()
        }
        const res = await api
            .post('/tasks')
            .set('Authorization', `Bearer ${token}`)
            .send(forbidden)
            .expect(401)
            .expect('Content-Type', /application\/json/)
        expect(res.body.errors[0].msg).toBe('Forbidden argument')   

    })
    test('Forbidden argument added: lastUpdatedBy', async ()=>{
        const forbidden = {
            name:"Adding test task",
            description:"This task was added in an automated test",
            "lastUpdatedBy":"anotherUser"
        }
        const res = await api
            .post('/tasks')
            .set('Authorization', `Bearer ${token}`)
            .send(forbidden)
            .expect(401)
            .expect('Content-Type', /application\/json/)
        expect(res.body.errors[0].msg).toBe('Forbidden argument')   

    })
    test('Forbidden argument added: lastUpdatedAt', async ()=>{
        const forbidden = {
            name:"Adding test task",
            description:"This task was added in an automated test",
            "lastUpdatedAt":new Date()
        }
        const res = await api
            .post('/tasks')
            .set('Authorization', `Bearer ${token}`)
            .send(forbidden)
            .expect(401)
            .expect('Content-Type', /application\/json/)
        expect(res.body.errors[0].msg).toBe('Forbidden argument')   

    })
})


afterAll(async ()=>{
    await closeConnection()
})