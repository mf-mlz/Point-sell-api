const sessionsRepository = require("../repositories/sessionsRepository");

const saveSession = (employee_id, session_id) => {
  return sessionsRepository.saveSession(employee_id, session_id);
};

const findSessionByEmployeeId = (employee_id) => {
  return sessionsRepository.findSessionByEmployeeId(employee_id);
};

const deleteSessionByEmployeeId = (employee_id) => {
  return sessionsRepository.deleteSessionByEmployeeId(employee_id);
};

module.exports = {
  saveSession,
  findSessionByEmployeeId,
  deleteSessionByEmployeeId,
};
