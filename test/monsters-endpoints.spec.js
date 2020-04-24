const knex = require('knex')
const app = require('../src/app')
const helpers = require('./test-helpers')

describe('Monsters Endpoints', () => {
  let db


  const {
    testUsers, testMonsters, testGuides
  } = helpers.makeMonstersFixtures()

  before('make knex instance', () => {
    db = knex({
      client: 'pg',
      connection: process.env.TEST_DB_URL,
    })
    app.set('db', db)
  })

  after('disconnect from db', () => db.destroy())

  before('cleanup', () => helpers.cleanTables(db))

  afterEach('cleanup', () => helpers.cleanTables(db))

  describe('GET /api/monsters', () => {
    
    context('If no monsters' ,() => {
      it('responds with 200 and an empty list', () => {
        return supertest(app)
          .get('/api/monsters')
          .expect(200, [])
      })
    })

    context('If there are monsters', () => {

      beforeEach('insert monsters', () =>
        helpers.seedMonstersTables(
          db,
          testUsers,
          testMonsters
        )
      )

      it('responds 200 and the list of monsters', () => {
        const expectedMonsters = testMonsters.map(monster => 
          helpers.makeExpectedMonster(testUsers, monster)
          )
        
          return supertest(app)
            .get('/api/monsters')
            .expect(200, expectedMonsters)
      })
    })

    context('Given an XSS attack monster', () => {
      const testUser = testUsers[0]

      const {
        maliciousMonster,
        expectedMonster,
      } = helpers.makeMaliciousMonster(testUser)

      beforeEach('insert malicious monster', () => {
        return helpers.seedMaliciousMonster(
          db, testUser, maliciousMonster
        )
      })

      it('removes XSS attack content', () => {
        return supertest(app)
          .get('/api/monsters')
          .expect(res => {
            expect(res.body[0].name).to.eql(expectedMonster.name)
            expect(res.body[0].weakness).to.eql(expectedMonster.weakness)
            expect(res.body[0].strength).to.eql(expectedMonster.strength)
            expect(res.body[0].location).to.eql(expectedMonster.location)
            expect(res.body[0].steal).to.eql(expectedMonster.steal)
            expect(res.body[0].drops).to.eql(expectedMonster.drops)
            expect(res.body[0].enemy_skill).to.eql(expectedMonster.enemy_skill)
          })
      })
    })
  })

  describe('GET /api/monsters/monster:id', () => {

    context('If no monsters', () => {
      beforeEach(() => 
      helpers.seedUsers(db, testUsers)
      )

      it('responds with 404', () => {
        const monsterId = 123

        return supertest(app)
          .get(`/api/monsters/${monsterId}`)
          .set('Authorization', helpers.makeAuthHeader(testUsers[0]))
          .expect(404, { error : {
            message: 'Monster does not exist'
          }})
      })
    })

    context('If there are monsters', () => {

      beforeEach('insert monsters', () =>
      helpers.seedMonstersTables(
        db,
        testUsers,
        testMonsters
      )
    )

        it('responds 200 and the specified monster', () => {
          const monsterId = 2
          const expectedMonster = helpers.makeExpectedMonster(
            testUsers, testMonsters[monsterId - 1]
          )

          return supertest(app)
            .get(`/api/monsters/${monsterId}`)
            .set('Authorization', helpers.makeAuthHeader(testUsers[0]))
            .expect(200, expectedMonster)
        })
    })

    context('Given an XSS attack monster', () => {
      const testUser = testUsers[0]

      const {
        maliciousMonster,
        expectedMonster,
      } = helpers.makeMaliciousMonster(testUser)

      beforeEach('insert malicious monster', () => {
        return helpers.seedMaliciousMonster(
          db, testUser, maliciousMonster
        )
      })

      it('removes XSS attack content', () => {
        return supertest(app)
          .get(`/api/monsters/${maliciousMonster.id}`)
          .expect(res => {
            expect(res.body.name).to.eql(expectedMonster.name)
            expect(res.body.weakness).to.eql(expectedMonster.weakness)
            expect(res.body.strength).to.eql(expectedMonster.strength)
            expect(res.body.location).to.eql(expectedMonster.location)
            expect(res.body.steal).to.eql(expectedMonster.steal)
            expect(res.body.drops).to.eql(expectedMonster.drops)
            expect(res.body.enemy_skill).to.eql(expectedMonster.enemy_skill)
          })
      })
    })
  })
})