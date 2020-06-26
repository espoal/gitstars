/**
 * IMPORTANT NOTE: before running this test make sure that mongo and the server are running.
 */

/* eslint-env jest */

const http2 = require('http2')
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

test('test certificates', () => {
  const options = {
    key: fs.readFileSync(config.sslKey),
    cert: fs.readFileSync(config.sslCrt)
  }

  expect(options).toBeTruthy()
})

test('check that (pseudo) input sanitization works', done => {
  const client = http2.connect('https://localhost:8443', { rejectUnauthorized: false })

  const req = client.request({ ':path': '/&max=hello' }, { endStream: true })

  req.on('response', headers => {
    expect(headers[':status']).toBe(200)
    req.on('data', (chunk) => {
      expect(chunk.toString('UTF-8')).toBe('error')
    })
    req.on('end', () => {
      client.close()
      done()
    })
  })
})

test('check that results are correct', done => {
  const client = http2.connect('https://localhost:8443', { rejectUnauthorized: false })

  const req = client.request({ ':path': '/&max=5' }, { endStream: true })

  req.on('response', headers => {
    expect(headers[':status']).toBe(200)
    let data = ''
    req.on('data', (chunk) => {
      data += chunk.toString('UTF-8')
    })
    req.on('end', () => {
      expect(data).toBe('freeCodeCamp \nvue \nreact \ntensorflow \nawesome \n\n done')
      client.close()
      done()
    })
  })
})
