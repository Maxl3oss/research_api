const express = require("express");
const researchController = require("../controllers/researchController");
const { authenticateJWT } = require("../middleware/authMiddleware")
const router = express.Router();
const path = require("path");
// upload File
const multer = require("multer");
const storage = multer.diskStorage({
   destination: function (req, file, cb) {
      cb(null, path.join(__dirname, '../uploads/') + file.fieldname);
   },
   filename: function (req, file, cb) {
      cb(null, Date.now() + '-' + file.fieldname + "." + file.originalname.split(".").pop());
   }
});
const upload = multer({
   storage: storage,
   limits: {
      fileSize: 50000000, // Around 10MB
   },
   abortOnLimit: true,
});

// router.get("/get", researchController.getAll);
router.get("/get", researchController.getLimit);
router.get("/get/:id", researchController.getById);
router.post("/post", upload.any(), authenticateJWT, researchController.post);
router.post("/update", upload.any(), authenticateJWT, researchController.updateResearch)
router.get("/file/:id/download", authenticateJWT, researchController.getFileById);
router.get("/myResearch/:id", authenticateJWT, researchController.getResearchByUser);
router.post("/del", authenticateJWT, researchController.delResearchByUser);

module.exports = router;
