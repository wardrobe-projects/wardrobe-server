const User = require('../models/user')

exports.createUser = async (ctx) => {
  const { username, password } = ctx.request.body
  try {
    let user = await User.findOne({ username });
    if (!user) {
      user = new User({
        username,
        password
      });
      user.password = user.generateHash(user.password)
      await user.save();
    }
  } catch (err) {
    ctx.status = 500
    return ctx.body = { error: 'error'}
  }
}

exports.fetchUser = async (username, password) => {
  try {
    let user = await User.findOne({ username });
    return user
    } catch (err) {
      return { error: 'error'}
    }
}