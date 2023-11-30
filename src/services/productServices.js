const connection = require("../databases/mysql");

var Product = function (product = {}) {
  if (product.productId) {
    this.ProductId = product.productId;
  }
  if (product.productName) {
    this.ProductName = product.productName;
  }
  if (product.productPrice) {
    this.ProductPrice = product.productPrice;
  }
  if (product.productInfo) {
    this.ProductInfo = product.productInfo;
  }
  if (product.productDetail) {
    this.ProductDetail = product.productDetail;
  }
  if (product.ratingStar) {
    this.RatingStar = product.ratingStar;
  }
  if (product.productImage) {
    this.ProductImage = product.productImage;
  }
  if (product.manufacturerId) {
    this.ManufacturerId = product.manufacturerId;
  }
  if (product.categoryId) {
    this.CategoryId = product.categoryId;
  }
};

const productService = {
  getProducts: ({ page, limit, search = "", categoryId = null }, callback) => {
    connection.query(
      `
      select 
        A.ProductId as productId, ProductName as productName, ProductPrice as productPrice, ProductInfo as productInfo, 
        ProductDetail as productDetail, ProductImage as productImage,
        A.CategoryId as categoryId, A.ManufacturerId as manufacturerId,
        C.CategoryName as categoryName, M.ManufacturerName as manufacturerName,
        COALESCE(AVG(R.rating), 0) AS ratingStar

      from Product as A
        left join Category as C on C.CategoryId = A.CategoryId
        left join Manufacturer as M on M.ManufacturerId = A.ManufacturerId
        LEFT JOIN Product_Review as R ON A.ProductId = R.ProductId

      GROUP BY A.ProductId
      HAVING concat(ProductName) LIKE '%${search}%' ${
        categoryId ? `AND A.CategoryId = ${categoryId}` : ""
      } ${page ? `limit ${(page - 1) * limit}, ${limit} ` : ""} `,
      callback
    );
  },
  getProductDetail: (id) => {
    return new Promise((resolve, reject) => {
      connection.query(
        `
        select 
        ProductId as productId, ProductName as productName, ProductPrice as productPrice, ProductInfo as productInfo, 
        ProductDetail as productDetail, RatingStar as ratingStar, ProductImage as productImage,
        A.CategoryId as categoryId, A.ManufacturerId as manufacturerId,
        C.CategoryName as categoryName, M.ManufacturerName as manufacturerName
        from Product as A
        left join Category as C on C.CategoryId = A.CategoryId
        left join Manufacturer as M on M.ManufacturerId = A.ManufacturerId
        where A.ProductId = '${id}'
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
  getTotalProduct: (search = "", categoryId = null) =>
    new Promise((resolve, reject) => {
      connection.query(
        `SELECT COUNT(ProductId) as total FROM Product 
          where concat(ProductName) LIKE '%${search}%' ${
          categoryId ? `AND CategoryId = '${categoryId}'` : ""
        }`,
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
  checkProductIDExists: (id) =>
    new Promise((resolve, reject) => {
      connection.query(
        `
        SELECT EXISTS(select * from Product
        where ProductId = '${id}') as isExisted
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
