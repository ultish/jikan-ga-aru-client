import Component from '@glimmer/component';
import { tracked } from '@glimmer/tracking';
import { action } from '@ember/object';
import { GQLTrackedDay } from 'jikan-ga-aru-client/graphql/schemas';
import { scaleTime } from 'd3-scale';
import dayjs, { ManipulateType } from 'dayjs';
import { inject as service } from '@ember/service';
import Prefs from 'jikan-ga-aru-client/pods/prefs/service';
// eslint-disable-next-line @typescript-eslint/ban-ts-comment
// @ts-ignore
import { cached } from 'tracked-toolbox';
import TrackedTaskList from '../../tracked-task-list';
import TrackedTask from '../../tracked-task';

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

    return Math.floor(availableWidth / TIMEBLOCK_WIDTH);
  }

  get endTime() {
    return this.startTime.add(this.numBlocks, 'hour');
  }

  get scale() {
    return scaleTime()
      .domain([this.startTime.toDate(), this.endTime.toDate()])
      .range([0, this.numBlocks * TIMEBLOCK_WIDTH]);
  }

  get ticks() {
    return this.scale.ticks(this.numBlocks);
  }

  get formattedTicks() {
    return this.ticks.map((t: Date) => dayjs(t).format('HH:mm'));
  }

  <template>
    {{! @glint-nocheck: not typesafe yet }}
    <div
      class='tracked-day-scale'
      {{did-resize this.onResize}}
      {{did-insert this.initialise}}
      {{will-destroy this.willDestroy}}
    >
      {{dayjs-format @day.date 'YYYY-MM-DD ddd'}}

      <div id='tick-container' class=''>
        {{#each this.formattedTicks as |tick|}}
          <div class='tick-hour text-base odd:bg-gray-900'>
            {{tick}}
          </div>
        {{/each}}
      </div>
      <div id='time-container'>
        <TrackedTaskList @trackedDayId={{@day.id}} as |trackedTasks|>
          {{#each trackedTasks as |tt|}}
            <TrackedTask @ticks={{this.ticks}} @trackedTask={{tt}} />
          {{/each}}
        </TrackedTaskList>
      </div>
    </div>
  </template>
}
