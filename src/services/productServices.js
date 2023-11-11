const connection = require("../databases/mysql");

var Product = function (product = {}) {
  this.ProductId = product.productId;
  this.ProductName = product.productName;
  this.ProductPrice = product.productPrice;
  this.ProductInfo = product.productInfo;
  this.ProductDetail = product.productDetail;
  this.RatingStar = product.ratingStar;
  this.ProductImageName = product.productImageName;
  this.ManufacturerId = product.manufacturerId;
  this.CategoryId = product.categoryId;
};

const productService = {
  getProducts: ({ page, limit, search='' }, callback) => {
    connection.query(
      `
      select 
      ProductId as productId, ProductName as productName, ProductPrice as productPrice, ProductInfo as productInfo, 
      ProductDetail as productDetail, RatingStar as ratingStar, ProductImageName as productImageName,
      A.CategoryId as categoryId, A.ManufacturerId as manufacturerId,
      C.CategoryName as categoryName, M.ManufacturerName as manufacturerName
      from Product as A
      inner join Category as C on C.CategoryId = A.CategoryId
      inner join Manufacturer as M on M.ManufacturerId = A.ManufacturerId
      where concat(ProductName) LIKE '%${search}%'
      ${page ? `limit ${(page - 1) * limit}, ${limit} ` : ""}
      `,
      callback
    );
  },
  getTotalProduct: () =>
    new Promise((resolve, reject) => {
      connection.query(
        `SELECT COUNT(ProductId) as total FROM Product`,
        (error, results) => {
          if (error) {
            return reject(error);
          }
          return resolve(results[0]?.total);
        }
      );
    }),
  checkProductNameExists: (name) =>
    new Promise((resolve, reject) => {
      connection.query(
        `
        SELECT EXISTS(select * from Product
        where ProductName = '${name}') as isExisted
      `,
        (error, results) => {
          if (error) {
            return reject(error);
          }
          return resolve(Boolean(results[0]?.isExisted));
        }
      );
    }),
  createProduct: (newProduct, callback) => {
    connection.query(`INSERT INTO Product set ?`, newProduct, callback);
  },
  updateProduct: (id, updateProduct, callback) => {
    connection.query(
      `UPDATE Product set ? WHERE ProductId = ${id}`,
      updateProduct,
      callback
    );
  },
  deleteProduct: (id, callback) => {
    connection.query(`DELETE FROM Product WHERE ProductId = ${id}`, callback);
  },
};

module.exports = {
  Product,
  productService,
};
