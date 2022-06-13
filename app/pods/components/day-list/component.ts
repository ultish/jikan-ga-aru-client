import Component from '@glimmer/component';
import { useMutation, useQuery } from 'glimmer-apollo';
import weekofyear from 'dayjs/plugin/weekOfYear';
import dayjs from 'dayjs';
import { tracked } from '@glimmer/tracking';
import { action } from '@ember/object';
import {
  GQLMutation,
  GQLQuery,
  GQLTrackedDayEdge,
  MutationToCreateTrackedDayArgs,
  QueryToTrackedDaysPaginatedArgs,
} from 'jikan-ga-aru-client/graphql/schemas';

import { GET_DAYS } from 'jikan-ga-aru-client/graphql/queries/queries';
import { CREATE_DAY } from 'jikan-ga-aru-client/graphql/mutations/mutations';
import { ApolloCache, FetchResult } from '@apollo/client';

// eslint-disable-next-line @typescript-eslint/no-empty-interface
interface DayListArgs {
  //
}

export default class DayList extends Component<DayListArgs> {
  @tracked date: Date | null = null;
  flatpickrRef: any;

  constructor(owner: unknown, args: DayListArgs) {
    super(owner, args);
    dayjs.extend(weekofyear);
  }

  days = useQuery<GQLQuery, QueryToTrackedDaysPaginatedArgs>(this, () => [
    GET_DAYS,
  ]);

  createDay = useMutation<GQLMutation, MutationToCreateTrackedDayArgs>(
    this,
    () => [
      CREATE_DAY,
      {
        update: (cache, result) => {
          this.updateCache(cache, result);
        },
      },
    ]
  );

  updateCache(
    cache: ApolloCache<any>,
    result: Omit<FetchResult<GQLMutation>, 'context'>
  ) {
    const data = cache.readQuery<GQLQuery, QueryToTrackedDaysPaginatedArgs>({
      query: GET_DAYS,
    });

    console.log(result);

    if (data) {
      const existingDays = data.trackedDaysPaginated?.edges?.toArray();
      const newDay = result.data?.createTrackedDay;

      const newNode: GQLTrackedDayEdge = {
        cursor: 'new', // TODO why do we need the cursor when pageinfo has everything?
        node: newDay,
      };

      const copy = {
        trackedDaysPaginated: {
          pageInfo: { ...data.trackedDaysPaginated?.pageInfo },
          edges: [newNode],
        },
      };

      if (existingDays) {
        copy.trackedDaysPaginated.edges.pushObjects(existingDays);
      }

      debugger;
      if (newDay) {
        console.log(existingDays, newDay);

        cache.writeQuery({
          query: GET_DAYS,
          data: copy,
        });
      }
    }
  }

  get totalDays(): number {
    return this.days.data?.trackedDaysPaginated?.edges?.length || 0;
  }

  @action
  onDatePickerOpen() {
    // this.date = new Date();
  }

  @action
  onReady(_selectedDates: any, _dateStr: any, flatpickrRef: any) {
    this.flatpickrRef = flatpickrRef;
  }

  @action
  async onDateChange(selectedDate: [Date]) {
    console.log(selectedDate);

    await this.createDay.mutate({
      date: selectedDate[0]?.getTime(),
    });
    // this.flatpickrRef?.clear();
  }
}

// TODO the useQuery won't update from server automatically. Try using
//  createUser here to see if they cache updates, and hence the useQuery
//  updating (as it watches the cache)
