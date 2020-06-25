import http2 from 'http2'
import fs from 'fs'
import mongoDB from 'mongodb'

import { config } from '../config.mjs'

const mongoClient = mongoDB.MongoClient

const server = http2.createSecureServer({
  key: fs.readFileSync(config.sslKey),
  cert: fs.readFileSync(config.sslCrt)
})

let coll

const start = async () => {
  let client
  try {
    client = await mongoClient.connect(config.mongoUrl, { useUnifiedTopology: true })
  } catch (err) {
    console.log({ err })
  }
  coll = client.db(config.dbName).collection(config.collectionName)

  server.on('error', (err) => console.error(err))

  server.on('stream', async (stream, headers) => {
    // stream is a Duplex
    stream.respond({
      'content-type': 'text/html',
      ':status': 200
    })
    const elem = await coll.findOne()
    console.log({ elem })
    stream.end(elem.id)
  })

  server.listen(8443)
}

start()
