require("dotenv").config();
const path = require('path');
const express = require('express');
const bodyParser = require('body-parser');
const app = express();
const session = require('express-session');
const mongoDBStore = require('connect-mongodb-session')(session);
const passport=require("passport");
const passportLocalMongoose=require("passport-local-mongoose");
var findOrCreate = require('mongoose-findorcreate');
const Mongodb_uri = `mongodb+srv://${process.env.USERNAM}:${process.env.PASSWORD}@cluster0.wcen1.mongodb.net/paintings?retryWrites=true&w=majority`;
// console.log(Mongodb_uri);
// console.log(process.env.USERNAM);
// console.log(process.env.PASSWORD);
const csrf = require('csurf');
const flash = require('connect-flash');
const GoogleStrategy = require('passport-google-oauth20').Strategy;
var FacebookStrategy=require("passport-facebook").Strategy;
app.use(passport.initialize());

const mongoose = require('mongoose');
 const Schema = mongoose.Schema;
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
 const userSchema=new mongoose.Schema( {
   email:String,
   password:String,
   googleId:String,
   facebookId:String,
   cart: {
     items: [
       {
         productId: {
           type: Schema.Types.ObjectId,
           ref: 'Product',
           required: true
         },
         quantity: { type: Number, required: true }
       }
     ]
   },
   secret:String,
   likedPaintings:{
    items: [
      {
        productId: {
          type: Schema.Types.ObjectId,
          ref: 'Product',
          required: true
        }
      }
    ]
  }
 });
 // google authorization starts here
 userSchema.plugin(passportLocalMongoose);
 userSchema.plugin(findOrCreate);

 const User=new mongoose.model("user",userSchema);
 passport.use(User.createStrategy());
 passport.serializeUser(function(user, done) {
   done(null, user.id);
 });

 passport.deserializeUser(function(id, done) {
   User.findById(id, function(err, user) {
     done(err, user);
   });
 });
 passport.use(new GoogleStrategy({
    clientID: process.env.CLIENT_ID,
    clientSecret: process.env.CLIENT_SECRET,
    callbackURL: "http://localhost:3000/auth/google/art",
    userProfileURL:"https://www.googleapis.com/oauth2/v3/userinfo"
  },
  function(accessToken, refreshToken, profile, cb) {

    User.findOne({
           email: profile.emails[0].value
       }, function(err, user) {
           if (err) {
               return done(err);
           }
           //No user was found... so create a new user with values from Facebook (all the profile. stuff)
           if (!user) {
               user = new User({

                   email: profile.emails[0].value,
                   googleId:profile.id,
                  cart: { items : [] },
                  likedPaintings: { items: [] }
                   //now in the future searching on User.findOne({'facebook.id': profile.id } will match because of this next line

               });
               user.save(function(err) {
                   if (err) console.log(err);
                   return cb(err, user);
               });
           } else {
               //found user. Return
               user.googleId=profile.id;
               return cb(err, user);
           }
       });
    // User.findOrCreate({email:profile.emails[0].value,googleId:profile.id }, function (err, user) {
    //
    //      console.log(user);
    //   return cb(err, user);
    // });
  }
));
app.get("/auth/google",
  passport.authenticate("google",{ scope: ["profile","email"] })
);
  app.get("/auth/google/art",
  passport.authenticate("google", { failureRedirect: '/login' }),
  function(req, res) {
// console.log(req.user);
    // Successful authentication, redirect home.
    req.session.isLoggedIn = true;
    req.session.user = req.user;
    return req.session.save(err => {
      console.log(err);
      res.redirect('/');
    });
  });
  // google authorizatio ends here
  // facebook authrorization starts here
  passport.use(new FacebookStrategy({
      clientID: process.env.FB_APP_ID,
      clientSecret: process.env.FB_APP_SECRET,
      callbackURL: "http://localhost:3000/auth/facebook/art",
profileFields: ['id', 'emails', 'name'] //This
    },
    function(accessToken, refreshToken, profile, cb) {
      // console.log(profile.emails[0].value);
      User.findOne({
             email: profile.emails[0].value
         }, function(err, user) {
             if (err) {
                 return cb(err);
             }
             //No user was found... so create a new user with values from Facebook (all the profile. stuff)
             if (!user) {
                 user = new User({

                     email: profile.emails[0].value,
                     facebookId:profile.id,
                    cart: { items : [] },
                    likedPaintings: { items: [] }
                     //now in the future searching on User.findOne({'facebook.id': profile.id } will match because of this next line

                 });
                 user.save(function(err) {
                     if (err) console.log(err);
                     return cb(err, user);
                 });
             } else {
                 //found user. Return
        
                 return cb(err, user);
             }
         });
      // User.findOrCreate({ email:profile.emails[0].value,facebookId: profile.id ,cart: { items : [] }}, function (err, user) {
      //
      //   return cb(err, user);
      // });
    }
  ));
  app.get("/auth/facebook",
  passport.authenticate("facebook",{ scope: ["email","public_profile"] })
);

  app.get("/auth/facebook/art",
  passport.authenticate('facebook', { failureRedirect: '/login' }),
  function(req, res) {
    // Successful authentication, redirect home.
    req.session.isLoggedIn = true;
    req.session.user = req.user;
    return req.session.save(err => {
      console.log(err);
      res.redirect('/');
    });
  });






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


 mongoose.connect(Mongodb_uri, { useNewUrlParser: true, useUnifiedTopology: true })
 .then(result => {
     app.listen(3000),console.log('i am listening at 3000');
 })
 .catch(err => console.log(err));
