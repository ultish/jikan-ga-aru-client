import Component from '@glimmer/component';
import weekofyear from 'dayjs/plugin/weekOfYear';
import dayjs from 'dayjs';
import { GQLTrackedDay } from 'jikan-ga-aru-client/graphql/schemas';
import LinkTo from '@ember/routing/link-to';

interface DayDisplayArgs {
  day: GQLTrackedDay;
}

export default class DayList extends Component<DayDisplayArgs> {
  constructor(owner: unknown, args: DayDisplayArgs) {
    super(owner, args);
    dayjs.extend(weekofyear);
  }

  get date() {
    return dayjs(this.args.day?.date);
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

  <template>
    {{! @glint-nocheck: not typesafe yet }}
    <li class="{{if this.isWeekOfYearEven 'bg-blue-700' 'bg-blue-600 text-emerald-300'}} p-1">
      <LinkTo @route="tracker.day" @model={{@day.id}}>
        {{this.weekOfYear}} {{dayjs-format this.date 'YYYY-MM-DD ddd '}}
      </LinkTo>
    </li>
  </template>
}
