const mongoose = require("mongoose");
const Schema = mongoose.Schema;
const orderSchema = new Schema({
  user: { type: Schema.Types.ObjectId, ref: "User", require: true },
  products: [
    {
      productData: {
        productId: { type: Schema.Types.ObjectId, ref: "Product" },
        category: { type: String, require: true },
        img1: { type: String, require: true },
        img2: { type: String, require: true },
        img3: { type: String, require: true },
        img4: { type: String, require: true },
        long_desc: { type: String, require: true },
        name: { type: String, require: true },
        price: { type: Number, require: true },
        short_desc: { type: String, require: true },
      },
      count: Number,
    },
  ],
  totalPrice: { type: Number, require: true },
  name: { type: String },
  phone: { type: String },
  address: { type: String },
  delivery: { type: Boolean },
  status: { type: Boolean },
});
module.exports = mongoose.model("Order", orderSchema);
