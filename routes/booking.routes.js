const express = require("express");
const router = express.Router();
const Booking = require("../models/Booking.model");
const Accommodation = require("../models/Accommodation.model");

// GET /bookings
router.get(`/booking`, (req, res, next) => {
  Booking.find()

    .then((data) => res.json(data))
    .catch((err) => {
      res.status(500).json({ message: "Could not find all the bookings" });
    });
});

// GET /bookings/:id
router.get(`/booking/:id`, (req, res, next) => {
  Booking.findById(req.params.id)

    .then((data) => res.json(data))
    .catch((err) => {
      res.status(500).json({ message: "Could not find the booking" });
    });
});

// POST /bookings
router.post(`/booking`, (req, res, next) => {
  const booking = new Booking(req.body);
  booking
    .save()
    .then((data) => {
      // Link booking to accommodation
      Accommodation.findByIdAndUpdate(req.body.accommodationId, {
        $push: { bookings: data._id },
      })
        .then(() => res.json(data))
        .catch((err) => {
          res
            .status(500)
            .json({ message: "Could not link booking to accommodation" });
        });
    })
    .catch((err) => {
      res.status(500).json({ message: "Could not create the booking" });
    });
});

module.exports = router;
