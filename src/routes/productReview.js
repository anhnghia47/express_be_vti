const express = require("express");
const { positionService } = require("../services/positionService");
const { authorization } = require("../utils/auth");
const {
  productReviewService,
  ProductReview,
} = require("../services/productReviewService");
const router = express.Router();

router.post("/", authorization, async (req, res) => {
  try {
    let { productId, rating } = req.body;
    if (!productId || !rating) {
      res.status(400).send({ message: "ProductId, rating are required" });
    }
    if (!req?.userId) {
      throw Error;
    }
    let newReview = new ProductReview({
      productId,
      rating,
      accountId: `${req?.userId}`,
    });
    productReviewService
      .createReview(newReview)
      .then((result) => {
        res.send({
          data: "Successful",
        });
      })
      .catch((err) => {
        throw err;
      });
  } catch (error) {
    console.log(err);
    res.status(403).send({ message: "For hidden" });
  }
});

module.exports = router;
