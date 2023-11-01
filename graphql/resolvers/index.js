import bcrypt from "bcryptjs";
import Event from "../../models/event.js";
import User from "../../models/user.js";

const events = async (eventIds) => {
  try {
    const eventsfound = await Event.find({ _id: { $in: eventIds } });
    return eventsfound.map(async (evnt) => {
      return {
        ...evnt._doc,
        _id: evnt.id,
        date: new Date(evnt._doc.date).toISOString(),
        creator: user(evnt.creator._id),
      };
    });
  } catch (error) {
    throw error;
  }
};

const user = async (userId) => {
  try {
    const oneUser = await User.findById(userId);
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

const resolvers = {
  events: async () => {
    try {
      const events = await Event.find();

      return events.map(async (event) => {
        const result = await {
          ...event._doc,
          _id: event._id.toString(),
          date: new Date(event.date.toISOString()).toISOString(),
          creator: user(event.creator._id.toString()),
        };

        return result;
      });
    } catch (error) {
      throw error;
    }
  },

  createEvent: async (args) => {
    const event = new Event({
      title: args.eventInput.title,
      title: args.eventInput.title,
      description: args.eventInput.description,
      price: +args.eventInput.price,
      date: new Date(args.eventInput.date).toISOString(),
      creator: "653d0b577479591683a09581",
    });

    try {
      const exisitingUser = await User.findById("653d0b577479591683a09581");

      if (!exisitingUser) {
        return new Error("User does not exist");
      }

      exisitingUser.createdEvents.push(event);

      await exisitingUser.save();

      const result = await event.save();

      return {
        ...result._doc,
        date: new Date(result.date.toISOString()),
        creator: exisitingUser,
      };
    } catch (err) {
      throw err;
    }
  },

  createUser: async (args) => {
    try {
      const { email, password } = args.userInput;

      const existingUser = await User.findOne({ email });

      if (existingUser) {
        return new Error("Email is already in use");
      }

      const hashedPassword = await bcrypt.hash(password, 12);

      const user = new User({
        email: args.userInput.email,
        password: hashedPassword,
      });

      const savedUser = await user.save();

      return { ...savedUser._doc, password: null };
    } catch (error) {
      throw error;
    }
  },

  users: async () => {
    try {
      const users = await User.find();

      const foundUsers = users.map(async (oneuser) => {
        const result = await user(oneuser._id.toString());

        return {
          ...result,
          _id: oneuser.id.toString(),
          createdEvents: events(oneuser.createdEvents),
        };
      });

      return users.length > 0 ? foundUsers : users;
    } catch (error) {
      throw error;
    }
  },
};

export default resolvers;
