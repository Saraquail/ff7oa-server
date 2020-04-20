const REGEX_UPPER_LOWER_NUMBER = /(?=.*[a-z])(?=.*[A-Z])(?=.*[0-9])+/

const xss = require('xss')
const bcrypt = require('bcryptjs')

const UsersService = {
  validatePassword(password) {
    if (password.length < 6) {
      return 'Password must be longer than 6 characters'
    }
    if (password.length > 72) {
      return 'Password must be less than 72 characters'
    }
    if (password.startsWith(' ') || password.endsWith(' ')) {
      return 'Password must not start or end with empty spaces'
    }
    if (!REGEX_UPPER_LOWER_NUMBER.test(password)) {
      return 'Password must contain 1 upper case, lower case, and number'
    }
    return null
  },

  hashPassword(password) {
    return bcrypt.hash(password, 12)
  },

  doesUserExist(db, user_name) {
    return db('ff7oa_users')
      .where({ user_name })
      .first()
      .then(user => !!user)
  },

  getUserIdByName(db, user_name) {
    return db
      .from('ff7oa_users AS users')
      .select('users.id')
      .where({user_name})
      .first()
  },


  insertUser(db, newUser) {
    return db
      .insert(newUser)
      .into('ff7oa_users')
      .returning('*')
      .then(([user]) => user)
  },
  
  serializeUser(user) {
    return {
      id: user.id,
      user_name: xss(user.user_name),
    }
  }
}

module.exports = UsersService