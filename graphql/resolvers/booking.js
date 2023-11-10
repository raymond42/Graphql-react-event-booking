import Booking from "../../models/booking.js";
import Event from "../../models/event.js";
import { booking, event, transformBooking } from "./utils.js";

const creatorId = "653d0b577479591683a09581";

const bookEvent = async ({ eventId }, req) => {
  if (!req.auth) {
    throw new Error("Unauthenticated!");
  }

  try {
    const fetchedEvent = await Event.findById(eventId);
    if (!fetchedEvent) {
      throw new Error("Event not found");
    }

    const eventToBook = await event(eventId);

    const newBooking = new Booking({
      status: "active",
      user: creatorId,
      event: eventToBook,
    });

    const result = await newBooking.save();

    return transformBooking(result);
  } catch (error) {
    throw error;
  }
};

const bookings = async () => {
  try {
    const fetchedBookings = await Booking.find();

    return fetchedBookings.map(async (booking) => {
      return transformBooking(booking);
    });
  } catch (error) {
    throw error;
  }
};

const cancelBooking = async ({ bookingId }) => {
  if (!req.auth) {
    throw new Error("Unauthenticated!");
  }

  try {
    const fetchBooking = await booking(bookingId);

    if (!fetchBooking) {
      throw new Error("Event booking not found");
    }

    if (fetchBooking.status === "canceled") {
      throw new Error("Event booking is already canceled");
    }

    await Booking.updateOne(
      { _id: bookingId },
      { $set: { status: "canceled", updatedAt: new Date().toISOString() } }
    );

    const updatedBooking = await Booking.findById(bookingId);

    return transformBooking(updatedBooking);
  } catch (error) {
    throw error;
  }
};

export { bookEvent, bookings, cancelBooking };
