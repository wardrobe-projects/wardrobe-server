const koa = require('koa');
const mongoose = require('mongoose');
const bodyParser = require('koa-bodyparser');
const route = require('koa-route');
const logger = require('koa-logger');
const koaRes = require('koa-res');
const convert = require('koa-convert');

const user = require('./controllers/userController')

const app = new koa();

const session = require('koa-generic-session')
const MongoStore = require('koa-generic-session-mongo')



mongoose.promise = global.promise;

mongoose.connect('mongodb://127.0.0.1:27017/wardrobe')
        .then((res) => {
            console.log('mongo connection created');
        }) 
        .catch((err) => {
            console.log('error connecting to Mongo');
        })

app.keys = ['wardrobe', 'wardrobe1']
app.use(convert(session({
  store: new MongoStore ()
})))

const passport = require('./auth/auth'); 
app.use(passport.initialize())
app.use(passport.session())        

app.use(logger());
app.use(bodyParser());
app.use(convert(koaRes()));

app.use(route.post('/signup', user.createUser))

app.use(route.post('/signin', function (ctx, next) {
  return passport.authenticate('local', function (err, user) {
    if (!user) {
      ctx.status = 401;
      ctx.body = { success: false }
    } else {
      ctx.body = { success: true}
      ctx.status = 200;
      return ctx.login(user)
    }
  })(ctx, next)  
}));

app.use(function(ctx, next) {
  if (ctx.isAuthenticated()) {
    return next()
  } else {
    ctx.redirect('/')
  }
});

app.listen(3000);
