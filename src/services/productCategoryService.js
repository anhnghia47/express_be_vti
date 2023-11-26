const connection = require("../databases/mysql");

var Category = function (category = {}) {
  let { categoryId, categoryName } = category;
  if (categoryId) {
    this.CategoryId = categoryId;
  }
  if (categoryName) {
    this.CategoryName = categoryName;
  }
};

const categoryService = {
  getCategoryDetail: (id) => {
    return new Promise((resolve, reject) => {
      connection.query(
        `
          SELECT CategoryId as categoryId, CategoryName as categoryName
          from Category
          where CategoryId = '${id}'
        `,
        (error, results) => {
          if (error) {
            return reject(error);
          }
          return resolve(results[0]);
        }
      );
    });
  },
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
  createProductCategory: (newProductCategory, callback) => {
    connection.query(
      `INSERT INTO Category set ?`,
      newProductCategory,
      callback
    );
  },
  updateProductCategory: (id, updateProductCategory, callback) => {
    connection.query(
      `UPDATE Category set ? WHERE CategoryId = ${id}`,
      updateProductCategory,
      callback
    );
  },
  deleteCategory: (id, callback) => {
    connection.query(`DELETE FROM Category WHERE CategoryId = ${id}`, callback);
  },
  checkCategoryIdExists: (id) =>
    new Promise((resolve, reject) => {
      connection.query(
        `
      SELECT EXISTS(select * from Category
      where CategoryId = '${id}') as isExisted
    `,
        (error, results) => {
          if (error) {
            return reject(error);
          }
          return resolve(Boolean(results[0]?.isExisted));
        }
      );
    }),
};

module.exports = {
  categoryService,
  Category,
};
