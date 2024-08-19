const { Schema, model } = require("mongoose");
const { Booking } = require("./Booking.model");

const accommodationSchema = new Schema(
  {
    name: {
      type: String,
      required: [true, "Accommodation name is required."],
    },
    address: {
      type: String,
      required: [true, "Address is required."],
    },
    price: {
      type: Number,
      required: [true, "Price per night is required."],
    },
    maxPersons: {
      type: Number,
      required: [true, "Max persons is required."],
    },
    description: {
      type: String,
      required: [true, "Description is required."],
    },
    bookings: [
      {
        type: Schema.Types.ObjectId,
        ref: "Booking",
      },
    ],
  },
  { timestamps: true }
);

const Accommodation = model("Accommodation", accommodationSchema);

module.exports = Accommodation;
