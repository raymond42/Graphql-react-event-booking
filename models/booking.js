import mongoose, { Schema } from "mongoose";

const bookingSchema = new Schema(
  {
    status: {
      type: String,
      required: true,
      default: "active",
    },
    event: {
      type: Schema.Types.ObjectId,
      ref: "Event",
    },
    user: {
      type: Schema.Types.ObjectId,
      ref: "User",
    },
  },
  { timestamps: true }
);

const Booking = mongoose.model("Booking", bookingSchema);

export default Booking;
