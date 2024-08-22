const { Schema, model } = require("mongoose");
const { Booking } = require("./Booking.model");

// TODO: Please make sure you edit the User model to whatever makes sense in this case
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
    bookings: [{
      type: Schema.Types.ObjectId, ref: "Booking",
    }],
    review: [{ rating: Number, review: String }],
  },
  {
    // this second object adds extra properties: `createdAt` and `updatedAt`
    timestamps: true,
  }
);

const Accommodation = model("Accommodation", accommodationSchema);

module.exports = Accommodation;

//merge
