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

app.use(cors());
app.use(express.json());
app.use(express.urlencoded({ extended: false }));


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
