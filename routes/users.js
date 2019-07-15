const express = require("express");
const router = express.Router();
const userController = require("../app/api/controllers/users");
const uploadMiddleware = require("../middleware/streamToGCS");

router.post("/signUp", userController.signUpUser);
router.post("/signIn", userController.signInUser);

router.post(
  "/upload",
  uploadMiddleware.multer.single("file"),
  uploadMiddleware.streamUploadToGCS,
  userController.uploadImage
);

router.post("/gallery", userController.gallery);


module.exports = router;