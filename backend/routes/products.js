const { Product } = require("../models/product");
const { Category } = require("../models/category");

const express = require("express");
const router = express.Router();

// router.get(`/`, async (req, res) => {
//   // localhost:3000/api/v1/products?categories=2342342,234234
//   let filter = {};
//   if (req.query.categories) {
//     filter = { category: req.query.categories.split(",") };
//   }

//   const productList = await Product.find(filter).populate("category");

//   if (!productList) {
//     res.status(500).json({ success: false });
//   }
//   res.send(productList);
// });

router.get(`/:id`, async (req, res) => {
  const product = await Product.findById(req.params.id).populate("category");

  if (!product) {
    res.status(500).json({ success: false });
  }
  res.send(product);
});

router.post(`/`, async (req, res) => {
  const category = await Category.findById(req.body.category);
  if (!category) return res.status(400).send("Invalid Category");

  const prod = new Product(req.body);

  product = await prod.save();

  if (!product) return res.status(500).send("The product cannot be created");

  res.send(product);
});

router.put("/:id", async (req, res) => {
  if (!mongoose.isValidObjectId(req.params.id)) {
    return res.status(400).send("Invalid Product Id");
  }
  const category = await Category.findById(req.body.category);
  if (!category) return res.status(400).send("Invalid Category");

  const product = await Product.findByIdAndUpdate(
    req.params.id,
    {
      $set: req.body,
    },
    { new: true }
  );

  if (!product) return res.status(500).send("the product cannot be updated!");

  res.send(product);
});

router.delete("/:id", (req, res) => {
  Product.findByIdAndRemove(req.params.id)
    .then((product) => {
      if (product) {
        return res
          .status(200)
          .json({ success: true, message: "the product is deleted!" });
      } else {
        return res
          .status(404)
          .json({ success: false, message: "product not found!" });
      }
    })
    .catch((err) => {
      return res.status(500).json({ success: false, error: err });
    });
});

router.get(`/get/total`, async (req, res) => {
  const productTotal = await Product.countDocuments();
  console.log("productTotal.....", productTotal);

  if (!productTotal) {
    res.status(500).json({ success: false });
  }
  res.send({
    productTotal: productTotal,
  });
});

router.get(`/featured/:nb`, async (req, res) => {
  const nb = req.params.nb ? req.params.nb : 0;
  const products = await Product.find({ isFeatured: true }).limit(+nb);

  if (!products) {
    res.status(500).json({ success: false });
  }
  res.send(products);
});

module.exports = router;
