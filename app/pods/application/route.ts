import Route from '@ember/routing/route';
// import { getOwner } from '@ember/application';
// import { setClient } from 'glimmer-apollo';
// import {
//   ApolloClient,
//   InMemoryCache,
//   createHttpLink,
// } from '@apollo/client/core';
// import Transition from '@ember/routing/-private/transition';
// import type ApplicationInstance from '@ember/application/instance';

export default class Application extends Route {
  // beforeModel(transition: Transition): any {
  //   const superBeforeModel = super.beforeModel(transition);
  //
  //   // this.setupApolloClient(getOwner(this));
  //
  //   return superBeforeModel;
  // }
  // setupApolloClient(context: any): void {
  //   // HTTP connection to the API
  //   const httpLink = createHttpLink({
  //     uri: 'http://localhost:8080/graphql',
  //   });
  //
  //   // Cache implementation
  //   const cache = new InMemoryCache();
  //
  //   // Create the apollo client
  //   const apolloClient = new ApolloClient({
  //     link: httpLink,
  //     cache,
  //   });
  //
  //   // Set default apollo client for Glimmer Apollo
  //   setClient(context, apolloClient);
  // }
}
