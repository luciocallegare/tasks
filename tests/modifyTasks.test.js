const {api,token,cleanDB, populateDB,getAllTasks,addExample,closeConnection} = require('./helpers')
const NUM_OF_TASKS = 3

beforeAll(async ()=>{
    await cleanDB()
    await populateDB(NUM_OF_TASKS)
})
describe('Test put endpoint',()=>{
    test('Successful put', async ()=> {
        const unmodified = (await getAllTasks())[0]
        const mod = {
            name:"modified task"
        }
        const unmodifiedId = unmodified._id.toString()
        const res = await api
            .put(`/tasks/${unmodifiedId}`)
            .send(mod)
            .set('Authorization', `Bearer ${token}`)
            .expect(200)
            .expect('Content-Type', /application\/json/)
        console.log(res.body)
        const modifiedTask = (await getAllTasks()).find(task => task._id.toString() === unmodified._id.toString())
        expect(unmodified.name).not.toBe(modifiedTask.name)
    })
    test('Invalid id',async ()=> {
        const invalidId = 'invalidId'
        const res = await api
            .put(`/tasks/${invalidId}`)
            .send({})
            .set('Authorization', `Bearer ${token}`)
            .expect(400)
            .expect('Content-Type', /application\/json/)
        expect(res.body.errors[0].msg).toBe('Id should be a valid Mongo Id')
    })
    test('No id in request', async ()=> {
        const res = await api
            .put(`/tasks/`)
            .send({})
            .set('Authorization', `Bearer ${token}`)
            .expect(400)
            .expect('Content-Type', /application\/json/)
        expect(res.body.errors[0].msg).toBe('Id needed')        
    })
    test('No attributes added to modify',async ()=> {
        const newTask = await addExample()
        await cleanDB()
        const res = await api
            .put(`/tasks/${newTask.id.toString()}`)
            .send({})
            .set('Authorization', `Bearer ${token}`)
            .expect(400)
            .expect('Content-Type', /application\/json/)
        expect(res.body.errors[0].msg).toBe('Attributes to modify/add needed')
    })
    test('Task not found',async ()=> {
        const newTask = await addExample()
        await cleanDB()
        const res = await api
            .put(`/tasks/${newTask.id.toString()}`)
            .send({"completed":true})
            .set('Authorization', `Bearer ${token}`)
            .expect(404)
            .expect('Content-Type', /application\/json/)
        expect(res.body.msg).toBe('Task not found')
    })
})
afterAll(async ()=>{
    await closeConnection()
})