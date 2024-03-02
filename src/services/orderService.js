const connection = require("../databases/mysql");

var Order = function (order = {}) {
  let {
    customer_fullname,
    shipping_address,
    customer_phone,
    customer_email,
    payment_method,
  } = order;
  this.customer_fullname = customer_fullname;
  this.shipping_address = shipping_address;
  this.customer_phone = customer_phone;
  (this.customer_email = customer_email),
    (this.payment_method = payment_method);
};

const orderService = {
  getOrderDetail: async ({ orderId = undefined }) => {
    let orderDetail = await new Promise((resolve, reject) => {
      connection.query(
        `SELECT * from orders where order_id=${orderId}`,
        (error, results) => {
          if (error) {
            return reject(error);
          }
          return resolve(results[0]);
        }
      );
    });
    let orderItems = await new Promise((resolve, reject) => {
      connection.query(
        `
          SELECT p.ProductId, p.ProductName, p.ProductPrice, oi.quantity 
          from order_items oi  
          join Product p on p.ProductId = oi.product_id
          where oi.order_id=${orderId}
        `,
        (error, results) => {
          if (error) {
            return reject(error);
          }
          return resolve(results);
        }
      );
    });
    return { ...orderDetail, items: orderItems };
  },
  getOrders: () =>
    new Promise((resolve, reject) => {
      connection.query(`SELECT * from orders`, (error, results) => {
        if (error) {
          return reject(error);
        }
        return resolve(results);
      });
    }),
  createOrder: (newOrder) => {
    return new Promise((resolve, reject) =>
      connection.query(
        `INSERT INTO orders set ?`,
        {
          ...newOrder,
          order_status: "0",
          shipping_status: "0",
        },
        (error, results) => {
          if (error) {
            return reject(error);
          }
          return resolve(results);
        }
      )
    );
  },
  updateOrder: (id, updateOrder, callback) => {
    connection.query(
      `UPDATE orders set order_status = ?, shipping_status = ? WHERE order_id = ${id}`,
      [updateOrder.order_status, updateOrder.shipping_status],
      callback
    );
  },
  deleteOrder: (id) => {
    return new Promise((resolve, reject) => {
      connection.query(
        `DELETE FROM orders WHERE order_id = ${id}`,
        (error, results) => {
          if (error) {
            console.log(error);
            return reject(error);
          }
          return resolve(results);
        }
      );
    });
  },
  checkOrderIdExists: (id) =>
    new Promise((resolve, reject) => {
      connection.query(
        `
      SELECT EXISTS(select * from orders
      where order_id = '${id}') as isExisted
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
  orderService,
  Order,
};
