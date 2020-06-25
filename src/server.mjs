import http2 from 'http2'
import fs from 'fs'
import mongoDB from 'mongodb'
import queryString from 'querystring'

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
    const path = headers[':path']

    if (path === '/favicon.ico') {
      stream.end()
      return
    }

    // checking that the query is not malicious
    const query = queryString.decode(headers[':path'])
    if (query.max) query.max = parseInt(query?.max)
    else query.max = 10

    // if (!query.lang) query.lang = '*'
    if (!query.since) query.since = config.startDate
    // self compare exclude NaN
    // eslint-disable-next-line no-self-compare
    if (typeof query.max === 'number' && query.max === query.max) {
      stream.respond({
        'content-type': 'text/html',
        ':status': 200
      })

      console.log({ query })

      let elems

      const date = new Date(query.since)

      console.log({ date })

      if (query.lang) elems = coll.find({ language: query.lang, created_at: { $gte: date } }).limit(query.max)
      else elems = coll.find({ created_at: { $gte: date } }).limit(query.max)

      // console.log({ elems })

      for await (const elem of elems) stream.write(elem.name + ' \n')

      stream.end('\n done')
    } else stream.end('error')
  })

  server.listen(8443)
}

start()
