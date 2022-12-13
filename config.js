const CONFIG = {
  SECRET_KEY: 'balalaika',
  SESSION_KEY: 'supersecret',
  USER_URL: 'mongodb://localhost:27017/usersdb',
  POSTS_URL: 'mongodb://localhost:27017/postsdb',
  SESSION_URL: 'mongodb://localhost:27017/store',
  PORT: 80,
  // TODO: need to improve (to DB)
  REFRESH_TOKENS: {},
  DB_MODELS: {
      USER: 'User',
      POST: 'Post'
  }
};

module.exports = CONFIG;