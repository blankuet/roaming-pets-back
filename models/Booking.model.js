const { Schema, model } = require("mongoose");

const BookingSchema = new Schema(
  {
    dateFrom: {
      type: Date,
      required: true,
      min: Date.now,
      max: "3024-01-01",
    },
    dateTo: {
      type: Date,
      required: true,
      min: Date.now,
      max: "3024-01-01",
    },
    guestEmail: {
      type: String,
      required: true,
    },
    accommodation: {
      type: Schema.Types.ObjectId,
      ref: "Accommodation",
      required: true,
    },
  },
  {
    timestamps: true,
  }
);

const Booking = model("Booking", BookingSchema);

module.exports = Booking;
