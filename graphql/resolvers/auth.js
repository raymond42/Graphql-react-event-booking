import jwt from "jsonwebtoken";
import bcrypt from "bcryptjs";
import User from "../../models/user.js";
import { user, events } from "./utils.js";

const { hash, compare } = bcrypt;

const createUser = async (args) => {
  try {
    const { email, password } = args.userInput;

    const existingUser = await User.findOne({ email });

    if (existingUser) {
      return new Error("Email is already in use");
    }

    const hashedPassword = await hash(password, 12);

    const user = new User({
      email: args.userInput.email,
      password: hashedPassword,
    });

    const savedUser = await user.save();

    return { ...savedUser._doc, password: null };
  } catch (error) {
    throw error;
  }
};

const login = async ({ email, password }) => {
  try {
    const foundUser = await User.findOne({ email });

    if (!foundUser) {
      throw new Error("Incorrect email or password");
    }

    const comparePasswords = await compare(password, foundUser.password);

    if (!comparePasswords) {
      throw new Error("Incorrect email or password");
    }

    const token = jwt.sign(
      { userId: foundUser.id, email: foundUser.email },
      "thisisascretkey",
      {
        expiresIn: "1h",
      }
    );

    return {
      _id: foundUser.id,
      email: foundUser.email,
      token,
    };
  } catch (error) {
    throw error;
  }
};

const users = async () => {
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
};

export { createUser, users, login };
