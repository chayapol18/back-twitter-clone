require("dotenv").config();
const express = require("express");
const app = express();
const errorMiddleware = require("./middlewares/error");
const cors = require("cors");
// const { sequelize } = require('./models')
const userRoute = require("./routes/userRoute");
const tweetRoute = require("./routes/tweetRoute");
const followRoute = require("./routes/followRoute");
const blockRoute = require("./routes/blockRoute");
const userController = require("./controllers/userController");
const multer = require("multer");
const cloudinary = require("cloudinary").v2;
const User = require("./models");

app.use(cors());
app.use(express.json());
app.use(express.urlencoded({ extended: false }));

// cloudinary.config({ 
//     cloud_name: 'cloudchayapol', 
//     api_key: '137574558172677', 
//     api_secret: 'dm9TuZma9NQm--ZiCs0_OmZnNKI' 
// });

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

app.post("/user-pic", upload.single("image"), async (req, res, next) => {
  cloudinary.uploader.upload(req.file.path, async (err, result) => {
    const userImg = await User.update(
      { profileImg: result.secure_url },
      {
        where: {
          id: req.user.id,
        },
      }
    );
    fs.unlinkSync(req.file.path);
    res.status(200).json({ message: "img uploaded already", userImg });
  });
  console.log(req.file)
});

app.use("/users", userRoute);
app.use("/tweets", tweetRoute);
app.use("/follows", followRoute);
app.use("/blocks", blockRoute);
app.post("/login", userController.login);
app.post("/register", userController.register);

app.use((req, res, next) => {
  res.status(404).json({ message: "path not found on this server" });
});

app.use(errorMiddleware);

// sequelize.sync({ force: true}).then(() => console.log('DB sync'))

const port = process.env.PORT;
app.listen(port, () => console.log(`server is running on port ${port}`));
