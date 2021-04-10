const fs = require('fs');
const path = require('path');

const p = path.join(
  path.dirname(process.mainModule.filename),
  'data',
  'cart.json'
);


module.exports = class Cart {
  static addProduct(id, productPrice) {
    // Fetch the previous cart
    fs.readFile(p, (err, fileContent) => {
      let cart = { products: [], totalPrice: 0 };
      if (!err) {
        cart = JSON.parse(fileContent);
      }
      // Analyze the cart => Find existing product
      const existingProductIndex = cart.products.findIndex(
        prod => prod.id === id
      );
      const existingProduct = cart.products[existingProductIndex];
      let updatedProduct;
      // Add new product/ increase quantity
      if (existingProduct) {
        updatedProduct = { ...existingProduct };
        updatedProduct.qty = updatedProduct.qty + 1;
        cart.products = [...cart.products];
        cart.products[existingProductIndex] = updatedProduct;
      } else {
        updatedProduct = { id: id, qty: 1 };
        cart.products = [...cart.products, updatedProduct];
      }
      cart.totalPrice = cart.totalPrice + +productPrice;
      fs.writeFile(p, JSON.stringify(cart), err => {
        console.log(err);
      });
    });
  }

  static deleteProduct(id,productPrice) {
    fs.readFile(p, (err,fileContent) => {
      if(err) return;
      const updatedCart = JSON.parse(fileContent);
      const reqProd = updatedProduct.products.find(prod => rod.id===id);
      const qty = reqProd.qty;
       updatedCart.products = updatedProduct.products.filter(prod => prod.id!==id);
      updatedProduct.totalPrice = updatedCart.totalPrice - productPrice*qty;
      fs.writeFile(p, JSON.stringify(updatedCart), err => {
        console.log(err);
    });
  });
}
};