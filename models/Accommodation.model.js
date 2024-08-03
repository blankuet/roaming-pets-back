const { Schema, model } = require("mongoose");

// TODO: Please make sure you edit the User model to whatever makes sense in this case
const accommodationSchema = new Schema(
  {
    name: {
        type: String,
        required: [true, "Accommodation name is required."],
      },
      location: {
        type: String,
        required: [true, "Location is required."],
      },
      price: {
        type: Number,
        required: [true, "Price per night is required."],
      },
      description: {
        type: String,
        required: [true, "Description is required."],
      },
      email: {
        type: String,
        required: [true, "Email is required."],
      },
  },
  {
    // this second object adds extra properties: `createdAt` and `updatedAt`
    timestamps: true,
  }
);

const Accommodation = model("Accommodation", accommodationSchema);

module.exports = Accommodation;
