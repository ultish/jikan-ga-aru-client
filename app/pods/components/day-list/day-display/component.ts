import Component from '@glimmer/component';
// import { tracked } from '@glimmer/tracking';
import weekofyear from 'dayjs/plugin/weekOfYear';
import dayjs from 'dayjs';
import { GQLTrackedDay } from 'jikan-ga-aru-client/graphql/schemas';

interface DayDisplayArgs {
  day: GQLTrackedDay;
}

export default class DayList extends Component<DayDisplayArgs> {
  constructor(owner: unknown, args: DayDisplayArgs) {
    super(owner, args);
    dayjs.extend(weekofyear);
  }

  get weekOfYear() {
    return dayjs(this.args.day?.date).week();
  }

  get isWeekOfYearEven() {
    return this.weekOfYear % 2 === 0;
  }

  get weekOfYearClass() {
    return this.weekOfYear % 2 === 0 ? 'week-even' : 'week-odd';
  }
}

// TODO the useQuery won't update from server automatically. Try using
//  createUser here to see if they cache updates, and hence the useQuery
//  updating (as it watches the cache)
