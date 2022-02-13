import Component from '@glimmer/component';
// import { tracked } from '@glimmer/tracking';
import { useQuery } from 'glimmer-apollo';

import {
  GQLQuery,
  QueryToTrackedDaysPaginatedArgs,
} from 'jikan-ga-aru-client/graphql/schemas';

import { GET_DAYS } from 'jikan-ga-aru-client/graphql/queries/queries';

interface DayListArgs {}

export default class DayList extends Component<DayListArgs> {
  days = useQuery<GQLQuery, QueryToTrackedDaysPaginatedArgs>(this, () => [
    GET_DAYS,
  ]);

  get totalDays(): number {
    return this.days.data?.trackedDaysPaginated?.edges?.length || 0;
  }
}

// TODO the useQuery won't update from server automatically. Try using
//  createUser here to see if they cache updates, and hence the useQuery
//  updating (as it watches the cache)
