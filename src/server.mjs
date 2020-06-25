import http2 from 'http2'
import fs from 'fs'
import mongoDB from 'mongodb'

const mongoClient = mongoDB.MongoClient

const server = http2.createSecureServer({
  key: fs.readFileSync('certs/example.key'),
  cert: fs.readFileSync('certs/example.crt')
})

const url = 'mongodb://localhost:27017'
const dbName = 'gitstars'
const collection = 'gitstars'

let coll

const start = async () => {
  let client
  try {
    client = await mongoClient.connect(url, { useUnifiedTopology: true })
  } catch (err) {
    console.log({ err })
  }
  coll = client.db(dbName).collection(collection)

  server.on('error', (err) => console.error(err))

  server.on('stream', async (stream, headers) => {
    // stream is a Duplex
    stream.respond({
      'content-type': 'text/html',
      ':status': 200
    })
    const elem = await coll.findOne()
    stream.end(elem.toString())
  })

  server.listen(8443)
}

start()