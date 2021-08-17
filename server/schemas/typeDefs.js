const { gql } = require('apollo-server-express');

const typeDefs = gql`
    type Query {
        helloWorld: string;
    }
`;

module.exports = typeDefs;