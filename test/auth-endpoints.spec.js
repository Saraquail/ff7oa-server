const knex = require('knex')
const jwt = require('jsonwebtoken')
const app = require('../src/app')
const helpers = require('./test-helpers')

describe('auth endpoints', () => {
  let db
  const { testUsers } = helpers.makeMonstersFixtures()
  const testUser = testUsers[0]

  before('make knex instance', () => {
    db = knex({
      client: 'pg',
      connection: process.env.TEST_DATABASE_URL,
    })
    app.set('db', db)
  })

  after('disconnect from db', () => db.destroy())

  before('clean tables', () => helpers.cleanTables(db))

  afterEach('clean tables', () => helpers.cleanTables(db))

  describe('POST /api/auth/login', () => {

    beforeEach('insert users', () => 
      helpers.seedUsers(
        db,
        testUsers
      )
    )

    const requiredFields = ['user_name', 'password']

    requiredFields.forEach(field => {
      const loginAttemptBody = {
        user_name: testUser.user_name,
        password: testUser.password
      }

      it(`responds with 400 and required error when ${field} is missing`, () => {
        delete loginAttemptBody[field]

        return supertest(app)
          .post('/api/auth/login')
          .send(loginAttemptBody)
          .expect(400, {
            error: `Missing ${field}`
          })
      })
    })

    it('responds 400 and invalid user_name or password when invalid user_name', () => {
      const userInvalidUser = { user_name: 'invalid', password: 'password' }

        return supertest(app)
          .post('/api/auth/login')
          .send(userInvalidUser)
          .expect(400, { error: 'Incorrect user_name or password' })
    })

    it('responds 400 and invalid user_name or password when invalid password', () => {
      const userInvalidPass = { user_name: testUser.user_name, password: 'invalid' }

        return supertest(app)
          .post('/api/auth/login')
          .send(userInvalidPass)
          .expect(400, { error: 'Incorrect user_name or password' })
    })

    it('responds 200 and JWT auth token when valid creds', () => {
      const validUserCreds = {
        user_name: testUser.user_name,
        password: testUser.password
      }

      const expectedToken = jwt.sign(
        { user_id: testUser.id },
        process.env.JWT_SECRET,
        { 
          subject: testUser.user_name ,
          algorithm: 'HS256'
        }
      )

      return supertest(app)
        .post('/api/auth/login')
        .send(validUserCreds)
        .expect(200, {
          authToken: expectedToken,
          user_name: testUser.user_name
        })
    })
  })
})