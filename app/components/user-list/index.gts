import Component from '@glimmer/component';
import { useQuery } from 'glimmer-apollo';
import {
  GQLQuery,
  QueryToUsersArgs,
} from 'jikan-ga-aru-client/graphql/schemas';
import { GET_USERS } from 'jikan-ga-aru-client/graphql/queries/queries';
import UiCounter from '../ui/counter';

export default class UserList extends Component {
  users = useQuery<GQLQuery, QueryToUsersArgs>(this, () => [GET_USERS]);

  get totalUsers(): number {
    return this.users.data?.users?.length || 0;
  }

  <template>
    <h2 class="text-2xl">
      Users
      <UiCounter @value={{this.totalUsers}} />
    </h2>

    {{#if this.users.loading}}
      Loading...
    {{else}}
      {{#each this.users.data.users as |user|}}
        Username: {{user.username}} <br>
      {{/each}}
    {{/if}}
  </template>
}
