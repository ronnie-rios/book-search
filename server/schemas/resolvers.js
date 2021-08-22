const { User } = require('../models');
const { AutenticationError, AuthenticationError } = require('apollo-server-express');
const { signToken } = require('../utils/auth');
const resolvers = {
    Query: {
        me: async(parent, args, context) => {
            if(context.user) {
                const userData = await User.findOne({ _id: context.user._id }).select(
                    "-__v -password"
                )
               return userData; 
            };
            
        
        throw new AuthenticationError('must be logged in')
        },
        Mutation: {
            addUser: async(parent, args) => {
                const user = await User.create(args);
                const token = signToken(user);

                return { token, user };
            },
            login: async ( parent, {email, password }) => {
                const user = await User.findOne({ email });
                if (!user) {
                    throw new AuthenticationError('Wrong login info')
                }
                const correctPw = await User.isCorrectPassword(password);

                if (!correctPw) {
                    throw new AuthenticationError('wrong login info')
                }
                const token = signToken(user);
                return {token, user };
            },

            saveBook: async(parent, args, context) => {
                console.log(args);
                if (context.user) {
                    const updatedUser = await User.findByIdAndUpdate(
                        { _id: context.user_id },
                        { $pull: { savedBooks: { bookId: args.bookId } } },
                        { new: True }
                    );

                    return updatedUser;
                }
                throw new AuthenticationError('must be logged in');
            },
            removeBook: async (parent, args, context) => {
                if (context.user) {
                    const updatedUser = await User.findOneAndUpdate(
                        { _id: context.user._id },
                        { $pull: { savedBooks: { bookId: args.bookId } } },
                        { new: true }
                    );
                    return updatedUser;
                }
                throw new AutenticationError('must be logged in');
            },
        }
    }
}

module.exports = resolvers;