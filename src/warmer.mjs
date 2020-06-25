import mongoDB from 'mongodb'
import fs from 'fs'

import { config } from '../config.mjs'

const mongoClient = mongoDB.MongoClient;

(async ({ pages = config.pages }) => {
  let client

  try {
    client = await mongoClient.connect(config.mongoUrl, { useUnifiedTopology: true })
    console.log('Connected correctly to server')

    const db = client.db(config.dbName)

    for (let i = 1; i < pages; i++) {
      await db.collection(config.collectionName)
        .insertMany(JSON.parse(fs.readFileSync(`cache/pag${i}.json`)).items)
    }
  } catch (err) {
    console.log(err.stack)
  }

  // Close connection
  await client.close()
})({})