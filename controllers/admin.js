const Product = require('../models/product');

exports.getAddProduct = (req, res, next) => {
  res.render('admin/add-product', {
    pageTitle: 'Add Product',
    path: '/add-product',
    formsCSS: true,
    productCSS: true,
    activeAddProduct: true,
    isAuthenticated: req.session.isLoggedIn
  });
};


exports.postAddProduct = (req, res, next) => {
  const title = req.body.title;
  const imageUrl = req.body.imageUrl;
  const price = req.body.price;
  const description = req.body.description;
  const product = new Product({
    title: title,
    price: price,
    description: description,
    imageUrl: imageUrl,
    userId: req.user,
    likes: 0
  });
  product.save()               //save method coming from mongoose
  .then(result => {
    req.user.addPainting(product);
    console.log('Created Product');
     res.redirect('/Aproducts');
  })
  .catch(err => {
    console.log(err);
  });
 };


exports.getEditProduct = (req,res,next) => {
  const prodId = req.params.productId;
  Product.findById(prodId)
  .then(product => {

    if(!product) return res.redirect('/products');
    res.render('admin/edit-product', {
        pageTitle: 'Edit Product',
        path: '/edit-product',
        editing: true,
        product: product,
        isAuthenticated: req.session.isLoggedIn
    });
  })
  .catch(err => console.log(err));
};


exports.postEditProduct = (req, res, next) => {
  const prodId = req.body.productId;
  const updatedTitle = req.body.title;
  const updatedPrice = req.body.price;
  const updatedImageUrl = req.body.imageUrl;
  const updatedDesc = req.body.description;

  Product.findById(prodId).then(product => {
    if(product.userId.toString() !== req.user._id.toString()){
      return res.redirect('/products');
    }
    product.title = updatedTitle;
    product.price = updatedPrice;
    product.description = updatedDesc;
    product.imageUrl = updatedImageUrl;
    return product.save()
    .then(result => {
      console.log('UPDATED PRODUCT!');
      res.redirect('/Aproducts');
    });
  })
    .catch(err => console.log(err));
};


exports.getProducts = (req, res, next) => {
  Product.find({userId: req.user._id})
    .then(products => {
      res.render('admin/Aproducts', {
        prods: products,
        pageTitle: 'Admin Products',
        path: '/Aproducts',
        isAuthenticated : req.session.isLoggedIn
      });
    })
    .catch(err => console.log(err));
};


exports.postDeleteProduct = (req, res, next) => {
  const prodId = req.body.productId;
  Product.deleteOne({_id:prodId, userId:req.user._id})
    .then(() => {
      console.log('DESTROYED PRODUCT');
      res.redirect('/Aproducts');
    })
    .catch(err => console.log(err));
};
