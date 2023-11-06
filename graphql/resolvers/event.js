import Event from "../../models/event.js";
import User from "../../models/user.js";
import { dateToString } from "../../helpers/date.js";
import { transformEvent } from "./utils.js";

const events = async () => {
  try {
    const events = await Event.find();

    return events.map(async (event) => {
      const result = await transformEvent(event);

      return result;
    });
  } catch (error) {
    throw error;
  }
};

const createEvent = async ({ eventInput }) => {
  const { title, description, price, date } = eventInput;

  const newEvent = new Event({
    title,
    description,
    price,
    date: dateToString(date),
    creator: "653d0b577479591683a09581",
  });

  try {
    const exisitingUser = await User.findById("653d0b577479591683a09581");

    if (!exisitingUser) {
      return new Error("User does not exist");
    }

    exisitingUser.createdEvents.push(newEvent);

    await exisitingUser.save();

    const result = await newEvent.save();

    return transformEvent(result);
  } catch (err) {
    throw err;
  }
};

export { events, createEvent };
