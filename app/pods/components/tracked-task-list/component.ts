import Component from '@glimmer/component';
import { useQuery } from 'glimmer-apollo';
import {
  GQLQuery,
  QueryToTrackedTasksArgs,
} from 'jikan-ga-aru-client/graphql/schemas';
import { GET_TRACKED_TASKS } from 'jikan-ga-aru-client/graphql/queries/queries';
// eslint-disable-next-line @typescript-eslint/ban-ts-comment
// @ts-ignore
import { cached } from 'tracked-toolbox';

interface TrackedTaskListArgs {
  trackedDayId: string;
}

export default class TrackedTaskList extends Component<TrackedTaskListArgs> {
  trackedTasksQuery = useQuery<GQLQuery, QueryToTrackedTasksArgs>(this, () => [
    GET_TRACKED_TASKS,
    {
      variables: {
        trackedDayId: this.args.trackedDayId,
      },
    },
  ]);

  @cached
  get trackedTasks() {
    console.log('fetching tracked tasks for ', this.args.trackedDayId);
    if (this.trackedTasksQuery.loading) {
      return [];
    } else {
      return this.trackedTasksQuery.data?.trackedTasks;
    }
  }
}
