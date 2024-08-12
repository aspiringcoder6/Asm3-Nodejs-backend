const Product = require("../model/Product");
//Lấy tất cả product
exports.getProducts = (req, res, next) => {
  return Product.find()
    .then((products) => {
      return res.status(200).json({ products: products });
    })
    .catch((err) => {
      res.status(500).json({ message: "Internal server error." });
    });
};
exports.getProductById = (req, res, next) => {
  const id = req.query.id;
  return Product.findById(id)
    .then((product) => {
      return res.status(200).json({ product: product });
    })
    .catch((err) => {
      return res.status(500).json({ message: "Internal server error" });
    });
};
exports.getPagination = async (req, res, next) => {
  const { page, count, search, category } = req.body;
  try {
    let query = {};
    if (search) {
      query.name = { $regex: search, $options: "i" };
    }
    if (category.toLowerCase() !== "all") {
      query.category = category;
    }
    const skip = (page - 1) * count;

    const products = await Product.find(query).skip(skip).limit(count);
    const totalProducts = await Product.countDocuments(query);

    res.status(200).json({
      products: products,
      totalPages: Math.ceil(totalProducts / count),
      totalProducts,
    });
  } catch (err) {
    console.log(err);
  }
};
exports.createProduct = async (req, res, next) => {
  const { name, category, short_desc, long_desc, price, stock } = req.body;
  const images = req.files;
  if (!images) {
    return res.status(401).json({ message: "No images attached!" });
  }
  const imageUrls = images.map((image) => {
    return "http://localhost:5000" + `/images/${image.filename}`;
  });
  const newProduct = new Product({
    name,
    category,
    price,
    short_desc,
    long_desc,
    img1: imageUrls[0],
    img2: imageUrls[1],
    img3: imageUrls[2],
    img4: imageUrls[3],
    stock,
  });
  res.status(200).json({ message: "Product created successfully!" });
  return newProduct.save();
};
//update
exports.updateProduct = async (req, res, next) => {
  try {
    const { productId, name, category, short_desc, long_desc, price, stock } =
      req.body;
    const updateFields = {
      name,
      category,
      short_desc,
      long_desc,
      price,
      stock,
    };
    await Product.updateOne({ _id: productId }, { $set: updateFields });
    return res.status(200).json({ message: "Product updated successfully" });
  } catch (err) {
    return res.status(500).json({ message: "Internal server errors" });
  }
};
exports.deleteProduct = async (req, res, next) => {
  console.log(1);
  try {
    const productId = req.query.id;
    await Product.deleteOne({ _id: productId });
    return res.status(200).json({ message: "Product deleted successfully" });
  } catch (err) {
    return res.status(500).json({ message: "Internal server errors" });
  }
};
