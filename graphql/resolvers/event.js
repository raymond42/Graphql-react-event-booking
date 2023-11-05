import Event from "../../models/event.js";
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

const createEvent = async (args) => {
  const newEvent = new Event({
    title: args.eventInput.title,
    title: args.eventInput.title,
    description: args.eventInput.description,
    price: +args.eventInput.price,
    date: dateToString(args.eventInput.date),
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
