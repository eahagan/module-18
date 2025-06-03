import express from 'express';
import path from 'node:path';
import db from './config/connection';
import { ApolloServer } from 'apollo-server-express';
import typeDefs from '../schemas/typeDefs';  // Correct the relative import for typeDefs
import resolvers from '../schemas/resolvers';  // Correct the relative import for resolvers
import { authMiddleware } from './middleware/auth';  // Correct the relative import for authMiddleware

const app = express();
const PORT = process.env.PORT || 3001;

// Initialize Apollo Server
const server = new ApolloServer({
  typeDefs,        // The GraphQL schema
  resolvers,       // The GraphQL resolvers
  context: ({ req }) => {
    // Apply the authentication middleware to each request to add user context
    return { user: req.user };
  },
});

// Apply Apollo Server middleware to the Express app
server.applyMiddleware({ app });

// Middleware to parse incoming requests as JSON and handle URL-encoded data
app.use(express.urlencoded({ extended: true }));
app.use(express.json());

// If we're in production, serve the client/build as static assets
if (process.env.NODE_ENV === 'production') {
  app.use(express.static(path.join(__dirname, '../client/build')));
}

// Apply the authentication middleware to the app for all routes
app.use(authMiddleware);

// Connect to the MongoDB database and start the server
db.once('open', () => {
  app.listen(PORT, () => {
    console.log(`🌍 Now listening on http://localhost:${PORT}${server.graphqlPath}`);
  });
});


