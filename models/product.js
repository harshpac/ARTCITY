const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const productSchema = new Schema({
  title: {
    type: String,
    required: true
  },
  price: {
    type: Number,
    required: true
  },
  description: {
    type: String,
    required: true
  },
  imageUrl: {
    type: String,
    required: true
  },
  userId: {
    type: Schema.Types.ObjectId,
    ref: 'User',
    required: true
  },
  likes: {
    type: Number,
    required: true
  },
  userLiked: {
    userId: [
      {
      type: String
    }
    ]
  }
});

module.exports = mongoose.model('Product', productSchema);







// const getDb = require('../util/database').getDb;
// const mongodb = require('mongodb');

// class Product {
//   constructor(title,price,description,imageUrl,id){
//     this.title = title;
//     this.price = price;
//     this.description = description;
//     this.imageUrl = imageUrl;
//     this.id = id;
//   }
//   save(){
//     const db = getDb();
//          console.log(this.id);
//     let dbOp;
//     if(this._id){
//        dbOp = db
//         .collection('products')
//         .updateOne({ id: this.id });
//     }
//     else{
//       this.id = Math.random().toString();
//       dbOp = db.collection('products').insertOne(this);
//     }
//     return dbOp
//     .then(result => {
//       console.log(result);
//     })
//     .catch(err => {
//       console.log(err);
//     });
//   }

//   static fetchAll() {
//     const db = getDb();
//     return db
//     .collection('products')
//     .find()
//     .toArray()
//     .then(products => {
//       console.log(products);
//       return products;
//     })
//     .catch(err => {
//       console.log(err);
//     });
//   }

//   static findById(prodId){
//     const db = getDb();
//     return db.collection('products').find({id: prodId})
//     .next()
//     .then(product => {
//       console.log(product);
//       return product;
//     })
    
//     .catch(err => {
//       console.log(err);
//     });
//   }

  
//   static deleteById(prodId) {
//     const db = getDb();
//     return db
//       .collection('products')
//       .deleteOne({ id: prodId })
//       .then(result => {
//         console.log('Deleted');
//       })
//       .catch(err => {
//         console.log(err);
//       });
//   }
// }

// module.exports = Product;