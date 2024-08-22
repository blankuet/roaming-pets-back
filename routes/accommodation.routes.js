const express = require("express");
const router = express.Router();
const Accommodation = require("../models/Accommodation.model");
const Host = require("../models/Host.model");

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

// GET /accommodations/host
router.get("/host/:id", (req, res, next) => {
  console.log(req.user);
  const hostId = req.params.id;
  Host.findById(hostId)
    .populate("accommodations")
    .then((data) => res.json(data.accommodations))
    .catch((err) => {
      res.status(500).json({ message: "Could not find the accommodations" });
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

router.post(`/host/:id`, async (req, res, next) => {
  try {
    const accommodation = await Accommodation.create(req.body);
    const host = await Host.findById(req.params.id);

    if (!host) {
      return res.status(404).json({ message: "Host not found" });
    }

    host.accommodations.push(accommodation._id);
    await host.save();

    res.status(201).json({ accommodation, host });
  } catch (error) {
    res.status(500).json({ message: "Error creating accommodation", error });
  }
});

router.put(`/:id`, async (req, res, next) => {
  try {
    const { id } = req.params;
    const updatedAccommodation = await Accommodation.findByIdAndUpdate(
      id,
      req.body,
      { new: true }
    );
    res.json(updatedAccommodation);
  } catch (error) {
    res.status(500).json({ message: "Failed to update accommodation" });
  }
});

module.exports = router;