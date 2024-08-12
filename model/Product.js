const mongoose = require("mongoose");
const Schema = mongoose.Schema;
const productSchema = new Schema({
  category: { type: String, require: true },
  img1: { type: String, require: true },
  img2: { type: String, require: true },
  img3: { type: String, require: true },
  img4: { type: String, require: true },
  long_desc: { type: String, require: true },
  name: { type: String, require: true },
  price: { type: Number, require: true },
  short_desc: { type: String, require: true },
  stock: { type: Number, default: 0 },
});
module.exports = mongoose.model("Product", productSchema);
