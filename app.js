import express from "express";
import bodyParser from "body-parser";
import { graphqlHTTP } from "express-graphql";
import { buildSchema } from "graphql";
import mongoose from "mongoose";
import Event from "./models/event.js";

const app = express();

app.use(bodyParser.json());

const events = [];

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
        }

        input EventInput {
            title: String!
            description:  String!
            price: Float!
            date: String
        }

        type RootQuery {
            events: [Event!]!
        }

        type RootMutation {
            createEvent(eventInput: EventInput): Event
        }

        schema {
            query: RootQuery
            mutation: RootMutation
        }
    `),
    rootValue: {
      events: async () => {
        try {
          const events = await Event.find();
          return events.map(async (event) => await event._doc);
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
        });

        try {
          const result_2 = await event.save();
          return { ...result_2._doc };
        } catch (err) {
          throw err;
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
    console.log(err);
    console.log("--------->>>>>>>", connectionString);
  });
