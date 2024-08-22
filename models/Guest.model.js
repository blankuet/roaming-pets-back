const { Schema, model } = require("mongoose");

// TODO: Please make sure you edit the User model to whatever makes sense in this case
const guestSchema = new Schema(
  {
    name: {
      type: String,
      required: [true, "Name is required."],
    },
    lastname: {
      type: String,
      required: [true, "Last name is required."],
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
    profileImage: {
        type: String,
        default: "",
        required: false, 
    },
    pets: {
        type: Number,
        required: [true, "Pets is required."],
    },
    bookings: [{    
      type: Schema.Types.ObjectId, ref: "Booking",
    }],
    reviews: [{rating: Number, review: String}]
  },
  {
    // this second object adds extra properties: `createdAt` and `updatedAt`
    timestamps: true,
  },
  {
    strictPopulate: false,
  },
);

const Guest = model("Guest", guestSchema);

module.exports = Guest;
