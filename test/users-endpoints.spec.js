const knex = require('knex')
const bcrypt = require('bcryptjs')
const app = require('../src/app')
const helpers = require('./test-helpers')

describe.only('Users Endpoints', function() {
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

  before('cleanup', () => helpers.cleanTables(db))

  afterEach('cleanup', () => helpers.cleanTables(db))

  describe('POST /api/users', () => {

    context('User Validation', () => {

      beforeEach('insert users', () => 
        helpers.seedUsers(
          db, 
          testUsers
        )
      )

      const requiredFields = ['user_name', 'password']

      requiredFields.forEach(field => {
        const registerAttemptBody = {
          user_name: 'test user_name',
          password: 'test password',
        }

        it('responds with 400 and required error when a field is missing', () => {
          delete registerAttemptBody[field]

          return supertest(app)
            .post('/api/users')
            .send(registerAttemptBody)
            .expect(400, {
              error: `Missing ${field}`
            })
        })
      })

      it('responds 400 and Password must be longer than 6 characters when short password', () => {
        const userShortPassword = {
          user_name: 'test user_name',
          password: '1234',
        }

        return supertest(app)
          .post('/api/users')
          .send(userShortPassword)
          .expect(400, { error: 'Password must be longer than 6 characters'})
      })

      it('responds 400 Password must be less than 72 characters when long password', () => {
        const userLongPassword = {
          user_name: 'test user_name',
          password: '*'.repeat(73),
        }

        return supertest(app)
          .post('/api/users')
          .send(userLongPassword)
          .expect(400, { error: 'Password must be less than 72 characters' })
      })

      it('responds 400 and error when password starts with spaces', () => {
        const userPassWithSpaces = {
          user_name: 'test user_name',
          password: ' 1Aa!2Bb@',
        }
        return supertest(app)
          .post('/api/users')
          .send(userPassWithSpaces)
          .expect(400, { error: `Password must not start or end with empty spaces` })
      })

      it('responds 400 and error when password ends with spaces', () => {
        const userPassWithSpaces = {
          user_name: 'test user_name',
          password: '1Aa!2Bb@ ',
        }
        return supertest(app)
          .post('/api/users')
          .send(userPassWithSpaces)
          .expect(400, { error: `Password must not start or end with empty spaces` })
      })

      it(`responds 400 error when password isn't complex enough`, () => {
        const userPasswordNotComplex = {
          user_name: 'test user_name',
          password: 'AAaabb',
        }

        return supertest(app)
          .post('/api/users')
          .send(userPasswordNotComplex)
          .expect(400, { error: `Password must contain 1 upper case, lower case, and number` })
      })

      it(`responds 400 'User name already taken' when user_name isn't unique`, () => {
        const duplicateUser = {
          user_name: testUser.user_name,
          password: '11AAaa',
        }

        return supertest(app)
          .post('/api/users')
          .send(duplicateUser)
          .expect(400, { error: `Username already taken` })
      })
    })

    context(`on success`, () => {

      it('responds 201, serializes user, and stores bcrypted password', () => {
        const newUser = {
          user_name: 'testing123',
          password: 'Testing123'
        }

        return supertest(app)
          .post('/api/users')
          .send(newUser)
          .expect(201)
          .expect(res => {
            expect(res.body).to.have.property('id')
            expect(res.body.user_name).to.eql(newUser.user_name)
            expect(res.body).to.not.have.property('password')
            expect(res.headers.location).to.eql(`/api/users/${res.body.id}`)
          })
          .expect(res => 
            db
              .from('ff7oa_users')
              .select('*')
              .where({ id: res.body.id })
              .first()
              .then(row => {
                expect(row.user_name).to.eql(newUser.user_name)

                return bcrypt.compare(newUser.password, row.password)
              })
                  .then(match => {
                    expect(match).to.be.true
                  })
            )
      })
    })
  })
})