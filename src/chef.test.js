/* eslint-env jest */

const fs = require('fs')

test('check that the file cache doesn\'t have incomplete data', () => {
  const files = fs.readdirSync('cache')

  files.forEach(filePath => {
    const file = fs.readFileSync(`cache/${filePath}`)
    const json = JSON.parse(file.toString())
    expect(json.incomplete_results).toBeFalsy()
  })
})
