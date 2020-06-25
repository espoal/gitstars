import mongoDB from 'mongodb'
import fs from 'fs'

const mongoClient = mongoDB.MongoClient

const url = 'mongodb://localhost:27017'
const dbName = 'gitstars'
const collection = 'gitstars';

(async ({ pages = 2 }) => {
  let client

  try {
    client = await mongoClient.connect(url, { useUnifiedTopology: true })
    console.log('Connected correctly to server')

    const db = client.db(dbName)

    for (let i = 1; i < pages; i++) {
      await db.collection(collection)
        .insertMany(JSON.parse(fs.readFileSync(`cache/pag${i}.json`)).items)}
  } catch (err) {
    console.log(err.stack)
  }

  // Close connection
  client.close()
})({})
