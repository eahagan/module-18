import { gql } from 'apollo-server-express';

// GraphQL Schema
const typeDefs = gql`
  # User type represents the user entity
  type User {
    _id: ID!
    username: String!
    email: String!
    bookCount: Int!
    savedBooks: [Book]  # List of books saved by the user
  }

  # Book type represents a book object
  type Book {
    bookId: String!
    authors: [String]
    description: String
    title: String!
    image: String
    link: String
  }

  # Auth type is used for login response, returns a token and user details
  type Auth {
    token: String!
    user: User
  }

  # Query type: Fetches data
  type Query {
    # Fetch the currently authenticated user's information
    me: User
  }

  # Mutation type: Modifies data (creating, updating, or deleting)
  type Mutation {
    # Login mutation: Authenticates a user and returns a token and user data
    login(email: String!, password: String!): Auth

    # Add a new user to the database
    addUser(username: String!, email: String!, password: String!): Auth

    # Save a book to the current user's saved books list
    saveBook(
      bookId: String!
      authors: [String]
      description: String
      title: String!
      image: String
      link: String
    ): User

    # Remove a book from the current user's saved books list
    removeBook(bookId: String!): User
  }

  # Input type for saving a book
  input SaveBookInput {
    bookId: String!
    authors: [String]
    description: String
    title: String!
    image: String
    link: String
  }
`;

export default typeDefs;

