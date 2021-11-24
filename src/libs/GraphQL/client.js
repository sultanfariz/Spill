import { ApolloClient, InMemoryCache } from '@apollo/client';

const client = new ApolloClient({
  // uri: process.env.HASURA_GRAPHQL_URI,
  uri: 'https://maximum-crappie-64.hasura.app/v1/graphql',
  headers: {
    // 'x-hasura-admin-secret': process.env.HASURA_GRAPHQL_ADMIN_SECRET,
    'x-hasura-admin-secret': '95XpeOrmpdFlkXKfIZEfahuQm2x1XH95EJx3o7wXcPXh6dNnB0jNybRPweNwr2He',
  },
  cache: new InMemoryCache(),
});

export default client;
