import Component from '@glimmer/component';
import { tracked } from '@glimmer/tracking';
import { action } from '@ember/object';
import { GQLTrackedDay } from 'jikan-ga-aru-client/graphql/schemas';
import { scaleTime /*, ScaleTime*/ } from 'd3-scale';
import dayjs, { ManipulateType } from 'dayjs';
import { inject as service } from '@ember/service';
import Prefs from 'jikan-ga-aru-client/pods/prefs/service';
// eslint-disable-next-line @typescript-eslint/ban-ts-comment
// @ts-ignore
import { cached } from 'tracked-toolbox';

interface TrackedDayArgs {
  day: GQLTrackedDay;
}

const TRACKED_TASKS_WIDTH = 300;
const TIMEBLOCK_WIDTH = 60;

export default class TrackedDay extends Component<TrackedDayArgs> {
  @service declare prefs: Prefs;

  @tracked containerWidth = 0;

  @action
  initialise(ele: HTMLElement) {
    this.onResize(ele);
  }

  get startTime() {
    console.log('starttime', this.prefs.startTimeNum);
    return dayjs().startOf('day').add(this.prefs.startTimeNum, 'hour');
  }

  @action
  willDestroy() {
    super.willDestroy();
  }

  @action
  onResize(ele: HTMLElement) {
    this.containerWidth = ele.clientWidth ?? 0;
  }

  @cached
  get numBlocks() {
    // only showing 18hrs max
    const maxWidth = 18 * TIMEBLOCK_WIDTH;
    const availableWidth = Math.min(
      this.containerWidth - TRACKED_TASKS_WIDTH,
      maxWidth
    );
    const numBlocks = Math.floor(availableWidth / TIMEBLOCK_WIDTH) - 1;

    return numBlocks;
  }

  @cached
  get scale() {
    const scale = scaleTime();
    const usedWidth = this.numBlocks * TIMEBLOCK_WIDTH;

    scale
      .domain([this.startTime.toDate(), this.stopTime.toDate()])
      .range([0, usedWidth]);

    return scale;
  }

  @cached
  get ticks() {
    return this.scale.ticks(this.numBlocks);
  }

  @cached
  get stopTime() {
    return this.calcStopTime(
      this.startTime,
      this.numBlocks * TIMEBLOCK_WIDTH,
      'minutes'
    );
  }

  @cached
  get tickFormat() {
    return this.scale.tickFormat();
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

  @cached
  get formattedTicks() {
    return this.ticks?.map((date) =>
      this.tickFormat ? this.tickFormat(date) : date
    );
  }
}
