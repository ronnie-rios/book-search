const { gql } = require('apollo-server-express');

const typeDefs = gql`
   type: {
       bookId: ID
       authors: [String]
       description: String
       title: String
       image: String
       link: String
   }
    type User {
        _id: ID
        username: String
        email: String
        bookCount: Int
        savedbooks: [Book]
    }
    type Auth {
        token: ID!
        user: User
    }
     type Query {
        me: User
    }
`;

module.exports = typeDefs;