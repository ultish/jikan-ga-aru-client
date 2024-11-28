import Component from '@glimmer/component';
import dayjs from 'dayjs';
import {
  GQLChargeCode,
  GQLQuery,
  GQLTrackedTask,
  QueryToChargeCodesArgs,
} from 'jikan-ga-aru-client/graphql/schemas';
// eslint-disable-next-line @typescript-eslint/ban-ts-comment
// @ts-ignore
import { cached, localCopy } from 'tracked-toolbox';
import { tracked } from '@glimmer/tracking';
import { action } from '@ember/object';
import { task, timeout } from 'ember-concurrency';
import type { Task } from 'ember-concurrency';

import {
  GQLMutation,
  MutationToUpdateTrackedTaskArgs,
} from 'jikan-ga-aru-client/graphql/schemas';
import { useMutation, useQuery } from 'glimmer-apollo';

import { UPDATE_TRACKED_TASK } from 'jikan-ga-aru-client/graphql/mutations/mutations';
import { GET_CHARGE_CODES } from 'jikan-ga-aru-client/graphql/queries/queries';
import PowerSelectMultiple from 'ember-power-select/components/power-select-multiple';

interface TrackedTaskArgs {
  trackedTask: GQLTrackedTask;
  ticks: Date[];
  chargeCodes: GQLChargeCode[];
}

class TimeBlock {
  @tracked selected = false;
  @tracked checked = false;
  @tracked timeBlock = -1;

  constructor(timeBlock: number, checked: boolean) {
    this.timeBlock = timeBlock;
    this.checked = checked;
  }
}

export default class TrackedTask extends Component<TrackedTaskArgs> {
  lastBlockClicked = -1;

  @localCopy('args.trackedTask.notes') notes;

  constructor(owner: unknown, args: TrackedTaskArgs) {
    super(owner, args);

    this.notes = args.trackedTask.notes;
  }

  @cached
  get squares() {
    if (!this.args.ticks) {
      return [];
    }

    // 00:00 = 0, 00:06 = 1, 00:12 = 2, 00:18 = 3, 00:24 = 4, 00:30 = 5
    // 00:36 = 6, 00:42 = 7, 00:48 = 8, 00:54 = 9
    // 01:00 = 10
    const squares = [];
    const trackedTask = this.args.trackedTask;

    for (let i = 0; i < this.args.ticks.length; i++) {
      const tick = this.args.ticks[i];
      const tickTime = dayjs(tick);
      const tickHour = tickTime.hour();
      const tickMinute = tickTime.minute();

      const timeBlock = tickHour * 10 + Math.floor(tickMinute / 6);
      const checked = trackedTask.timeBlocks?.includes(timeBlock) || false;

      squares.push(new TimeBlock(timeBlock, checked));
    }

    return squares;
  }

  get chargeCodes() {
    return this.chargeCodesQuery.data?.chargeCodes || [];
  }

  chargeCodesQuery = useQuery<GQLQuery, QueryToChargeCodesArgs>(this, () => [
    GET_CHARGE_CODES,
  ]);

  updateTrackedTask = useMutation<GQLMutation, MutationToUpdateTrackedTaskArgs>(
    this,
    () => [UPDATE_TRACKED_TASK]
  );

  @action
  async updateChargeCodes(chargeCodes: GQLChargeCode[]) {
    await this.updateTrackedTask.mutate({
      variables: {
        input: {
          id: this.args.trackedTask.id,
          chargeCodes: chargeCodes.map((cc) => cc.id),
        },
      },
    });
  }

  @action
  async updateNotes() {
    await this.updateTrackedTask.mutate({
      variables: {
        input: {
          id: this.args.trackedTask.id,
          notes: this.notes,
        },
      },
    });
  }

  @task
  *updateTimeBlocks() {
    yield timeout(500);

    const timeBlocks = this.squares
      .filter((s) => s.checked)
      .map((s) => s.timeBlock);

    yield this.updateTrackedTask.mutate({
      variables: {
        input: {
          id: this.args.trackedTask.id,
          timeBlocks,
        },
      },
    });
  }

  @action
  clicked(timeBlock: TimeBlock) {
    if (this.lastBlockClicked === -1) {
      timeBlock.checked = !timeBlock.checked;
      this.lastBlockClicked = timeBlock.timeBlock;
    } else {
      const start = Math.min(this.lastBlockClicked, timeBlock.timeBlock);
      const end = Math.max(this.lastBlockClicked, timeBlock.timeBlock);

      for (let i = start; i <= end; i++) {
        const block = this.squares.find((s) => s.timeBlock === i);
        if (block) {
          block.checked = !block.checked;
        }
      }

      this.lastBlockClicked = -1;
    }

    // @ts-ignore
    this.updateTimeBlocks.perform();
  }

  <template>
    {{! @glint-nocheck: not typesafe yet }}
    <div class='tracked-task'>
      <div id='tracked-task-details'>
        <PowerSelectMultiple
          @searchEnabled={{true}}
          @options={{this.chargeCodes}}
          @selected={{@trackedTask.chargeCodes}}
          @placeholder='Select chargecodes...'
          @onChange={{this.updateChargeCodes}} as |chargeCode|
        >
          {{chargeCode.name}}
        </PowerSelectMultiple>
        <Input
          aria-label='notes'
          @value={{this.notes}}
          placeholder='Notes...'
          {{on 'focusout' this.updateNotes}}
        />
      </div>
      <div id='time-container'>
        {{#each this.squares as |block|}}
          <div
            class='block {{if block.checked 'checked'}}'
            role='button'
            {{on 'click' (fn this.clicked block)}}
          >
          </div>
        {{/each}}
      </div>
    </div>
  </template>
}
