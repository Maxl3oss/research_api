const express = require("express");
const dashboardController = require("../controllers/dashboardController");
const { authenticateJWT, isAdmin } = require("../middleware/authMiddleware")
const router = express.Router();

router.get("/get", authenticateJWT, isAdmin, dashboardController.get);

module.exports = router;
