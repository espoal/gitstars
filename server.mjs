import http2 from 'http2'
import fs from 'fs'

const server = http2.createSecureServer({
  key: fs.readFileSync('certs/example.key'),
  cert: fs.readFileSync('certs/example.crt')
})

server.on('error', (err) => console.error(err))

server.on('stream', (stream, headers) => {
  // stream is a Duplex
  stream.respond({
    'content-type': 'text/html',
    ':status': 200
  })
  stream.end('<h1>Hello World</h1>')
})

server.listen(8443)
