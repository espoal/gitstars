/**
 * The Chef Module is responsible for retrieving 30 * pages results from github and store the results inside a file, for
 * later consumption.
 */

import https from 'https'
import fs from 'fs'
import { config } from '../config.mjs'

/** The urlBuilder has a small trick in the query (stars > 10) to guarantee that we won't exceed github computation time
 * and thus have reliable results */
const urlBuilder = ({ date = config.startDate, page = 1, language = '' }) =>
  `https://api.github.com/search/repositories?q=stars:%3E10+created:%3E${date}&s=stars&type=Repositories&page=${page}&language=${language}`

const headers = { 'user-agent': 'giststars' }

const getPage = ({ date = config.startDate, page = 1, language = 'any' }) =>
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

for (let i = 1; i < config.pages + 1; i++) {
  setTimeout(getPage, 500 * (i - 1), { page: i })
}
