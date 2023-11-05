import Event from "../../models/event.js";
import User from "../../models/user.js";
import Booking from "../../models/booking.js";
import { dateToString } from "../../helpers/date.js";

export const transformEvent = (event) => {
  return {
    ...event._doc,
    _id: event._id.toString(),
    date: dateToString(event.date),
    creator: user(event.creator._id.toString()),
  };
};

export const transformBooking = (booking) => {
  return {
    ...booking._doc,
    _id: booking._id,
    user: user(booking.user._id),
    event: event(booking.event._id),
    createdAt: dateToString(booking.createdAt),
    updatedAt: dateToString(booking.updatedAt),
  };
};

export const events = async (eventIds) => {
  try {
    const eventsfound = await Event.find({ _id: { $in: eventIds } });
    return eventsfound.map(async (evnt) => {
      return transformEvent(evnt);
    });
  } catch (error) {
    throw error;
  }
};

export const event = async (eventId) => {
  try {
    const fetchedEvent = await Event.findById(eventId);

    if (!fetchedEvent) {
      throw new Error("Event not found");
    }

    return transformEvent(fetchedEvent);
  } catch (error) {
    throw error;
  }
};

export const user = async (userId) => {
  try {
    const oneUser = await User.findById(userId);

    if (!oneUser) {
      throw new Error("User not found");
    }

    const returnUser = {
      ...oneUser._doc,
      _id: oneUser._id.toString(),
      createdEvents: events(oneUser.createdEvents),
    };
    return returnUser;
  } catch (error) {
    throw error;
  }
};

export const booking = async (bookingId) => {
  const fetchedBooking = await Booking.findById(bookingId);

  if (!fetchedBooking) {
    throw new Error("Booking not found");
  }

  return fetchedBooking;
};
