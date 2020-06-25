/**
 * This is the config file, it specifies several parameters for the project.
 * - Pages: the number of results to be cached inside MongoDB. Github provides 30 results per page
 * - Start Date: the date from which we should begin caching
 * - Mongo parameters: The parameters to connect to mongo
 * - SSL: location of certs for the HTTP/2 server
 */

export const config = {
  pages: 2,
  startDate: '2010-01-01',
  mongoUrl: 'mongodb://localhost:27017',
  dbName: 'gitstars',
  collectionName: 'gitstars',
  sslCrt: 'certs/example.crt',
  sslKey: 'certs/example.key'
}
