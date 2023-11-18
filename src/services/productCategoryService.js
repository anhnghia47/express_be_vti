const connection = require("../databases/mysql");

const categoryService = {
  getCategories: () =>
    new Promise((resolve, reject) => {
      connection.query(
        `SELECT CategoryId as categoryId, CategoryName as categoryName FROM Category`,
        (error, results) => {
          if (error) {
            return reject(error);
          }
          return resolve(results);
        }
      );
    }),
};

module.exports = {
  categoryService,
};
