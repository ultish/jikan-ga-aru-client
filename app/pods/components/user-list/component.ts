import Component from '@glimmer/component';
// import { tracked } from '@glimmer/tracking';
import { useQuery } from 'glimmer-apollo';
// import { GET_PORTFOLIOS } from 'okanemochi/queries/portfolios';
// import { GQLQuery, QueryToPortfoliosArgs } from 'okanemochi/graphql/schemas';

import {
  GQLQuery,
  QueryToUsersArgs,
} from 'jikan-ga-aru-client/graphql/schemas';
import { gql } from 'glimmer-apollo';

const GET_USERS = gql`
  query users {
    users {
      id
      username
    }
  }
`;

interface UserListArgs {}

export default class UserList extends Component<UserListArgs> {
  users = useQuery<GQLQuery, QueryToUsersArgs>(this, () => [GET_USERS]);
}

// TODO the useQuery won't update from server automatically. Try using
//  createUser here to see if they cache updates, and hence the useQuery
//  updating (as it watches the cache)
