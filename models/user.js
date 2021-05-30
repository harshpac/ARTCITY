const mongoose = require('mongoose');

 const Schema = mongoose.Schema;

 const userSchema = new Schema({
   email: {
     type: String,
    required:true,
   },
   password: {
     type: String,

   },
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
   },
   createdPaintings: [
    {
      title: {type: String},
      price: {type: Number},
      imageUrl: {type: String}
    }
  ]
 });

 userSchema.methods.addToCart = function(product) {
   const cartProductIndex = this.cart.items.findIndex(cp => {
     return cp.productId.toString() === product._id.toString();
   });
   let newQuantity = 1;
   const updatedCartItems = [...this.cart.items];

   if (cartProductIndex >= 0) {
     newQuantity = this.cart.items[cartProductIndex].quantity + 1;
     updatedCartItems[cartProductIndex].quantity = newQuantity;
   } else {
     updatedCartItems.push({
       productId: product._id,
       quantity: newQuantity
     });
   }
   const updatedCart = {
     items: updatedCartItems
   };
   this.cart = updatedCart;
   return this.save();
 };





 userSchema.methods.saveToLiked = function(product){
  const savedIndex = this.likedPaintings.items.findIndex(cp => {
   return cp.productId.toString() === product._id.toString();
 });
 const updatedSaved = [...this.likedPaintings.items];

 if (savedIndex >= 0) {
  return;
 } else {
   updatedSaved.push({
     productId: product._id
   });
 }
 const updatedCart = {
   items: updatedSaved
 };
 this.likedPaintings = updatedCart;

 return this.save();
}
userSchema.methods.addPainting = function(product) {
   let pp =  {
     title: product.title,
     price: product.price,
     imageUrl: product.imageUrl
   }
  const mine = [...this.createdPaintings];
  mine.push(pp);
  this.createdPaintings = mine;
  return this.save();
}






 userSchema.methods.removeFromCart = function(product_id){
     const updatedCartItems = this.cart.items.filter(cp => {
         return cp.productId.toString() !== product_id.toString();
     });
     this.cart.items=updatedCartItems;
     return this.save();
 }

userSchema.methods.clearCart = function() {
      this.cart = { items: [] };
      return this.save();
}

 module.exports = mongoose.model('User', userSchema);
