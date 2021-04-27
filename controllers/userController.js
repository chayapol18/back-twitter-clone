const { User } = require("../models");

const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");

const { Op } = require("sequelize");

exports.protect = async (req, res, next) => {
  try {
    let token = null;

    if (
      req.headers.authorization &&
      req.headers.authorization.startsWith("Bearer")
    ) {
      token = req.headers.authorization.split(" ")[1];
    }

    if (!token)
      return res.status(401).json({ message: "you are unauthorized" });

    const payload = jwt.verify(token, process.env.JWT_SECRET);
    const user = await User.findOne({ where: { id: payload.id } });
    if (!user) return res.status(400).json({ message: "user not found" });

    req.user = user;
    next();
  } catch (err) {
    next(err);
  }
};

exports.personal = (req, res, next) => {
  const {
    id,
    name,
    username,
    profileImg,
    backgroundImg,
    bio,
    birthDate,
    createdAt,
  } = req.user;

  res.status(200).json({
    user: {
      id,
      name,
      username,
      profileImg,
      backgroundImg,
      bio,
      birthDate,
      createdAt,
    },
  });
};

exports.otherUserData = async (req, res, next) => {
  try {
    const { id } = req.params;
    const otherUser = await User.findOne({ where: { id } });

    res.status(200).json({ otherUser });
  } catch (err) {
    next(err);
  }
};

exports.register = async (req, res, next) => {
  try {
    const {
      name,
      email,
      username,
      birthDate,
      password,
      confirmPassword,
    } = req.body;

    if (!name) return res.status(400).json({ message: "name is required" });
    if (!email) return res.status(400).json({ message: "email is required" });
    if (!username)
      return res.status(400).json({ message: "username is required" });
    if (!birthDate)
      return res.status(400).json({ message: "birthDate is required" });
    if (!password)
      return res.status(400).json({ message: "password is required" });
    if (!confirmPassword)
      return res.status(400).json({ message: "confirm password is required" });

    if (!username.match(/^[0-9a-zA-Z]+$/))
      return res
        .status(400)
        .json({ message: "username can not be alphanumeric" });
    if (!password.match(/^(?=.*?[A-Z])(?=.*?[a-z])(?=.*?[0-9]).{8,16}$/))
      return res.status(400).json({
        message:
          "The number of password must be between 8 and 16 characters and must have Capital letters",
      });
    if (password !== confirmPassword)
      return res.status(400).json({ message: "password is not match" });

    const validateEmail = await User.findOne({ where: { email } });
    if (validateEmail)
      return res.status(400).json({ message: "email is exist" });
    const validateUsername = await User.findOne({ where: { username } });
    if (validateUsername)
      return res.status(400).json({ message: "username is exist" });

    const hashedPassword = await bcrypt.hash(
      password,
      Number(process.env.BCRYPT_SALT)
    );
    const user = await User.create({
      name,
      email,
      username,
      birthDate,
      password: hashedPassword,
    });

    const payload = {
      id: user.id,
      email: user.email,
      name: user.name,
      birthDate: user.birthDate,
      profileImg: user.profileImg,
      backgroundimg: user.backgroundImg,
      bio: user.bio,
      gender: user.gender,
      createdAt: user.createdAt,
    };
    const token = jwt.sign(payload, process.env.JWT_SECRET, {
      expiresIn: process.env.JWT_EXPIRES_IN,
    });

    res.status(201).json({ token });
  } catch (err) {
    next(err);
  }
};

exports.login = async (req, res, next) => {
  try {
    const { emailOrUsername, password } = req.body;

    const user = await User.findOne({
      where: {
        [Op.or]: [{ email: emailOrUsername }, { username: emailOrUsername }],
      },
    });
    if (!user)
      return res
        .status(400)
        .json({ message: "username, email or password incorrect" });

    const isMatch = await bcrypt.compare(password, user.password);
    if (!isMatch)
      return res
        .status(400)
        .json({ message: "username, email or password incorrect" });

    const payload = {
      id: user.id,
      email: user.email,
      name: user.name,
      birthDate: user.birthDate,
      profileImg: user.profileImg,
      backgroundimg: user.backgroundImg,
      bio: user.bio,
      gender: user.gender,
      createdAt: user.createdAt,
    };
    const token = jwt.sign(payload, process.env.JWT_SECRET, {
      expiresIn: Number(process.env.JWT_EXPIRES_IN),
    });

    res.status(200).json({ token });
  } catch (err) {
    next(err);
  }
};

exports.update = async (req, res, next) => {
  try {
    const {
      name,
      username,
      profileImg,
      backgroundImg,
      bio,
      gender,
      country,
      birthDate,
    } = req.body;

    await User.update(
      {
        name,
        username,
        profileImg,
        backgroundImg,
        bio,
        birthDate,
        gender,
        country,
      },
      {
        where: {
          id: req.user.id,
        },
      }
    );

    res.status(200).json({ message: "update user data complete" });
  } catch (err) {
    next(err);
  }
};

exports.changePassword = async (req, res, next) => {
  try {
    const { oldPassword, newPassword, confirmNewPassword } = req.body;
    const isPasswordCorrect = await bcrypt.compare(
      oldPassword,
      req.user.password
    );
    if (!isPasswordCorrect)
      return res.status(400).json({ message: "incorrect password" });
    if (newPassword !== confirmNewPassword)
      return res.status(400).json({ message: "new password is not match" });
    if (!password.match(/^(?=.*?[A-Z])(?=.*?[a-z])(?=.*?[0-9]).{8,}$/))
      return res
        .status(400)
        .json({ message: "password can not lower than 8 characters" });

    const newHashPassword = await bcrypt.hash(
      newPassword,
      Number(process.env.BCRYPT_SALT)
    );

    req.user.password = newHashPassword;
    await req.user.save();

    res.status(200).json({ message: "change password complete" });
  } catch (err) {
    next(err);
  }
};

exports.searchUser = async (req, res, next) => {
  try {
    const { searchData } = req.body;
    const search = await User.findAll({
      where: { username: { [Op.like]: `%${searchData}%` } },
    });

    res.status(200).json({ search });
  } catch (err) {
    next(err);
  }
};
