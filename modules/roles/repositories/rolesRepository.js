const connection = require("../../../config/database");

const getRoles = () => {
  return new Promise((resolve, reject) => {
    connection.query(
      'SELECT id, name FROM roles',
      (error, results) => {
        if (error) return reject(error);
        resolve(results);
      }
    );
  });
};

module.exports = {
  getRoles
};
