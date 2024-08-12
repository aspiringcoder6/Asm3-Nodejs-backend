const Product = require("../model/Product");
const User = require("../model/User");

exports.addCart = async (req, res, next) => {
  const { idUser, idProduct, count } = req.body;
  try {
    const product = await Product.findById(idProduct);
    const user = await User.findById(idUser);
    // Check if product already exists in the cart
    const cartProductIndex = user.cart.products.findIndex((p) => {
      p.productData.productId.toString() === idProduct.toString();
    });
    let updatedCartProducts = [...user.cart.products];

    if (cartProductIndex >= 0) {
      //update count
      updatedCartProducts[cartProductIndex].count += count;
    } else {
      //add product
      updatedCartProducts.push({
        productData: { ...product, productId: idProduct },
        count: count,
      });
    }

    // Update total price
    const updatedTotalPrice = user.cart.totalPrice + product.price * count;

    user.cart = {
      products: updatedCartProducts,
      totalPrice: updatedTotalPrice,
    };

    await user.save();

    return res.status(200).json({ message: "Cart updated successfully" });
  } catch (err) {
    console.error("Error updating cart:", err);
    return res.status(500).json({ message: "Internal server error" });
  }
};
exports.getCart = (req, res, next) => {
  const userId = req.query.id;
  return User.findById(userId).then((user) => {
    if (!user) {
      return res.status(401).json({ message: "Invalid User" });
    }
    return res.status(200).json({ cart: user.cart });
  });
};
exports.deleteItem = (req, res, next) => {
  const userId = req.body.userId;
  const productId = req.body.productId;
  return User.findById(userId)
    .then((user) => {
      if (!user) {
        return res.status(401).json({ message: "User not found!" });
      }
      var deletedProduct;

      const updatedCartProducts = user.cart.products.filter((product) => {
        if (product.productData.productId.toString() === productId) {
          deletedProduct = product;
        }
        return product.productData.productId.toString() !== productId;
      });
      user.cart = {
        products: updatedCartProducts,
        totalPrice:
          user.cart.totalPrice -
          deletedProduct.productData.price * deletedProduct.count,
      };
      res.status(200).json({ message: "Delete successfully" });
      return user.save();
    })
    .catch((err) => {
      res.status(500).json({ message: "Internal server error" });
    });
};
exports.updateCount = (req, res, next) => {
  const { userId, productId, updateCount } = req.body;
  return User.findById(userId)
    .then((user) => {
      if (!user) {
        return res.status(401).json({ message: "User not found!" });
      }
      let updatedCartProducts = [...user.cart.products];
      const updatedItemIndex = user.cart.products.findIndex((p) => {
        return p.productData.productId.toString() === productId;
      });
      //Update price bằng việc trừ đi số tiền count cũ thêm mới vào
      const updatedTotalPrice =
        user.cart.totalPrice -
        updatedCartProducts[updatedItemIndex].productData.price *
          (updatedCartProducts[updatedItemIndex].count - updateCount);
      updatedCartProducts[updatedItemIndex] = {
        productData: updatedCartProducts[updatedItemIndex].productData,
        count: updateCount,
      };
      user.cart = {
        products: updatedCartProducts,
        totalPrice: updatedTotalPrice,
      };
      return user.save();
    })
    .then(() => {
      return res.status(200).json({ message: "Update successfully!" });
    })
    .catch(() => {
      return res.status(500).json({ message: "Internal server errors" });
    });
};
