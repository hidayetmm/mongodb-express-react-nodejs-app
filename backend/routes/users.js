const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");
const router = require("express").Router();
let User = require("../models/user.model");

router.route("/").get((req, res) => {
  User.find()
    .then((users) => res.json(users))
    .catch((err) => res.status(400).json("Error: " + err));
});

router.route("/add").post(async (req, res) => {
  try {
    const { username, password } = req.body;

    if (!(username && password)) {
      res.status(400).send("All are inputs required");
    }

    const existingUser = await User.findOne({ username });
    if (existingUser) {
      return res.status(409).send("User Already Exists. Please Login");
    }

    const encryptedPassword = await bcrypt.hash(password, 10);

    const newUser = await User.create({
      username: username.toLowerCase(),
      password: encryptedPassword,
    });

    const token = jwt.sign({ user_id: newUser._id }, process.env.TOKEN_KEY, {
      expiresIn: "2h",
    });

    newUser.token = token;

    res.status(201).json(newUser);
  } catch (error) {
    res.json("Error: " + error);
  }

  newUser
    .save()
    .then((successData) => {
      const resData = {
        data: successData,
        message: "User added!",
        result: "success",
      };
      res.send(resData);
    })
    .catch((err) => res.status(400).json("Error: " + err));
});

module.exports = router;
