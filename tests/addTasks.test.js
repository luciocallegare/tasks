const {api,token,cleanDB, populateDB,getAllTasks,addExample,closeConnection} = require('./helpers')
const NUM_OF_TASKS = 3

beforeAll(async ()=>{
    await cleanDB()
    await populateDB(NUM_OF_TASKS)
})


afterAll(async ()=>{
    await closeConnection()
})