require("dotenv").config();
const path = require('path');
const express = require('express');
const bodyParser = require('body-parser');
const app = express();
const session = require('express-session');
const mongoDBStore = require('connect-mongodb-session')(session);
var findOrCreate = require('mongoose-findorcreate');
const Mongodb_uri = `mongodb+srv://${process.env.USERNAM}:${process.env.PASSWORD}@cluster0.wcen1.mongodb.net/paintings?retryWrites=true&w=majority`;
// console.log(Mongodb_uri);
// console.log(process.env.USERNAM);
// console.log(process.env.PASSWORD);
const port = process.env.PORT || 3000;
const csrf = require('csurf');
const flash = require('connect-flash');

const mongoose = require('mongoose');
 const store = new mongoDBStore({
     uri: Mongodb_uri,
     collection: 'sessions'
 });
 app.use(
     session({
       secret: 'my secret',
       resave: false,
       saveUninitialized: false,
       store: store
     })
   );

  const csrfProtection = csrf();

  app.set('view engine','ejs');
  app.set('views','views');
  const errControl = require('./controllers/error');

  const adminData = require('./routes/admin');
  const shopData = require('./routes/shop');

  const authRoutes = require('./routes/auth');
  const Usser = require('./models/user');


  app.use(bodyParser.urlencoded({ extended: false }));
  app.use(express.static(path.join(__dirname, 'public')));


   app.use(csrfProtection);
   app.use(flash());
  app.use((req, res, next) => {
      if (!req.session.user) {
        return next();
      }
      Usser.findById(req.session.user._id)
        .then(user => {
          req.user = user;
          next();
        })
        .catch(err => console.log(err));
    });


  app.use((req, res, next) => {
    res.locals.isAuthenticated = req.session.isLoggedIn;
    res.locals.csrfToken = req.csrfToken();
    next();
  });


  app.use(adminData);
  app.use(shopData);
  app.use(authRoutes);

  app.use(errControl.errController);


 mongoose.connect(Mongodb_uri)
 .then(result => {
     app.listen(port);
 })
 .catch(err => console.log(err));
