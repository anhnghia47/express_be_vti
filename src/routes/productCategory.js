const express = require("express");
const {
  categoryService,
  Category,
} = require("../services/productCategoryService");
const router = express.Router();

/**
 * @swagger
 * /product-categories:
 *  get:
 *     summary: Get all categories
 *     tags:
 *     - categories
 *     description: Get all categories
 *
 *     responses:
 *       200:
 *         description: App is up and running
 */
router.get("/", async (req, res) => {
  const categories = await categoryService.getCategories();

  res.send({
    data: categories,
  });
});

/**
 * @swagger
 * /product-categories/{id}:
 *  get:
 *     summary: Get the category by id
 *     tags:
 *     - Categories
 *     parameters:
 *       - in: path
 *         name: id
 *     requestBody:
 *      required: true
 *     description: Get category detail
 *
 *     responses:
 *       200:
 *         description: App is up and running
 */
router.get("/:id", async (req, res, next) => {
  const categoryId = req.params.id;
  try {
    let isExisted = await categoryService.checkCategoryIdExists(categoryId);

    if (!isExisted) {
      res.status(404).send({ message: "Category not found" });
      return;
    }
    categoryService
      .getCategoryDetail(categoryId)
      .then((result) => {
        res.send({ data: result });
      })
      .catch((err) => {
        throw Error;
      });
  } catch (error) {
    res.status(404).send({ message: "Something went wrong" });
  }
});

/**
 * @swagger
 * /product-categories:
 *  post:
 *     summary: create new category
 *     tags:
 *     - categories
 *     description: Create new category
 *
 *     responses:
 *       200:
 *         description: App is up and running
 */
router.post("/", async (req, res) => {
  try {
    console.log(req.body);
    const { categoryName } = req.body;
    if (!categoryName) {
      res.status(400).json({
        message: "CategoryName are required",
      });
      return;
    }
    const category = new Category({ categoryName });
    categoryService.createProductCategory(category, (err, result) => {
      if (err) {
        next(err);
      } else {
        res.send({ message: "Successful" });
      }
    });
  } catch (err) {
    res.status(400).json({ message: err.message });
  }
});

/**
 * @swagger
 * /product-categories/{id}:
 *  put:
 *     summary: Edit the category by id
 *     tags:
 *     - Categories
 *     parameters:
 *       - in: path
 *         name: id
 *     requestBody:
 *      required: true
 *     description: Edit category detail
 *
 *     responses:
 *       200:
 *         description: App is up and running
 */
router.put("/:id", async (req, res, next) => {
  const categoryId = req.params.id;
  try {
    let isExisted = await categoryService.checkCategoryIdExists(categoryId);

    if (!isExisted) {
      res.status(404).send({ message: "Category not found" });
      return;
    }
    const updateCategory = new Category({
      ...req.body,
      categoryName: req.body?.categoryName,
    });
    categoryService.updateProductCategory(
      categoryId,
      updateCategory,
      (err, result) => {
        if (err) {
          next(err);
        } else {
          res.send({ message: "Edit product detail" });
        }
      }
    );
  } catch (error) {}
});

// Delete a product category by ID
router.delete("/:id", async (req, res, next) => {
  try {
    const categoryId = req.params.id;
    let isExisted = await categoryService.checkCategoryIdExists(categoryId);
    if (!isExisted) {
      res.status(404).send({ message: "Category not found" });
      return;
    }
    await categoryService.deleteCategory(categoryId, (err, result) => {
      if (err) {
        next(err);
      } else {
        res.send({ msg: "Delete succesful" });
      }
    });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

module.exports = router;
