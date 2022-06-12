import Component from '@glimmer/component';
import { tracked } from '@glimmer/tracking';
import { action } from '@ember/object';
import { GQLTrackedDay } from 'jikan-ga-aru-client/graphql/schemas';
import { scaleTime, ScaleTime } from 'd3-scale';
import dayjs, { ManipulateType } from 'dayjs';

interface TrackedDayArgs {
  day: GQLTrackedDay;
}

const TRACKED_TASKS_WIDTH = 300;
const TIMEBLOCK_WIDTH = 60;

export default class TrackedDay extends Component<TrackedDayArgs> {
  @tracked containerWidth = 0;
  @tracked startTime = dayjs().startOf('day');
  @tracked stopTime = dayjs().startOf('day');
  @tracked scale?: ScaleTime<number, number>;
  @tracked ticks: Date[] = [];
  @tracked tickFormat?: (d: Date) => string;

  @action
  onResize(ele: HTMLElement) {
    this.containerWidth = ele.clientWidth ?? 0;

    this.calculateScale();
  }

  // TODO there's a bug when width > 2000px
  calculateScale() {
    const scale = scaleTime();

    const availableWidth = this.containerWidth - TRACKED_TASKS_WIDTH;
    const numBlocks = Math.floor(availableWidth / TIMEBLOCK_WIDTH) - 1;
    const usedWidth = numBlocks * TIMEBLOCK_WIDTH;

    this.stopTime = this.calcStopTime(
      this.startTime,
      numBlocks * TIMEBLOCK_WIDTH,
      'minutes'
    );

    scale
      .domain([this.startTime.toDate(), this.stopTime.toDate()])
      .range([0, usedWidth]);

    const ticks = scale.ticks(numBlocks);

    this.scale = scale;
    this.ticks.clear();
    this.ticks.pushObjects(ticks);
    this.tickFormat = scale.tickFormat();

    return this.scale;
  }

  calcStopTime(
    startTime: dayjs.Dayjs,
    value: number,
    unit: ManipulateType = 'hour'
  ) {
    const earliest = startTime.clone().startOf('day');
    const latest = earliest.clone().add(23, 'hours');

    const proposedStopTime = startTime.clone().add(value, unit);
    if (latest.isBefore(proposedStopTime)) {
      return latest;
    } else {
      return proposedStopTime;
    }
  }

  get formattedTicks() {
    return this.ticks?.map((date) =>
      this.tickFormat ? this.tickFormat(date) : date
    );
  }
}
