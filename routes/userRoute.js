const express = require("express");
const app = express();
const userController = require("../controllers/userController");
const router = express.Router();
const multer = require("multer");
const cloudinary = require("cloudinary").v2;
const fs = require("fs");
const { User } = require("../models");

const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    console.log(file);
    cb(null, "public/images");
  },
  filename: (req, file, cb) => {
    cb(null, `${Date.now()}.${file.mimetype.split("/")[1]}`);
  },
});

const upload = multer({
  storage: storage,
  fileFilter: (req, file, cb) => {
    if (
      file.mimetype.split("/")[1] === "jpeg" ||
      file.mimetype.split("/")[1] === "jpg" ||
      file.mimetype.split("/")[1] === "png"
    ) {
      cb(null, true);
    } else {
      cb(new Error("this file is not a photo"));
    }
  },
});

router.get("/personal", userController.protect, userController.personal);
router.get("/other-user/:id", userController.protect, userController.otherUserData);

router.post("/search", userController.protect, userController.searchUser);

router.patch("/update-profile", userController.protect, userController.update);

router.patch(
  "/change-password",
  userController.protect,
  userController.changePassword
);

router.patch(
  "/user-img",
  userController.protect,
  upload.single("image"),
  async (req, res, next) => {
    cloudinary.uploader.upload(req.file.path, async (err, result) => {
      const userImg = await User.update(
        { profileImg: result.secure_url },
        {
          where: {
            id: req.user.id,
          },
        }
      );

      const user = await User.findOne({ where: { id: req.user.id } });
      fs.unlinkSync(req.file.path);
      res.status(200).json({ message: "img uploaded already", user });
    });
  }
);

router.patch(
  "/background-img",
  userController.protect,
  upload.single("backgroundImage"),
  async (req, res, next) => {
    cloudinary.uploader.upload(req.file.path, async (err, result) => {
      const userImg = await User.update(
        { backgroundImg: result.secure_url },
        {
          where: {
            id: req.user.id,
          },
        }
      );

      const user = await User.findOne({ where: { id: req.user.id } });
      fs.unlinkSync(req.file.path);
      res.status(200).json({ message: "img uploaded already", user });
    });
  }
);

module.exports = router;
