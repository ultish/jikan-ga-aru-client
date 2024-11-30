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
import EmberFlatpickr from 'ember-flatpickr/components/ember-flatpickr';
import UiCounter from '../ui/counter';
import DayListDayDisplay from './day-display';

import SortBy  from 'ember-composable-helpers/helpers/sort-by';

// eslint-disable-next-line @typescript-eslint/no-empty-interface
interface DayListArgs {
  //
}

export default class DayList extends Component<DayListArgs> {
  @tracked date: Date | null = null;

  daysToFetch = 50;

  constructor(owner: unknown, args: DayListArgs) {
    super(owner, args);
    dayjs.extend(weekofyear);
  }

  days = useQuery<GQLQuery, QueryToTrackedDaysPaginatedArgs>(this, () => [
    GET_DAYS,
    {
      variables: {
        first: this.daysToFetch,
      },
    },
  ]);

  createDay = useMutation<GQLMutation, MutationToCreateTrackedDayArgs>(
    this,
    () => [
      CREATE_DAY,
      {
        update: (cache: ApolloCache<any>, result: Omit<FetchResult<GQLMutation>, "context">) => {
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
      variables: {
        first: this.daysToFetch,
      },
    });

    if (data) {
      const existingDays = data.trackedDaysPaginated?.edges;
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
        copy.trackedDaysPaginated.edges.push(...existingDays);
      }

      if (newDay) {
        console.log(existingDays, newDay);

        cache.writeQuery({
          query: GET_DAYS,
          variables: {
            first: this.daysToFetch,
          },
          data: copy,
        });
      }
    }
  }

  get totalDays(): number {
    return this.days.data?.trackedDaysPaginated?.edges?.length || 0;
  }

  @action
  async onDateChange(selectedDates: Date[]) {
    this.date = selectedDates[0];
    const date = dayjs(this.date);

    await this.createDay.mutate({
      variables: {
        input: {
          date: date.format('YYYY-MM-DD'),
          week: date.week(),
          year: date.year(),
        },
      },
    });
  }

  <template>
    {{! @glint-nocheck: not typesafe yet }}
    <h2 class='text-2xl text-amber-400 p-1'>
      Days
      <UiCounter @value={{this.totalDays}} />
    </h2>

    <EmberFlatpickr
      @date={{this.date}}
      @onChange={{this.onDateChange}}
      @enableTime={{false}}
    />
    {{#if this.days.loading}}
      Loading...
    {{else}}
      <ul>
        {{#each
          (SortBy
            'node.date:desc' this.days.data.trackedDaysPaginated.edges
          ) as |day|
        }}
          <DayListDayDisplay @day={{day.node}} />
        {{/each}}
      </ul>
    {{/if}}
  </template>
}
