const express = require('express')
const morgan = require('morgan')
const cors = require('cors')
const helmet = require('helmet')
const { NODE_ENV } = require('./config')
const app = express()
const monstersRouter = require('./monsters/monsters-router')
const guidesRouter = require('./guides/guides-router')


app.use(morgan((NODE_ENV === 'production') ? 'tiny' : 'common', {
  skip: () => NODE_ENV === 'test',
}))
app.use(helmet())
app.use(cors())


app.use('/api/monsters', monstersRouter)
app.use('/api/guides', guidesRouter)
//app.use('/api/auth', authRouter)

app.use((error, req, res, next) => {
  let message
  if (NODE_ENV === 'production') {
    message = 'Server error'
  }
  else {
    console.error(error)
    message = error.message
  }
  res.status(500).json(message)
})

app.get('/', (req, res) => {
  res.send('Hello, boilerplate!')
})

module.exports = app