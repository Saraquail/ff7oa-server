require('dotenv').config()

process.env.TZ = 'UTC'
process.env.NODE_ENV = 'test'
process.env.JWT_SECRET = 'test-jwt-secret'

process.env.TEST_DB_URL = process.env.TEST_DB_URL
  || "postgresql://saraquail@localhost/ff7oa-test"


const { expect } = require('chai')
const supertest = require('supertest')

global.expect = expect
global.supertest = supertest
