const connection = require("../databases/mysql");

const departmentService = {
  getDepartments: () =>
    new Promise((resolve, reject) => {
      connection.query(
        `SELECT DepartmentID as departmentId, DepartmentName as departmentName FROM Department`,
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
  departmentService,
};
