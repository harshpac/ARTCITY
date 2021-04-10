const User = require('../models/user');
const bcrypt = require('bcryptjs');
const crypto = require('crypto');

exports.getLogin = (req, res, next) => {
let msg = req.flash('error');
if(msg.length>0) msg = msg[0];
else msg = null;


    res.render('auth/login', {
      path: '/login',
      pageTitle: 'Login',
      isAuthenticated: false,
      errorMessage: msg
    });
  };


  exports.postLogin = (req,res,next) => {
      const email = req.body.email;
      const password = req.body.password;

      User.findOne({email: email})
      .then(user => {
        if(!user){
          req.flash('error','Invalid email or Password');
          return res.redirect('/login');
        }

        bcrypt.compare(password,user.password)
        .then(doMatch => {
          if(doMatch){
            req.session.isLoggedIn = true;
            req.session.user = user;
            return req.session.save(err => {
              console.log(err);
              res.redirect('/products');
            })
          }
          res.redirect('/login');
        })
        .catch(err => {
          console.log(err);
          res.redirect('/login');
        });
      })
      .catch(err => console.log(err));
    };



exports.postLogout = (req, res, next) => {
  req.session.destroy(err => {
    console.log(err);
    res.redirect('/products');
  });
};
// exports.googleLogin = (req,res,next) =>{
//
//
//
// }

exports.getSignup = (req,res,next) => {
 res.render('auth/signup', {
   path: '/signup',
   pageTitle: 'SignUp',
   isAuthenticated: false
 });
};


exports.postSignup = (req,res,next) => {
  const email = req.body.email;
  const password = req.body.password;
  const confirmPassword = req.body.confirmPassword;

  User.findOne({email: email})
  .then(userDoc => {
    if(userDoc){
      return res.redirect('/signup');
    }
    return bcrypt.hash(password,12)
    .then(hashedPassword => {
      const user = new User({
        email: email,
        password: hashedPassword,
        cart: { items : [] },
        likedPaintings: {items: []},
          createdPaintings:{items: []}
      })
      return user.save();
    })
    .then(result => {
      res.redirect('/login');
    });
  })
  .catch(err => {
    console.log(err);
  });
};

exports.getReset = (req,res,next) => {

let msg = req.flash('error');
if(msg.length>0) msg = msg[0];
else msg = null;

    res.render('auth/reset', {
      path: '/reset',
      pageTitle: 'Reset Password',
      isAuthenticated: false,
      errorMessage: msg
    });
}

exports.postReset = (req,res,next) => {

  crypto.randomBytes(32 , (err,buffer) => {
    if(err) return res.redirect('/reset')

    const token = buffer.toString('hex');

    User.findOne({email: req.body.email})
     .then(user => {
       if(!user){
         req.flash('error','No user with that email id');
         return res.redirect('/reset');
       }
       user.resetToken = token;
      user.resetTokenExpiration = Date.now() + 360000;
      return user.save();
     })
     .then(result => {
       res.redirect('/products');
       transporter.sendMail({
         to: 'harshpachauri3001@gmail.com',
         from: 'nodeshopqwerty@gmail.com',
         subject: 'Password Reset',
         html: `
         <p>You requested a password reset</p>
         <p>Click this <a href="http://localhost:3000/reset/${token}">link</a> to set a new password.</p>
       `
       });
     })
     .catch(err => console.log(err));
  });
};

exports.getNewPassword = (req,res,next) => {

  const token = req.params.token;

  User.findOne({resetToken: token, resetTokenExpiration: { $gt:  Date.now()  }})
  .then(user => {
  let msg = req.flash('error');
  if(msg.length>0) msg = msg[0];
  else msg = null;

      res.render('auth/new-password', {
        path: '/newPassword',
        pageTitle: 'New Password',
        errorMessage: msg,
        userId: user._id.toString()
      });
  })
  .catch(err => console.log(err));
};

exports.postNewPassword = (req,res,next) => {
  const password = req.body.password;
  const userId = req.body.userId;
  const passwordToken = req.body.passwordToken;

  let resetUser;

  User.findOne({
    resetToken: passwordToken,
    resetTokenExpiration: {$gt: Date.now()},
    _id: userId
  })
  .then(user => {
    resetUser = user;
    return bcrypt.hash(password,12);
  })
  .then(hashedPassword => {
    resetUser.password = hashedPassword;
    resetUser.resetToken = undefined;
    resetUser.resetTokenExpiration = undefined;
    return resetUser.save();
  })
  .then(result => {
    res.redirect('/login');
  })
  .catch(err => {
    console.log(err);
  });
};
