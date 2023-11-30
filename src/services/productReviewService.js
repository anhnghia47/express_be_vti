const connection = require("../databases/mysql");

var ProductReview = function (review = {}) {
  if (review.productId) {
    this.ProductId = review.productId;
    this.AccountID = review.accountId;
    this.rating = review.rating;
  }
};

const productReviewService = {
  createReview: (newReview) =>
    new Promise((resolve, reject) => {
      connection.query(
        `INSERT INTO Product_Review set ?`,
        newReview,
        (error, results) => {
          if (error) {
            return reject(error);
          }
          return resolve(results);
        }
      );
    }),
  getProductReview: (id) =>
    new Promise((resolve, reject) => {
      connection.query(
        `SELECT AVG(R.rating) AS result
          FROM Product as P
          LEFT JOIN Product_Review as R ON P.ProductId = R.ProductId
          WHERE P.ProductId = ${id}
          GROUP BY P.ProductId`
        ,
        (error, results) => {
          if (error) {
            return reject(error);
          }
          return resolve(results[0]?.result);
        }
      );
    }),
};

module.exports = {
  ProductReview,
  productReviewService,
};
