const Product = require('../models/product');
const Order = require('../models/orders');
const User= require('../models/user');


 exports.getProducts = (req, res, next) => {
   Product.find()
   .then(products => {

     res.render('shop/product-list', {
       prods: products,
       pageTitle: 'All Products',
       path: '/products',
       isAuthenticated: req.session.isLoggedIn
     });
   })
   .catch(err => {
     console.log(err);
   });
 };

 exports.getTrending = (req, res, next) => {
    Product.find()
    .then(products => {
      let pds = products.sort((a,b) => {
        if(a.likes < b.likes) return 1;
        else if(a.likes > b.likes) return -1;
        else return 0;
      });
      if(pds.length > 3)
      pds = pds.slice(0, 3);
      console.log(pds);
      res.render('shop/enter', {
        prods: pds,
        pageTitle: 'On Trend',
        path: '/trending',
        isAuthenticated: req.session.isLoggedIn
      });
    })
 }


 exports.getProduct = (req, res, next) => {
   const prodId = req.params.productId;
   console.log(req.params);
   console.log('e');
   Product.findById(prodId)
   .then(prodd => {
        User.findById(prodd.userId).then(user => {
          console.log(user);
          res.render('shop/product-detail', {
           product: prodd,
           pageTitle: prodd.title,
           path: '/products',
           isAuthenticated: req.session.isLoggedIn,
           name: user.email,
           authorId:user._id
        });

   });
   })
   .catch(err => {
     console.log(err);
   });
};
exports.getAuthor = (req,res,next) =>  {
 const authorId=req.params.authorId;
 console.log("hello");
 User.findById(authorId).then(user =>{
   console.log(user.createdPaintings);
     res.render('shop/author-detail', {
       array: user.createdPaintings,
       pageTitle:"creator",
       path: '/creator',
       isAuthenticated: req.session.isLoggedIn
     })
 });
}

  exports.getEnter = (req, res, next) => {
    Product.find()
    .then(products => {
      let pds = products.sort((a,b) => {
        if(a.likes < b.likes) return 1;
        else if(a.likes > b.likes) return -1;
        else return 0;
      });
      if(pds.length > 3)
      pds = pds.slice(0, 3);
      //console.log(pds);
      res.render('shop/enter', {
        prods: pds,
        pageTitle: 'On Trend',
        path: '/trending',
        isAuthenticated: req.session.isLoggedIn
      });
    })
   };

   exports.getIndex = (req, res, next) => {
    Product.find()
    .then(products => {
    res.render('shop/Index', {
    prods: products,
    pageTitle: 'Shop',
    path: '/products',
    isAuthenticated: req.session.isLoggedIn
    });
    })
    .catch(err => {
      console.log(err);
    });
};



  exports.postCart = (req, res, next) => {
    const prodId = req.body.productId;
    Product.findById(prodId)
    .then(product => {
      return req.user.addToCart(product);
    })
 .then(result => {
   res.redirect('/cart');
 });
 };

 exports.postLike = (req, res, next) => {
   const prodId = req.body.productId;
   const userId = req.user._id;
   let pr;
   Product.findById(prodId)
   .then(product => {
     if(product.userLiked.userId.includes(userId.toString())){
       return;
     }
      product.likes = product.likes+1;
      product.userLiked.userId.push(userId.toString());
      product.save().then(res => {
        req.user.saveToLiked(product);
      }).catch(err => console.log(err));
   })
   .catch(err => console.log(err));
   console.log('liked');
   return res.redirect('/products');
 }

 exports.getCart = (req,res,next) => {
   console.log(req.session);
    req.user
    .populate('cart.items.productId')
    .execPopulate()
    .then(user => {
      const products = user.cart.items;
      res.render('shop/cart',{
        path: '/cart',
        pageTitle: 'Cart',
        products: products,
        isAuthenticated: req.session.isLoggedIn
      });
    })
    .catch(err => {
      console.log(err);
    });
 };

 exports.postcartDeleteProduct = (req,res,next) => {
   const prodId = req.body.productId;
   console.log(req.prodId);
   req.user
   .removeFromCart(prodId)
   .then(result => {
     res.redirect('/cart');
   })
   .catch(err => console.log(err));
 };

 exports.postOrder = (req, res, next) => {
console.log(req.user);
  req.user
    .populate('cart.items.productId')
    .execPopulate()
    .then(user => {
      const products = user.cart.items.map(i => {
        return { quantity: i.quantity, product: { ...i.productId._doc } };
      });
      const order = new Order({
        user: {
          name: req.user.email,
          userId: req.user
        },
        products: products
      });
      return order.save();
    })
    .then(result => {
    return req.user.clearCart();
    })
    .then(() => {
      res.redirect('/orders');
    })
    .catch(err => console.log(err));
};
exports.getCheck = (req,res,next) =>{

  res.render('shop/checkout-form',{

  });


}


exports.getOrders = (req,res,next) => {
  Order.find({'user.userId': req.user._id})
  .then(orders => {
    res.render('shop/orders', {
      path: '/orders',
      orders: orders,
      pageTitle: 'Your Orders',
      isAuthenticated: req.session.isLoggedIn
    });
  })
  .catch(err => console.log(err));
};


//  exports.getCart = (req, res, next) => {
//    res.render('shop/cart', {
//      path: '/cart',
//      pageTitle: 'Your Cart',
//      products: []
//    });
//  };


 exports.getCheckout = (req, res, next) => {
   res.render('shop/checkout', {
     path: '/checkout',
     pageTitle: 'Checkout',
     isAuthenticated: req.session.isLoggedIn
   });
 };
