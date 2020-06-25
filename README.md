# gitstars
a microservice to get the most starred projects on github

The project has been tested on Ubuntu 20.04, node 14 and mongodb 3.6.

# Setup

The first step is to start mongo, on Ubuntu with:

`sudo systemctl start mongod`

We then initialize the project with:

`yarn` or `npm install`

We then download the cache with:

`yarn createCache` or `npm run createCache`

The cache is then loaded inside mongodb

`yarn warmCache` or `npm run warmCache`

We launch the server with:

`yarn serve`

If one wishes so, he can test the project with:

`jarn test`

# Use

The service can be queried visiting the url:

`https://localhost:8443/&max=MAX_RESULTS&since=DATE&lang=LANGUAGE`

for example:

`https://localhost:8443/&max=5&since=2010-01-01&lang=JavaScript`

All the parameters are optional. For brevity, the server returns only the name of the projects.

# Architecture

Mongo is used as a local cache, so we don't have to rely on github to guarantee business continuity.

The server uses HTTP/2 streams and asynchronous iteration over the queries, to increase the maximum load sustainable.

We can easily scale out by firing up more instances of the server, and eventually more mongoDB servers.

# Weaknesses

Given more time I would have containerized the application, to guarantee to have the correct version of everything and to automate scaling.

