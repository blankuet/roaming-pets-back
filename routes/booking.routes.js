const express = require("express");
const router = express.Router();
const Booking = require("../models/Booking.model");
const Accommodation = require("../models/Accommodation.model");

// GET /booking
router.get(`/`, (req, res, next) => {
  Booking.find()
    .populate("accommodation", "name address")
    .then((data) => res.json(data))
    .catch((err) => {
      res.status(500).json({ message: "Could not find all the bookings" });
    });
});

// GET /booking/host
router.get(`/host/:id`, (req, res, next) => {
  const hostId = req.params.id;
  console.log(hostId)

  Accommodation.find({ hostId: hostId })
    .then((accommodations) => {
      console.log(accommodations)
      const accommodationIds = accommodations.map(
        (accommodation) => accommodation._id
      );

      return Booking.find({
        accommodation: { $in: accommodationIds },
      }).populate("accommodation", "name address");
    })
    .then((bookings) => {
      console.log(bookings)
      res.json(bookings)
})
    .catch((err) => {
      res.status(500).json({
        message: "Could not find the host's bookings",
        error: err.message,
      });
    });
});

// GET /booking/:id
router.get(`/:id`, (req, res, next) => {
  Booking.findById(req.params.id)
    .populate("accommodation", "name address")
    .then((data) => res.json(data))
    .catch((err) => {
      res.status(500).json({ message: "Could not find the booking" });
    });
});

// POST /booking
router.post(`/`, (req, res, next) => {
  const { guestId, accommodationId, dateFrom, dateTo } = req.body;
  console.log(guestId, accommodationId, dateFrom, dateTo)

  const newBooking = Booking.create({
    dateFrom,
    dateTo,
    guestId,
    accommodation: accommodationId,
  })
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

// booking
