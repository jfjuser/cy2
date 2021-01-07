const express = require('express')
const path = require('path')
const connectMockMiddleware = require('connect-mock-middleware')

const app = express()

app.use(connectMockMiddleware(path.join(__dirname, 'server')))

app.listen(3000)
