const { User } = require('../models');
const {  AuthenticationError } = require('apollo-server-express');
const { signToken } = require('../utils/auth');

const resolvers = {
  Query: {
    user: async (parent, { username }) => {
      return User.findOne({ username })
        .select("-__v -password")
        .populate("savedBooks");
    },
    users: async () => {
      return User.find().select("-__v").populate("savedBooks");
    },
    me: async (parent, args, context) => {
      if (context.user) {
        const userData = await User.findOne({ _id: context.user._id }).select(
          "-__v -password"
        );
        console.log("userData" + userData.savedBooks.length);
        return userData;
      }
      throw new AuthenticationError("Not logged in");
    },
  },
  Mutation: {
    addUser: async (parent, args) => {
      const user = await User.create(args);
      const token = signToken(user);

      return { token, user };
      // return { user };
    },
    login: async (parent, { email, password }) => {
      const user = await User.findOne({ email });

      if (!user) {
        throw new AuthenticationError("incorrect credentials");
      }

      const correctPw = await user.isCorrectPassword(password);

      if (!correctPw) {
        throw new AuthenticationError("incorrect credentials");
      }
      const token = signToken(user);
      return { token, user };
    },
    saveBook: async (parent, { input }, context) => {
      // console.log(input);
      if (context.user) {
        const updatedUser = await User.findOneAndUpdate(
          { _id: context.user._id },
          //using $addToSet instead of $push to prevent duplicate entries
          { $addToSet: { savedBooks: input } },
          { new: true }
        );
        // console.log({ updatedUser });
        return updatedUser;
      }
      throw new AuthenticationError("you need to be logged in!");
    },
    removeBook: async (parent, { bookId }, context) => {
      if (context.user) {
        const updatedUser = await User.findOneAndUpdate(
          { _id: context.user._id },
          { $pull: { savedBooks: { bookId: bookId } } }
        );
        console.log("removeBook" + updatedUser);
        console.log("removeBook" + updatedUser.savedBooks.length);
        return updatedUser;
      }
      throw new AuthenticationError("you need to be logged in!");
    },
  },
};

module.exports = resolvers;