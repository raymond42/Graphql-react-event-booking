import { events, createEvent } from "./event.js";
import {
  bookEvent,
  bookings,
  cancelBooking,
} from "../../graphql/resolvers/booking.js";
import { users, createUser } from "./user.js";

const resolvers = {
  // events
  events,
  createEvent,

  // users
  createUser,
  users,

  // bookings
  bookings,
  bookEvent,
  cancelBooking,
};

export default resolvers;
