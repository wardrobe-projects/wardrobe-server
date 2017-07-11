const passport = require('koa-passport')
const fetchUser = require('../controllers/userController').fetchUser
const bcrypt = require('bcryptjs');

passport.serializeUser(function(user, done) {
  done(null, user.id)
})

passport.deserializeUser(async function(id, done) {
  try {
    const user = await fetchUser()
    done(null, user)
  } catch(err) {
    done(err)
  }
})

const LocalStrategy = require('passport-local').Strategy
passport.use(new LocalStrategy(function(username, password, done) {
  fetchUser(username)
    .then(user => {
      if (username === user.username && bcrypt.compareSync(password, user.password)) {
        console.log('true')
      } else {
        done(null, false)
      }
    })
    .catch(err => done(err))
}));

module.exports = passport;