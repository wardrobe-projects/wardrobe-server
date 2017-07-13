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
});

const LocalStrategy = require('passport-local').Strategy
passport.use(new LocalStrategy({
  session: true
}, function(username, password, done) {
  fetchUser(username)
    .then(user => {
      if (username === user.username && bcrypt.compareSync(password, user.password)) {
       return done(null, user)
      } else {
        done(null, false, {error : 'Not Login'})
      }
    })
    .catch(err => done(err))
}));

module.exports = passport;
