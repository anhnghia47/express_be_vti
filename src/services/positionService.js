const connection = require("../databases/mysql");

const positionService = {
  getPositions: () =>
    new Promise((resolve, reject) => {
      connection.query(
        `SELECT PositionID as positionId, PositionName as positionName FROM Position`,
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
  positionService,
};
