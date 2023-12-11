const connection = require("../databases/mysql");

var ShippingBranch = function (data = {}) {
  let { branchName, branchAddress } = data;
  if (branchName) {
    this.branchName = branchName;
  }
  if (branchAddress) {
    this.branchAddress = branchAddress;
  }
};

const shippingBranchService = {
  getShippingBranchs: () =>
    new Promise((resolve, reject) => {
      connection.query(`SELECT * FROM Shipping_Branch`, (error, results) => {
        if (error) {
          return reject(error);
        }
        return resolve(results);
      });
    }),
  createShippingBranch: (newShippingBranch, callback) => {
    connection.query(
      `INSERT INTO Shipping_Branch set ?`,
      newShippingBranch,
      callback
    );
  },
  updateShippingBranch: (id, updateShippingBranch, callback) => {
    connection.query(
      `UPDATE Shipping_Branch set ? WHERE branchId = ${id}`,
      updateShippingBranch,
      callback
    );
  },
  deleteShippingBranch: (id, callback) => {
    connection.query(
      `DELETE FROM Shipping_Branch WHERE branchId = ${id}`,
      callback
    );
  },
  checkBranchIdExists: (id) =>
    new Promise((resolve, reject) => {
      connection.query(
        `
      SELECT EXISTS(select * from Shipping_Branch
      where branchId = '${id}') as isExisted
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
  shippingBranchService,
  ShippingBranch,
};
