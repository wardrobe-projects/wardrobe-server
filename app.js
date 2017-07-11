const koa = require('koa');
const mongoose = require('mongoose');
const bodyParser = require('koa-bodyparser');
const route = require('koa-route');
const logger = require('koa-logger');
const koaRes = require('koa-res');
const convert = require('koa-convert');

const user = require('./controllers/userController')

const app = new koa();

const session = require('koa-session')
app.keys = ['wardrobe']
app.use(session({}, app))


const passport = require('./auth/auth'); 
app.use(passport.initialize())
app.use(passport.session())

mongoose.promise = global.promise;

mongoose.connect('mongodb://127.0.0.1:27017/wardrobe')
        .then((res) => {
            console.log('mongo connection created');
        }) 
        .catch((err) => {
            console.log('error connecting to Mongo');
        })

app.use(logger());
app.use(bodyParser());
app.use(convert(koaRes()));

app.use(route.post('/signup', user.createUser))

app.use(route.post('/signin',
  passport.authenticate('local', {
    successRedirect: '/dashboard',
    failureRedirect: '/signup'
  })
))

app.listen(3000);
