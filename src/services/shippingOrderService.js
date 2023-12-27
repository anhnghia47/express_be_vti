const connection = require("../databases/mysql");

var ShippingOrder = function (shippingOrder = {}) {
  let { shippingOrderId, shippingOrderName } = shippingOrder;
  if (shippingOrderId) {
    this.CategoryId = shippingOrderId;
  }
  if (shippingOrderName) {
    this.CategoryName = shippingOrderName;
  }
};

const shippingOrderService = {
  getShippingOrderDetail: ({ orderId = undefined }) =>
  new Promise((resolve, reject) => {
    connection.query(
      `
        SELECT *, branchName FROM Shipping_Order O
        left join Shipping_Branch B on B.branchId = O.branchId 
        group by O.orderID
        having O.orderId=${orderId}
      `,
      (error, results) => {
        if (error) {
          return reject(error);
        }
        return resolve(results[0]);
      }
    );
  }),
  getShippingOrders: ({ branchId = undefined }) =>
    new Promise((resolve, reject) => {
      connection.query(
        `
          SELECT *, branchName FROM Shipping_Order O
          left join Shipping_Branch B on B.branchId = O.branchId 
          group by O.orderID
          ${branchId ? `having O.branchId=${branchId}` : ""}
        `,
        (error, results) => {
          if (error) {
            return reject(error);
          }
          return resolve(results);
        }
      );
    }),
  createShippingOrder: (newShippingOrder, callback) => {
    connection.query(
      `INSERT INTO Shipping_Order set ?`,
      newShippingOrder,
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
  shippingOrderService,
  ShippingOrder,
};
