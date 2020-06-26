/* eslint-env jest */

const config = {
  pages: 2,
  startDate: '2010-01-01',
  mongoUrl: 'mongodb://localhost:27017',
  dbName: 'gitstars',
  collectionName: 'gitstars',
  sslCrt: 'certs/example.crt',
  sslKey: 'certs/example.key'
}
const mongoDB = require('mongodb')

const mongoClient = mongoDB.MongoClient

test('check that mongo is working correctly', async () => {
  let client

  try {
    client = await mongoClient.connect(config.mongoUrl, { useUnifiedTopology: true })
    expect(client).toBeTruthy()
    client.close()
  } catch (err) {
    throw new Error(err)
  }
})
