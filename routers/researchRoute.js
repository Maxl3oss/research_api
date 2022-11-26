const express = require("express");
const researchController = require("../controllers/researchController");
const { authenticateJWT } = require("../middleware/authMiddleware")
const router = express.Router();

// router.get("/get", researchController.getAll);
router.get("/get", researchController.getLimit);
router.get("/get/:id", researchController.getById);
router.post("/post", authenticateJWT, researchController.post);
router.get("/file/:id/download", authenticateJWT, researchController.getFileById);

module.exports = router;
