const { Schema, model } = require("mongoose");
const { Traveler } = require("./Traveler.model");
// const validate = require("../middleware/validate");

// TODO: Please make sure you edit the User model to whatever makes sense in this case
const BookingSchema = new Schema(
  {
    dateFrom: {
      type: Date,
      default: Date.now, //Esto es para que la fecha y hora sean las actuales, por defecto
      required: true,
      // validate: validate.dateFrom,
      min: Date.now,
      max: "01-01-3024",
    },
    dateTo: {
      type: Date,
      default: Date.now, //Esto es para que la fecha y hora sean las actuales, por defecto
      required: true,
      // validate: validate.dateTo,
      min: Date.now,
      max: "01-01-3024",
    },
    traveler: [
      {
        type: Schema.Types.ObjectId,
        ref: "Traveler",
      },
    ],
  },
  {
    // this second object adds extra properties: `createdAt` and `updatedAt`
    timestamps: true,
  }
);

const Booking = model("Booking", BookingSchema);

module.exports = Booking;
