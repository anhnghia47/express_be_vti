const connection = require("../databases/mysql");

var Account = function (account = {}) {
  this.Email = account.email;
  this.Username = account.username;
  this.FullName = account.fullName;
  this.DepartmentID = account.departmentId;
  this.PositionID = account.positionId;
  if (account.password) {
    this.password = account.password;
  }
  this.isAdmin = account.isAdmin || 0;
};

const accountService = {
  auth: (data, callback) => {
    connection.query(
      "SELECT * FROM Account WHERE username = ?",
      [data?.username, data?.password],
      callback
    );
  },
  getTotalAccount: () =>
    new Promise((resolve, reject) => {
      connection.query(
        `SELECT COUNT(AccountID) as total FROM Account`,
        (error, results) => {
          if (error) {
            return reject(error);
          }
          return resolve(results[0]?.total);
        }
      );
    }),
  getAccounts: ({ page=1, limit=10, search = "" }, callback) => {
    connection.query(
      `
      select 
        AccountID as accountId, Email as email, Username as username, FullName as fullName, 
        A.DepartmentID as departmentId, D.DepartmentName as departmentName, A.PositionID as positionId, 
        P.PositionName as positionName, CreateDate as createDate, isAdmin
        from Account as A  
        inner join Department as D on D.DepartmentID = A.DepartmentID
        inner join Position as P on P.PositionID = A.PositionID
        where concat(FullName, Email, Username) LIKE '%${search}%'
      ${page ? `limit ${(page - 1) * limit}, ${limit} ` : ""} 
      `,
      callback
    );
  },
  getAccountDetail: (id) => {
    return new Promise((resolve, reject) => {
      connection.query(
        `
        select 
          AccountID as accountId, Email as email, Username as username, FullName as fullName, 
          A.DepartmentID as departmentId, D.DepartmentName as departmentName, A.PositionID as positionId, 
          P.PositionName as positionName, CreateDate as createDate, isAdmin 
        from Account as A
        left join Department as D on D.DepartmentID = A.DepartmentID
        left join Position as P on P.PositionID = A.PositionID
        where A.AccountID = '${id}'
        `,
        (error, results) => {
          if (error) {
            return reject(error);
          }
          return resolve(results[0]);
        }
      );
    })
  },
  checkEmailExists: (email) =>
    new Promise((resolve, reject) => {
      connection.query(
        `
        SELECT EXISTS(select * from Account
        where Email = '${email}') as isExisted
      `,
        (error, results) => {
          if (error) {
            return reject(error);
          }
          return resolve(Boolean(results[0]?.isExisted));
        }
      );
    }),

  checkUsernameExists: (username) =>
    new Promise((resolve, reject) => {
      connection.query(
        `
        SELECT EXISTS(select * from Account
        where Username = '${username}') as isExisted
      `,
        (error, results) => {
          if (error) {
            return reject(error);
          }
          return resolve(Boolean(results[0]?.isExisted));
        }
      );
    }),
  createAccount: (newAccount, callback) => {
    connection.query(`INSERT INTO Account set ?`, newAccount, callback);
  },
  updateAccount: (id, updateAccount, callback) => {
    connection.query(
      `UPDATE Account set ? WHERE AccountID = ${id}`,
      updateAccount,
      callback
    );
  },
  deleteAccount: (id, callback) => {
    connection.query(`DELETE FROM Account WHERE AccountID = ${id}`, callback);
  },
};

module.exports = {
  Account,
  accountService,
};
