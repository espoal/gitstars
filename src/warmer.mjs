/**
 * The warmer module is responsible for filling the mongoDB server with the cache created by the chef Module.
 */

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
    /*
    await db.collection(config.collectionName).aggregate([
      {
        $addFields: {
          created_at: {
            $convert: {
              input: '$created_at',
              to: 'date'
            }
          }
        }
      }

    ])

*/

    await db.collection(config.collectionName).createIndex({ stargazers_count: 1 })
    // await db.collection(config.collectionName).createIndex({ created_at: 1 })
  } catch (err) {
    console.log(err.stack)
  }

  // Close connection
  await client.close()
})({})
