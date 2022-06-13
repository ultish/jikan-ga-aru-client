import Component from '@glimmer/component';
import { useMutation } from 'glimmer-apollo';
import {
  GQLMutation,
  GQLQuery,
  MutationToCreateUserArgs,
  QueryToUsersArgs,
} from 'jikan-ga-aru-client/graphql/schemas';
import { CREATE_USER } from 'jikan-ga-aru-client/graphql/mutations/mutations';
import { GET_USERS } from 'jikan-ga-aru-client/graphql/queries/queries';
import { ApolloCache, FetchResult } from '@apollo/client';

interface UserCreateArgs {}

export default class UserCreate extends Component<UserCreateArgs> {
  createUser = useMutation<GQLMutation, MutationToCreateUserArgs>(this, () => [
    CREATE_USER,
    {
      update: (cache, result) => {
        this.updateCache(cache, result);
      },
    },
  ]);

  updateCache(
    cache: ApolloCache<any>,
    result: Omit<FetchResult<GQLMutation>, 'context'>
  ) {
    const data = cache.readQuery<GQLQuery, QueryToUsersArgs>({
      query: GET_USERS,
    });

    if (data) {
      const existingUsers = data.users;
      const newUser = result.data?.createUser;

      console.log(existingUsers);
      if (newUser) {
        const updateUsers = [newUser];

        if (existingUsers) {
          updateUsers.pushObjects(existingUsers);
        }

        cache.writeQuery({
          query: GET_USERS,
          data: {
            users: updateUsers,
          },
        });
      }
    }
  }

  submit = async (): Promise<void> => {
    await this.createUser.mutate({
      username: 'test1',
      password: 'test1',
    });
  };
}
