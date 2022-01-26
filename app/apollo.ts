import { setClient } from 'glimmer-apollo';
import {
  ApolloClient,
  InMemoryCache,
  createHttpLink,
  split,
} from '@apollo/client/core';
import { getMainDefinition } from '@apollo/client/utilities';
import { WebSocketLink } from '@apollo/client/link/ws';

export default function setupApolloClient(context: object): void {
  // WebSocket connection to the API
  const wsLink = new WebSocketLink({
    uri: 'ws://localhost:8080/subscriptions',
    options: {
      reconnect: true,
    },
  });

  // HTTP connection to the API
  const httpLink = createHttpLink({
    uri: 'http://localhost:8080/graphql',
    headers: {
      'user-id': '61cd4dfa37595c6ebaddd54d',
    },
  });

  // Cache implementation
  const cache = new InMemoryCache();

  // Split HTTP link and WebSockete link
  const splitLink = split(
    ({ query }) => {
      const definition = getMainDefinition(query);
      return (
        definition.kind === 'OperationDefinition' &&
        definition.operation === 'subscription'
      );
    },
    wsLink,
    httpLink
  );

  // Create the apollo client
  const apolloClient = new ApolloClient({
    link: splitLink,
    cache,
  });

  // Set default apollo client for Glimmer Apollo
  setClient(context, apolloClient);
}
