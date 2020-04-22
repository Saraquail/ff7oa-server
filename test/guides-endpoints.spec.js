const knex = require('knex')
const app = require('../src/app')
const helpers = require('./test-helpers')

describe.only('Guides Endpoints', () => {
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
  
  describe('POST /api/guides/:user_name', () => {
    beforeEach('insert monsters', () =>
      helpers.seedMonstersTables(
        db,
        testUsers,
        testMonsters
      )
    )

    it('creates a guide, responds with 201 and the guide', () => {
      const testUser = testUsers[0]
      const guide = helpers.makePostTestGuide()
      const newGuide = {guide}
      return supertest(app)
        .post(`/api/guides/${testUser.user_name}`)
        .set('Authorization', helpers.makeAuthHeader(testUser))
        .send(newGuide)
        .expect(201)
        .expect(res => {
          expect(res.body).to.have.property('id')
          expect(res.body.user_id).to.eql(newGuide.guide.user_id)
          expect(res.body.monster_id).to.eql(newGuide.guide.monster_id)
          expect(res.body.name).to.eql(newGuide.guide.name)
          expect(res.body.note).to.eql(newGuide.guide.note)
          expect(res.headers.location).to.eql(`/api/guides/${testUser.user_name}`)

        })
        .expect(res => 
          db
            .from('ff7oa_guides')
            .select('*')
            .where({ id: res.body.id })
            .first()
            .then(row => {
              expect(row.name).to.eql(newGuide.guide.name)
              expect(row.note).to.eql(newGuide.guide.note)
              expect(row.monster_id).to.eql(newGuide.guide.monster_id)

            })
          )
    })

    const requiredFields = ['name', 'note']

    requiredFields.forEach(field => {
      const testMonster = testMonsters[0]
      const guide = helpers.makePostTestGuide()
      const newGuide = {guide}

      it(`responds with 400 and error when ${field} is missing`, () => {
        delete newGuide.guide[field]

        return supertest(app)
          .post(`/api/guides/${testUsers[0].user_name}`)
          .set('Authorization', helpers.makeAuthHeader(testUsers[0]))
          .send(newGuide)
          .expect(400, {
            error: `Missing '${field}'`
          })
      })
    })
  })
})


