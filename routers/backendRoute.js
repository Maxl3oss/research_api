const express = require("express");
const dashboardController = require("../controllers/dashboardController");
const researchController = require("../controllers/researchController");
const usersController = require("../controllers/usersController");
const { authenticateJWT, isAdmin } = require("../middleware/authMiddleware")
const router = express.Router();

router.get("/dashboard", authenticateJWT, isAdmin, dashboardController.get);
router.get("/getResearch", authenticateJWT, isAdmin, researchController.getAllResearch);
router.get("/getUsers", authenticateJWT, isAdmin, usersController.getAll);
router.post("/delUser", authenticateJWT, isAdmin, usersController.delUserById);
router.post("/verified", authenticateJWT, isAdmin, usersController.verifiedUser);
router.post("/unVerified", authenticateJWT, isAdmin, usersController.unVerifiedUser);


module.exports = router;
