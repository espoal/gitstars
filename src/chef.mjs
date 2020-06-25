import https from 'https'
import fs from 'fs'

const urlBuilder = ({ date = '2010-01-01', page = 1, language = '' }) =>
  `https://api.github.com/search/repositories?q=stars:%3E10+created:%3E${date}&s=stars&type=Repositories&page=${page}&language=${language}`

const headers = { 'user-agent': 'giststars' }

const getPage = ({ date = '2010-01-01', page = 1, language = 'any' }) =>
  https.get(urlBuilder({ date, page, language }), { headers }, (res) => {
    let error

    const { statusCode } = res

    if (statusCode !== 200) {
      error = new Error('Request Failed.\n' +
        `Status Code: ${statusCode}`)
    }

    if (error) {
      console.error(error.message)
      // Consume response data to free up memory
      res.resume()
      return
    }

    res.setEncoding('utf8')
    let rawData = ''
    res.on('data', (chunk) => { rawData += chunk })
    res.on('end', () => {
      // let json = JSON.parse(rawData)
      // fs.writeFileSync('cache/pag1.json',rawData.items.toString())
      fs.writeFileSync(`cache/pag${page}.json`, rawData)
    })
  }).on('error', (e) => {
    console.error(`Got error: ${e.message}`)
  })

for (let i = 1; i < 3; i++) {
  setTimeout(getPage, 500 * (i - 1), { page: i })
}
