import { events, createEvent } from "./event.js";
import {
  bookEvent,
  bookings,
  cancelBooking,
} from "../../graphql/resolvers/booking.js";
import { users, createUser, login } from "./auth.js";

const resolvers = {
  // events
  events,
  createEvent,

  // users
  createUser,
  users,
  login,

  // bookings
  bookings,
  bookEvent,
  cancelBooking,
};

export default resolvers;
