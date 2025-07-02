const connection = require("../../../config/database");

const saveSession = (employee_id, session_id) => {
  return new Promise((resolve) => {
    const query = `INSERT INTO user_sessions (employee_id, session_id, created_at) VALUES (?, ?, NOW())`;
    const values = [employee_id, session_id];

    connection.query(query, values, (error, results) => {
      if (error) return resolve(false);
      resolve(true);
    });
  });
};

const findSessionByEmployeeId = (employee_id) => {
  return new Promise((resolve) => {
    const query = `SELECT * FROM user_sessions WHERE employee_id = ?`;
    const values = [employee_id];

    connection.query(query, values, (error, results) => {
      if (error) return resolve([]);
      resolve(results);
    });
  });
};

const deleteSessionByEmployeeId = (employee_id) => {
  return new Promise((resolve) => {
    const query = `DELETE FROM user_sessions WHERE employee_id = ?`;
    const values = [employee_id];

    connection.query(query, values, (error, results) => {
      if (error) return resolve(false);
      resolve(true);
    });
  });
};

module.exports = {
  saveSession,
  findSessionByEmployeeId,
  deleteSessionByEmployeeId,
};
