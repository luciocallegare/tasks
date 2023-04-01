const {api,token,cleanDB, populateDB,addExample,closeConnection} = require('./helpers')
const NUM_OF_TASKS = 3

beforeAll(async ()=>{
    await cleanDB()
    await populateDB(NUM_OF_TASKS)
})
describe('Test get endpoints', () => {
    test('Test get all tasks',async ()=>{
        const res = await api
            .get('/tasks')
            .set('Authorization', `Bearer ${token}`)
            .expect(200)
            .expect('Content-Type', /application\/json/)
        expect(res.body.length).toBe(NUM_OF_TASKS)
    })
    test('Test get specific task', async ()=>{
        const newTask = await addExample()
        const res = await api
            .get(`/tasks/${newTask.id}`)
            .set('Authorization', `Bearer ${token}`)
            .expect(200)
            .expect('Content-Type', /application\/json/)
        const objTask = newTask.toObject()
        objTask.id = objTask._id.toString()
        delete objTask._id
        delete objTask.__v
        expect(res.body).toEqual(objTask)
    })
    test('Invalid id',async ()=> {
        const invalidId = 'invalidId'
        const res = await api
            .get(`/tasks/${invalidId}`)
            .set('Authorization', `Bearer ${token}`)
            .expect(400)
            .expect('Content-Type', /application\/json/)
        expect(res.body.errors[0].msg).toBe('Id should be a valid Mongo Id')
    })
    test('Task not found',async ()=> {
        const newTask = await addExample()
        await cleanDB()
        const res = await api
            .get(`/tasks/${newTask.id}`)
            .set('Authorization', `Bearer ${token}`)
            .expect(404)
            .expect('Content-Type', /application\/json/)
        expect(res.body.msg).toBe('Task not found')
    })
})
afterAll(async ()=>{
    await closeConnection()
})