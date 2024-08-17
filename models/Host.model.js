const { Schema, model } = require("mongoose");

// TODO: Please make sure you edit the User model to whatever makes sense in this case
const hostSchema = new Schema(
  {
    name: {
      type: String,
      required: [true, "Name is required."],
    },
    lastname: {
      type: String,
      required: [false, "Last name is required."],
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
    accommodations: [
      {
        type: Schema.Types.ObjectId, ref: "Accommodation",
      }
    ]

  },
  {
    // this second object adds extra properties: `createdAt` and `updatedAt`
    timestamps: true,
  },
  {
    strictPopulate: false,
  },
);

const Host = model("Host", hostSchema);

module.exports = Host;
