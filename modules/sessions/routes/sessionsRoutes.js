const express = require("express");
const router = express.Router();
const sessionsController = require("../controllers/sessionsController");

router.post("/save", sessionsController.saveSession);

router.get("/getByEmployee/:employee_id", sessionsController.findSessionByEmployeeId);

router.delete("/deleteByEmployee/:employee_id", sessionsController.deleteSessionByEmployeeId);

module.exports = router;
