const express = require("express");
const { productService, Product } = require("../services/productServices");
const { imgPath } = require("../utils/file");
const { productReviewService } = require("../services/productReviewService");
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
  let { page, limit, search, categoryId } = req.query;
  productService.getProducts(
    { page, limit, search, categoryId },
    async (err, result) => {
      if (err) {
        next(err);
      } else {
        res.send({
          data: result,
          metadata: {
            total: await productService.getTotalProduct(search, categoryId),
            page,
            limit,
          },
        });
      }
    }
  );
});

/**
 * @swagger
 * /products/{id}:
 *  get:
 *     summary: Get the product by id
 *     tags:
 *     - Products
 *     parameters:
 *       - in: path
 *         name: id
 *     requestBody:
 *      required: true
 *     description: Get product detail
 *
 *     responses:
 *       200:
 *         description: App is up and running
 */
router.get("/:id", async (req, res, next) => {
  const productId = req.params.id;
  try {
    let isExisted = await productService.checkProductIDExists(productId);

    if (!isExisted) {
      res.status(404).send({ message: "Product not found" });
      return;
    }
    let avgReview = await productReviewService.getProductReview(productId);
    productService
      .getProductDetail(productId)
      .then((result) => {
        res.send({ data: { ...result, ratingStar: avgReview } });
      })
      .catch((err) => {
        throw Error;
      });
  } catch (error) {
    console.log(error);
    res.status(404).send({ message: "Something went wrong" });
  }
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
  const { productName, productPrice, productInfo } = req.body;
  console.log(req.body);
  //handles null error
  if (!(productName && productPrice && productInfo)) {
    res.status(400).send({
      error: true,
      message:
        "ProductName, productPrice, productInfo are required",
    });
    return;
  }
  var newProduct = new Product({
    ...req.body,
    productImage: req.file?.filename ? imgPath(req.file.filename) : null,
  });
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
  const productId = req.params.id;

  let isExisted = await productService.checkProductIDExists(productId);

  if (!isExisted) {
    res.status(404).send({ message: "Product not found" });
    return;
  }
  const updateAccount = new Product({
    ...req.body,
    productId: productId,
    productImage: req.file?.filename ? imgPath(req.file.filename) : null,
  });
  productService.updateProduct(productId, updateAccount, (err, result) => {
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
