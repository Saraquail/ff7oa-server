module.exports = {
  PORT: process.env.PORT || 8000,
  NODE_ENV: process.env.NODE_ENV || 'development',
  DATABASE_URL: process.env.DB_URL || 'postgresql://saraquail@localhost/ff7oa',
  JWT_SECRET: process.env.JWT_SECRET || '@5oi2h4o2380s9#56adiw',
  TEST_DATABASE_URL: process.env.DB_URL || 'postgresql://saraquail@localhost/ff7oa-test',

}