const express = require("express");
const router = express.Router();
const Booking = require("../models/Booking.model");
const Accommodation = require("../models/Accommodation.model");

// GET /booking
router.get(`/booking`, (req, res, next) => {
  Booking.find()
    .populate("accommodation", "name address")
    .then((data) => res.json(data))
    .catch((err) => {
      res.status(500).json({ message: "Could not find all the bookings" });
    });
});

// GET /booking/:id
router.get(`/booking/:id`, (req, res, next) => {
  Booking.findById(req.params.id)
    .populate("accommodation", "name address")
    .then((data) => res.json(data))
    .catch((err) => {
      res.status(500).json({ message: "Could not find the booking" });
    });
});

// POST /booking
router.post(`/booking`, (req, res, next) => {
  const { guestEmail, accommodationId, dateFrom, dateTo } = req.body;

  const newBooking = new Booking({
    dateFrom,
    dateTo,
    guestEmail,
    accommodation: accommodationId,
  });

  newBooking
    .save()
    .then((booking) => {
      return Accommodation.findByIdAndUpdate(
        accommodationId,
        { $push: { bookings: booking._id } },
        { new: true }
      );
    })
    .then(() =>
      res.status(201).json({ message: "Booking created successfully" })
    )
    .catch((err) => {
      res
        .status(500)
        .json({ message: "Could not create the booking", error: err.message });
    });
});

module.exports = router;
