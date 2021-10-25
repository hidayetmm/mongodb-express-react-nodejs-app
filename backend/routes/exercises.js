const router = require("express").Router();
let Exercise = require("../models/exercise.model");

router.route("/").get((req, res) => {
  Exercise.find()
    .then((exercises) => res.json(exercises))
    .catch((err) => res.status(400).json("Error: " + err));
});

router.route("/add").post((req, res) => {
  const username = req.body.username;
  const description = req.body.description;
  const duration = Number(req.body.duration);
  const date = Date.parse(req.body.date);

  const newExercise = new Exercise({ username, description, duration, date });

  newExercise
    .save()
    .then((successData) => {
      const resData = {
        data: successData,
        message: "Exercise added!",
        result: "success",
      };
      res.send(resData);
    })
    .catch((err) => res.status(400).json("Error: " + err));
});

router.route("/:id").delete((req, res) => {
  Exercise.findByIdAndDelete(req.params.id)
    .then(() => res.json(`Exercise with id ${req.params.id} deleted.`))
    .catch((err) => res.status(400).json("Error: " + err));
});

router.route("/delete/:username").delete((req, res) => {
  Exercise.find({ username: req.params.username })
    .then((response) => {
      if (response.length > 0) {
        Exercise.deleteMany({ username: req.params.username })
          .then(() => res.json(`Exercises of ${req.params.username} removed.`))
          .catch((err) => res.status(400).json("Error: " + err));
      } else {
        res
          .status(404)
          .json(
            `Exercise with the username of ${req.params.username} not found.`
          );
      }
    })
    .catch((err) => {
      res.json(err);
    });
});

router.route("/:id").get((req, res) => {
  Exercise.findById(req.params.id)
    .then((exercise) => res.json(exercise))
    .catch((err) => res.status(400).json("Error: " + err));
});

router.route("/update/:id").post((req, res) => {
  const updatedExercise = {
    username: req.body.username,
    description: req.body.description,
    duration: req.body.duration,
    date: req.body.date,
  };
  Exercise.findByIdAndUpdate(
    req.params.id,
    updatedExercise,
    { new: true },
    (err, result) => {
      if (err) {
        res.status(400).json(err);
      } else {
        const resultData = {
          data: result,
          message: "Exercise updated.",
          result: "success",
        };
        res.send(resultData);
      }
    }
  );
});

module.exports = router;
