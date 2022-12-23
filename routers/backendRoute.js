const express = require("express");
const dashboardController = require("../controllers/dashboardController");
const researchController = require("../controllers/researchController");
const { authenticateJWT, isAdmin } = require("../middleware/authMiddleware")
const router = express.Router();

router.get("/dashboard", authenticateJWT, isAdmin, dashboardController.get);
router.get("/getResearch", authenticateJWT, isAdmin, researchController.getAll);

module.exports = router;
