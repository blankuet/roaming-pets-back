const express = require("express");
const router = express.Router();
const Accommodation = require("../models/Accommodation.model");

// GET /accommodations
router.get(`/`, (req, res, next) => {
  Accommodation.find()
    .then((data) => res.json(data))
    .catch((err) => {
      res
        .status(500)
        .json({ message: "Could not find all the accommodations" });
    });
});

//GET /accommodations/:id
router.get(`/:id`, (req, res, next) => {
  Accommodation.findById(req.params.id)
    .then((data) => res.json(data))
    .catch((err) => {
      res.status(500).json({ message: "Could not find the accommodation" });
    });
});

// POST /accommodations
router.post(`/`, (req, res, next) => {
  const accommodation = new Accommodation(req.body);
  accommodation
    .save()
    .then((data) => res.json(data))
    .catch((err) => {
      res.status(500).json({ message: "Could not create the accommodation" });
    });
});

module.exports = router;
