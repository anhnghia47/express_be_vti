const express = require("express");
const { productService, Product } = require("../services/productServices");
const router = express.Router();

/**
 * @swagger
 * /products:
 *  get:
 *     summary: Get Products
 *     tags:
 *     - Products
 *     description: Get Products
 *
 *     responses:
 *       200:
 *         description: App is up and running
 */
router.get("/", (req, res, next) => {
  let { page, limit, search } = req.query;
  productService.getProducts({ page, limit, search }, async (err, result) => {
    if (err) {
      next(err);
    } else {
      res.send({
        data: result,
        metadata: {
          total: await productService.getTotalProduct(),
          page,
          limit,
        },
      });
    }
  });
});

/**
 * @swagger
 * /products:
 *  post:
 *     summary: Create a product
 *     tags:
 *     - Products
 *     requestBody:
 *      required: true
 *     description: Create product detail
 *
 *     responses:
 *       200:
 *         description: App is up and running
 */
router.post("/", async (req, res, next) => {
  const { productName, productPrice, productInfo, categoryId, manufacturerId } =
    req.body;
  //handles null error
  if (
    !(
      productName &&
      productPrice &&
      productInfo &&
      categoryId &&
      manufacturerId
    )
  ) {
    res.status(400).send({
      error: true,
      message:
        "ProductName, productPrice, productInfo, categoryId, manufacturerId are required",
    });
    return;
  }
  var newProduct = new Product(req.body);
  const isExisted = await productService.checkProductNameExists(productName);
  if (isExisted) {
    res.status(400).send({ error: true, message: "Product name is existed" });
    return;
  }
  productService.createProduct(newProduct, (err, result) => {
    if (err) {
      next(err);
    } else {
      res.send({ message: "Successful" });
    }
  });
});

/**
 * @swagger
 * /products/{id}:
 *  put:
 *     summary: Edit the product by id
 *     tags:
 *     - Products
 *     parameters:
 *       - in: path
 *         name: id
 *     requestBody:
 *      required: true
 *     description: Edit product detail
 *
 *     responses:
 *       200:
 *         description: App is up and running
 */
router.put("/:id", async (req, res, next) => {
  const accountId = req.params.id;
  const updateAccount = new Product({ ...req.body, productId: accountId });
  productService.updateProduct(accountId, updateAccount, (err, result) => {
    if (err) {
      next(err);
    } else {
      res.send({ message: "Edit product detail" });
    }
  });
});

/**
 * @swagger
 * /products/{id}:
 *  delete:
 *     summary: Remove the product by id
 *     tags:
 *     - Products
 *     parameters:
 *       - in: path
 *         name: id
 *     requestBody:
 *      required: true
 *
 *     responses:
 *       200:
 *         description: App is up and running
 */
router.delete("/:id", (req, res, next) => {
  productService.deleteProduct(req.params.id, (err, result) => {
    if (err) {
      next(err);
    } else {
      res.send({ msg: "Delete succesful" });
    }
  });
});

module.exports = router;
