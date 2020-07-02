const bcrypt = require('bcryptjs')
const jwt = require('jsonwebtoken')


  function makeUsersArray() {
    return [
      {
        id: 1,
        user_name: 'test-user-1',
        password: 'password',
      },
      {
        id: 2,
        user_name: 'test-user-2',
        password: 'password',
      },
      {
        id: 3,
        user_name: 'test-user-3',
        password: 'password',
      },
    ]
  }

  
  function makeMonstersArray(users) {
    return [
      {
        id: 1,
        user_id: users[1].id,
        name: 'test-monster-1',
        hp: 10,
        mp: 10,
        exp: 10,
        gil: 10,
        weakness: 'weakness',
        strength: 'fire',
        location: 'test',
        level: 1,
        steal: 'test',
        drops: 'test',
        enemy_skill: 'test',
      }, 
      {
        id: 2,
        user_id: users[0].id,
        name: 'test-monster-2',
        hp: 10,
        mp: 10,
        exp: 10,
        gil: 10,
        weakness: 'weakness',
        strength: 'fire',
        location: 'test',
        level: 1,
        steal: 'test',
        drops: 'test',
        enemy_skill: 'test',
      },
      {
        id: 3,
        user_id: users[1].id,
        name: 'test-monster-3',
        hp: 10,
        mp: 10,
        exp: 10,
        gil: 10,
        weakness: 'weakness',
        strength: 'fire',
        location: 'test',
        level: 1,
        steal: 'test',
        drops: 'test',
        enemy_skill: 'test',
      },
    ]
  }

  function makeGuidesArray(users, monsters) {
    return [
      {
        user_id: users[0].id,
        monster_id: monsters[0].id,
        note: 'test note1',
        name: 'test name1',
      },
      {
        user_id: users[1].id,
        monster_id: monsters[2].id,
        note: 'test note2',
        name: 'test name2',
      },
      {
        user_id: users[0].id,
        monster_id: monsters[1].id,
        note: 'test note3',
        name: 'test name3',
      },
    ]
  }

  function makeExpectedMonster(users, monster) {
    const user = users.find(user => user.id === monster.user_id)

    return {
      id: monster.id,
      user_id: user.id,
      user_name: user.user_name,
      name: monster.name,
      hp: monster.hp,
      mp: monster.mp,
      exp: monster.exp,
      gil: monster.gil,
      weakness:  monster.weakness,
      strength: monster.strength,
      location: monster.location,
      level: monster.level,
      steal: monster.steal,
      drops: monster.drops,
      enemy_skill: monster.enemy_skill
    }
  }

  function makeMaliciousMonster(user) {
    const maliciousMonster = {
      id: 911,
      user_id: user.id,
      name: 'evil <script>alert("xss");</script>',
      hp: 10,
      mp: 10,
      exp: 10,
      gil: 10,
      weakness: `Bad image <img src="https://url.to.file.which/does-not.exist" onerror="alert(document.cookie);">. But not <strong>all</strong> bad.`,
      strength: 'evil <script>alert("xss");</script>',
      location: 'evil <script>alert("xss");</script>',
      level: 1,
      steal: 'evil <script>alert("xss");</script>',
      drops: 'evil <script>alert("xss");</script>',
      enemy_skill: 'evil <script>alert("xss");</script>',
    }

    const expectedMonster = {
      ...makeExpectedMonster([user], maliciousMonster),
      name: 'evil &lt;script&gt;alert(\"xss\");&lt;/script&gt;',
      weakness: `Bad image <img src="https://url.to.file.which/does-not.exist">. But not <strong>all</strong> bad.`,
      strength: 'evil &lt;script&gt;alert(\"xss\");&lt;/script&gt;',
      location: 'evil &lt;script&gt;alert(\"xss\");&lt;/script&gt;',
      steal: 'evil &lt;script&gt;alert(\"xss\");&lt;/script&gt;',
      drops: 'evil &lt;script&gt;alert(\"xss\");&lt;/script&gt;',
      enemy_skill: 'evil &lt;script&gt;alert(\"xss\");&lt;/script&gt;'
    }

    return {
      maliciousMonster,
      expectedMonster
    }
  }

  function makeMonstersFixtures() {
    const testUsers = makeUsersArray()
    const testMonsters = makeMonstersArray(testUsers)
    const testGuides = makeGuidesArray(testUsers, testMonsters)

    return {
      testUsers,
      testMonsters,
      testGuides
    }
  }

  function cleanTables(db) {
    return db.transaction(trx => 
      trx.raw(
        `TRUNCATE
        users,
        monsters,
        guides`
      )
        
    )
  }

  function seedUsers(db, users) {
    const preppedUsers = users.map(user => ({
      ...user,
      password: bcrypt.hashSync(user.password, 1)
    }))

    return db
      .into('users')
      .insert(preppedUsers)
  }

  function seedMonstersTables(db, users, monsters) {
    //group queries and rollback on failure
    return db.transaction(async trx => {
      await seedUsers(trx, users)
      await trx.into('monsters').insert(monsters)
    })
  }

  function seedMaliciousMonster(db, user, monster) {
    return seedUsers(db, [user])
      .then(() => 
        db  
          .into('monsters')
          .insert([monster])
      )
  }

  function makeAuthHeader(user, secret = process.env.JWT_SECRET) {
    const token = jwt.sign(
      { user_id: user.id }, secret, 
      { subject: user.user_name, algorithm: 'HS256' }
    )

    return `Bearer ${token}`
  }

  function makePostTestMonster() {
    return {
      user_id: 1,
      name: 'test-monster-4',
      hp: 10,
      mp: 10,
      exp: 10,
      gil: 10,
      weakness: 'weakness',
      strength: 'fire',
      location: 'test',
      level: 1,
      steal: 'test',
      drops: 'test',
      enemy_skill: 'test',
    }
  }

  function makePostTestGuide() {
    let guide = {
      user_id: 1,
      monster_id: 2,
      name: 'test-name3',
      note: 'test note3',
    }
    return guide
  }

  module.exports = {
    makeUsersArray,
    makeMonstersArray,
    makeGuidesArray,
    makeExpectedMonster,
    makeMaliciousMonster,
    makeMonstersFixtures,
    cleanTables,
    seedUsers,
    seedMonstersTables,
    seedMaliciousMonster,
    makeAuthHeader,
    makePostTestMonster,
    makePostTestGuide
  }