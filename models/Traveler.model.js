const { Schema, model } = require("mongoose");

// TODO: Please make sure you edit the User model to whatever makes sense in this case
const travelerSchema = new Schema(
  {
    name: {
      type: String,
      required: [true, "Name is required."],
    },
    email: {
      type: String,
      required: [true, "Email is required."],
      unique: true,
      lowercase: true,
      trim: true,
    },
    password: {
      type: String,
      required: [true, "Password is required."],
    },
    pets: {
        type: Number,
        required: [true, "Pets is required."],
    },
    bookings: [{    
      type: Schema.Types.ObjectId, ref: "Booking",
    }],
  },
  {
    // this second object adds extra properties: `createdAt` and `updatedAt`
    timestamps: true,
  },
  {
    strictPopulate: false,
  },
);

const Traveler = model("Traveler", travelerSchema);

module.exports = Traveler;
