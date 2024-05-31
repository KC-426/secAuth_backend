import mongoose from "mongoose";

const referenceUserSchema = new mongoose.Schema(
  {
    firstname: {
      type: String,
    },
    lastname: {
      type: String,
    },
    gender: {
      type: String,
      enum: ["Male", "Female", "Other"],
    },
    country: {
      type: String,
    },
    image: {
      name: {
        type: String,
      },
      url: {
        type: String,
      },
      path: {
        type: String,
      },
    },
    bio: {
      type: String,
    },
  },
  { timestamps: true }
);

export default mongoose.model("Referenceuser", referenceUserSchema);
