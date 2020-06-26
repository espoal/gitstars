/**
 * IMPORTANT NOTE: before running this test make sure that mongo and the server are running.
 */

/* eslint-env jest */

const http2 = require('http2')
const dns = require('dns')
const fs = require('fs')

const config = {
  pages: 2,
  startDate: '2010-01-01',
  mongoUrl: 'mongodb://localhost:27017',
  dbName: 'gitstars',
  collectionName: 'gitstars',
  sslCrt: 'certs/example.crt',
  sslKey: 'certs/example.key'
}

const reqOptions = {
  agent: undefined,
  auth: '',
  createConnection: false,
  defaultPort: 8000,
  family: 4,
  headers: undefined,
  hostname: 'localhost',
  insecureHTTPParser: false,
  localAddress: '127.0.0.1',
  lookup: dns.lookup,
  maxHeaderSize: 16384,
  method: 'GET',
  path: '/',
  protocol: 'http:',
  port: 8000,
  setHost: true,
  timeOut: 500,
  callback: null
}

test('test certificates', () => {
  const options = {
    key: fs.readFileSync(config.sslKey),
    cert: fs.readFileSync(config.sslCrt)
  }

  expect(options).toBeTruthy()
})

test('check that (pseudo) input sanitization works', () => {

})

test('check that the results are correct', () => {

})
