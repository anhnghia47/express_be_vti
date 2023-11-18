const express = require("express");
const { categoryService } = require("../services/productCategoryService");
const router = express.Router();

/**
 * @swagger
 * /categories:
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

module.exports = router;
