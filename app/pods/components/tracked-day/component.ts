import Component from '@glimmer/component';
import { useQuery } from 'glimmer-apollo';
import {
  GQLQuery,
  QueryToTrackedDaysArgs,
} from 'jikan-ga-aru-client/graphql/schemas';
import { GET_DAY } from 'jikan-ga-aru-client/graphql/queries/queries';

interface TrackedDayBaseArgs {
  id: string;
}

export default class TrackedDayBase extends Component<TrackedDayBaseArgs> {
  dayQuery = useQuery<GQLQuery, QueryToTrackedDaysArgs>(this, () => [
    GET_DAY,
    {
      variables: {
        id: this.args.id,
      },
    },
  ]);

  get day() {
    console.log('fetching day for ', this.args.id);
    if (this.dayQuery.loading) {
      return undefined;
    } else {
      return this.dayQuery.data?.trackedDays?.get(0);
    }
  }
}
