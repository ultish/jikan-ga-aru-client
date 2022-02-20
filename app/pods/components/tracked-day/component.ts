import Component from '@glimmer/component';
import { GQLTrackedDay } from 'jikan-ga-aru-client/graphql/schemas';

// import { tracked } from '@glimmer/tracking';
interface TrackedDayArgs {
  trackedDay: GQLTrackedDay;
}

export default class DayList extends Component<TrackedDayArgs> {
  // get totalDays(): number {
  //   return this.days.data?.trackedDaysPaginated?.edges?.length || 0;
  // }
}
