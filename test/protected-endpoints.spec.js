const knex = require('knex')
const app = require('../src/app')
const helpers = require('./test-helpers')

describe('Protected endpoints', () => {
  let db

  const {
    testUsers,
    testMonsters,
    testGuides
  } = helpers.makeMonstersFixtures()

  before ('make knex instance', () => {
    db = knex({
      client: 'pg',
      connection: process.env.TEST_DATABASE_URL
    })
    app.set('db', db)
  })

  after('disconnect from db', () => db.destroy())

  before('clean tables', () => helpers.cleanTables(db))

  afterEach('clean tables', () => helpers.cleanTables(db))

  beforeEach('insert monsters', () => helpers.seedMonstersTables(
    db, testUsers, testMonsters
  ))

  const protectedEndpoints = [
    {
      name: 'POST /api/monsters/',
      path: '/api/monsters'
    },
    {
      name: 'POST /api/guides/:user_name',
      path: `/api/guides/${testUsers[0].user_name}`
    }
  ]

  protectedEndpoints.forEach(endpoint => {

    describe(endpoint.name, () => {

      it('responds with 401 and Missing bearer token when no bearer token', () => {
        return supertest(app)
          .post(endpoint.path)
          .expect(401, {
            error: 'Missing bearer token'
          })
      })

      it('responds 401 and Unauthorized message with invalid JWT secret', () => {
        const validUser = testUsers[0]
        const invalidSecret = 'invalid-secret'

        return supertest(app)
          .post(endpoint.path)
          .set('Authorization', helpers.makeAuthHeader(validUser, invalidSecret))
          .expect(401, {
            error: 'You must be logged in to use this feature'
          })
      })

      it('responds 401 and unauthorized message when invalid sub in payload', () => {
        const invalidUser = { user_name: 'invalid', id: 1 }

        return supertest(app)
          .post(endpoint.path)
          .set('Authorization', helpers.makeAuthHeader(invalidUser))
          .expect(401, {
            error: 'You must be logged in to use this feature'
          })
      })
    })
  })
})
