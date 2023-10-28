import express from "express";
import bodyParser from "body-parser";
import { graphqlHTTP } from "express-graphql";
import { buildSchema } from "graphql";
import mongoose from "mongoose";
import Event from "./models/event.js";
import User from "./models/user.js";
import bcrypt from "bcryptjs";

const app = express();

app.use(bodyParser.json());

const events = [];

const users = [];

app.use(
  "/api",
  graphqlHTTP({
    schema: buildSchema(`
        type Event {
            _id: ID!
            title: String!
            description:  String!
            price: Float!
            date: String!
            creator: User!
        }

        input EventInput {
            title: String!
            description:  String!
            price: Float!
            date: String
        }

        type User {
          _id: ID!,
          email: String!,
          password: String,
          createdEvents:[Event!]
        }

        input UserInput {
          email: String!,
          password: String!
        }

        type RootQuery {
            events: [Event!]!
            users: [User]!
        }

        type RootMutation {
            createEvent(eventInput: EventInput): Event
            createUser(userInput: UserInput): User
        }

        schema {
            query: RootQuery
            mutation: RootMutation
        }
    `),
    rootValue: {
      events: async () => {
        try {
          const events = await Event.find().populate("creator");

          return events.map((event) => event);
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
          const user = await User.findById("653d0b577479591683a09581");

          if (!user) {
            return new Error("User does not exist");
          }

          user.createdEvents.push(event);
          await user.save();

          const result = await event.save();

          return { ...result._doc };
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
          const users = await User.find().populate("createdEvents");

          return users.map((user) => {
            return { ...user._doc };
          });
        } catch (error) {
          throw error;
        }
      },
    },
    graphiql: true,
  })
);

const connectionString = `mongodb+srv://${process.env.MONGO_USER}:${process.env.MONGO_PASSWORD}@event-booking-cluster.dsxfpdb.mongodb.net/${process.env.MONGO_DB}`;

mongoose
  .connect(connectionString)
  .then(() => {
    console.log("App is running on 3000");
    app.listen(3000);
  })
  .catch((err) => {
    throw err;
  });
