const {api,token,cleanDB, populateDB,getAllTasks,addExample,closeConnection} = require('./helpers')
const NUM_OF_TASKS = 3

beforeAll(async ()=>{
    await cleanDB()
    await populateDB(NUM_OF_TASKS)
})
describe('Test delete endpoint',()=>{
    test('Successful delete', async ()=> {
        const deleteTask = (await getAllTasks())[0]
        const res = await api
            .delete(`/tasks/${deleteTask._id}`)
            .set('Authorization', `Bearer ${token}`)
            .expect(200)
            .expect('Content-Type', /application\/json/)
        const firstTask = (await getAllTasks())[0]
        expect(deleteTask._id).not.toBe(firstTask._id)
    })
    test('Invalid id',async ()=> {
        const invalidId = 'invalidId'
        const res = await api
            .delete(`/tasks/${invalidId}`)
            .set('Authorization', `Bearer ${token}`)
            .expect(400)
            .expect('Content-Type', /application\/json/)
        expect(res.body.errors[0].msg).toBe('Id should be a valid Mongo Id')
    })
    test('No id in request', async ()=> {
        const res = await api
            .delete(`/tasks/`)
            .set('Authorization', `Bearer ${token}`)
            .expect(400)
            .expect('Content-Type', /application\/json/)
        expect(res.body.errors[0].msg).toBe('Id needed')        
    })
    test('Task not found',async ()=> {
        const newTask = await addExample()
        await cleanDB()
        const res = await api
            .delete(`/tasks/${newTask.id}`)
            .set('Authorization', `Bearer ${token}`)
            .expect(404)
            .expect('Content-Type', /application\/json/)
        expect(res.body.msg).toBe('Task not found')
    })
})
afterAll(async ()=>{
    await closeConnection()
})