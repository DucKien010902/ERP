const mongoose = require('mongoose');

const Schema = mongoose.Schema;

const products = new Schema({
  Id: String,
  pdImage: String,
  pdName: String,
  pdDes: String,
  pdPrice: Number,
  pdVouncher: Number,
  pdCountSale: Number,
  pdStar: Number,
  pdDayDelivery: String,
});
module.exports = mongoose.model('products', products);
