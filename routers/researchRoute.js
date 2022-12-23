const express = require("express");
const researchController = require("../controllers/researchController");
const { authenticateJWT, isAdmin } = require("../middleware/authMiddleware")
const router = express.Router();
const path = require("path");
// upload File
const multer = require("multer");

const upload = multer({
   // storage: storage,
   limits: {
      fieldSize: 10 * 1024 * 1024,
      fileSize: 50000000, // Around 10MB
   },
   abortOnLimit: true,
});

// router.get("/get", researchController.getAll);
router.get("/get", researchController.getLimit);
router.get("/get/:id", researchController.getById);
router.post("/post", upload.any(), authenticateJWT, researchController.post);
router.post("/update", upload.any(), authenticateJWT, researchController.updateResearchCloud);
// router.get("/file/:id/download", authenticateJWT, researchController.getFileById);
router.get("/myResearch/:id", authenticateJWT, researchController.getResearchByUser);
router.post("/del", authenticateJWT, researchController.delResearchByUser);

router.post("/isVerified", authenticateJWT, isAdmin, researchController.isVerifiedResearch);
module.exports = router;
