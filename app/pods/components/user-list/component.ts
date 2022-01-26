import Component from '@glimmer/component';
// import { tracked } from '@glimmer/tracking';
import { useQuery } from 'glimmer-apollo';

import {
  GQLQuery,
  QueryToUsersArgs,
} from 'jikan-ga-aru-client/graphql/schemas';

import { GET_USERS } from 'jikan-ga-aru-client/graphql/queries/queries';

interface UserListArgs {}

export default class UserList extends Component<UserListArgs> {
  users = useQuery<GQLQuery, QueryToUsersArgs>(this, () => [GET_USERS]);
}

// TODO the useQuery won't update from server automatically. Try using
//  createUser here to see if they cache updates, and hence the useQuery
//  updating (as it watches the cache)
