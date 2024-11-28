import Component from '@glimmer/component';
import { useQuery } from 'glimmer-apollo';
import {
  GQLQuery,
  QueryToTrackedDaysArgs,
} from 'jikan-ga-aru-client/graphql/schemas';
import { GET_DAY } from 'jikan-ga-aru-client/graphql/queries/queries';
import TimeChargeTotals from '../time-charge-totals';
import TrackedDayScale from './scale';

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

  <template>
    <div class="overflow-y-auto tracked-day-body bg-gray-800 text-teal-400 text-sm">
      <TrackedDayScale @day={{this.day}} />
    </div>
    <div class="tracked-base-totals overflow-y-auto bg-emerald-500 text-green-900 tracked-day-totals">
      Totals
      {{#if this.day}}
        <TimeChargeTotals
          @year={{this.day.year}}
          @week={{this.day.week}}
        />
      {{/if}}
    </div>
  </template>
}
