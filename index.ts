import { ApolloServer } from '@apollo/server';
import { startStandaloneServer } from '@apollo/server/standalone'

type User = {
  id: string
  name: string
  email: string
  age: number
}

const inMemoryData: User[] = [
  {
    id: '123',
    name: 'Gleidson',
    email: 'gledson.leytte@hotmail.com',
    age: 29
  },
  {
    id: '1234',
    name: 'Gleidson',
    email: 'gledson.leytte@hotmail.com',
    age: 29
  },
  {
    id: '12345',
    name: 'Gleidson',
    email: 'gledson.leytte@hotmail.com',
    age: 29
  },
]

// A schema is a collection of type definitions (hence "typeDefs")
// that together define the "shape" of queries that are executed against
// your data.
export const typeDefs = `#graphql
  # Comments in GraphQL strings (such as this one) start with the hash (#) symbol.

  type GetUserById {
    id: ID!
  }

  type User {
    id: ID!
    name: String!
    email: String!
    age: Int!
  }

  # The "Query" type is special: it lists all of the available queries that
  # clients can execute, along with the return type for each. In this
  # case, the "books" query returns an array of zero or more Books (defined above).
  type Query {
    getUser(id: ID!): User
    listUsers(limit: Int): [User!]!
  }
`;

// Resolvers define the technique for fetching the types defined in the
// schema. This resolver retrieves books from the "books" array above.
export const resolvers = {
  Query: {
    getUser(_: any, args: any) {
      const foundIndex = inMemoryData.findIndex(user => user.id === args.id);
      if (foundIndex < 0) {
        return null
      }

      return inMemoryData[foundIndex]
    },
    listUsers(_: any, args: any) {
      const limit = args.limit as number
      
      if (inMemoryData.length < limit) {
        return inMemoryData
      }

      return inMemoryData.slice(0, limit)
    }
  },
};

// The ApolloServer constructor requires two parameters: your schema
// definition and your set of resolvers.
const server = new ApolloServer({
  typeDefs,
  resolvers,
});

// Passing an ApolloServer instance to the `startStandaloneServer` function:
//  1. creates an Express app
//  2. installs your ApolloServer instance as middleware
//  3. prepares your app to handle incoming requests
const { url } = await startStandaloneServer(server, { listen: { port: 4000 } });

console.log(`🚀 Server listening at: ${url}`);
