import express from "express";
import bodyParser from "body-parser";
import { graphqlHTTP } from "express-graphql";
import mongoose from "mongoose";
import schema from "./graphql/schema/index.js";
import resolvers from "./graphql/resolvers/index.js";
import isAuth from "./middleware/is-auth.js";

const app = express();

app.use(bodyParser.json());

app.use(isAuth);

app.use(
  "/api",
  graphqlHTTP({
    schema: schema,
    rootValue: resolvers,
    graphiql: true,
  })
);

const connectionString = `mongodb+srv://${process.env.MONGO_USER}:${process.env.MONGO_PASSWORD}@event-booking-cluster.dsxfpdb.mongodb.net/${process.env.MONGO_DB}`;

mongoose
  .connect(connectionString)
  .then(() => {
    app.listen(3000, () => console.log("Server is running on 3000"));
  })
  .catch((err) => {
    throw err;
  });
