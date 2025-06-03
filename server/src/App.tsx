import React from 'react';
import { ApolloProvider, InMemoryCache, ApolloClient } from '@apollo/client';
import SearchBooks from './components/SearchBooks';
import SavedBooks from './components/SavedBooks';

const client = new ApolloClient({
  uri: 'http://localhost:5000/graphql',  // Apollo Server URL
  cache: new InMemoryCache(),
});

const App = () => {
  return (
    <ApolloProvider client={client}>
      <SearchBooks />
      <SavedBooks />
    </ApolloProvider>
  );
};

export default App;
