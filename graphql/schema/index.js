import { buildSchema } from "graphql";

const schema = buildSchema(`
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

type Authdata {
  _id: ID!
  email: String!
  token: String!
}

input UserInput {
  email: String!,
  password: String!
}

type Booking {
  _id: ID!
  user: User!
  event: Event!
  status: String!
  createdAt: String!
  updatedAt: String!
}

type RootQuery {
    events: [Event!]!
    users: [User!]!
    bookings: [Booking!]!
}

type RootMutation {
    createEvent(eventInput: EventInput): Event
    createUser(userInput: UserInput): User
    bookEvent(eventId: ID!): Booking!
    cancelBooking(bookingId: ID!): Booking!
    login(email: String!, password: String!): Authdata!
}

schema {
    query: RootQuery
    mutation: RootMutation
}
`);

export default schema;
