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

interface TrackedTaskArgs {
  trackedTask: GQLTrackedTask;
  ticks: Date[];
  chargeCodes: GQLChargeCode[];
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
    let slot = 0;
    const result: number[] = [];
    this.args.ticks.forEach((tick: Date) => {
      const x = dayjs(tick);
      const hour = x.hour();
      slot = hour * 10;

      for (let i = 0; i < 10; i++) {
        result.push(slot++);
      }
    });

    return result;
  }

  @cached
  get squaresWithTimeBlocks() {
    const blocks = this.squares.map((num) => {
      const checked = this.args.trackedTask.timeSlots?.includes(num) ?? false;
      return new TimeBlock(num, checked);
    });
    return blocks;
  }

  @action
  updateNotes() {
    this.updateTrackedTaskGql.mutate({
      id: this.args.trackedTask.id,
      notes: this.notes,
    });
  }

  @action
  updateChargeCodes(selection: GQLChargeCode[], eps: any) {
    eps?.actions?.close();

    this.updateTrackedTaskGql.mutate({
      id: this.args.trackedTask.id,
      chargeCodeIds: selection.map((cc) => cc.id),
    });
  }

  @action
  async clicked(block: TimeBlock, e: MouseEvent) {
    block.checked = !block.checked;

    const timeSlots = this.squaresWithTimeBlocks
      .filter((b) => b.checked)
      .map((b) => b.timeBlock);

    if (e.shiftKey) {
      //
    }

    if (this.updateTrackedTask.isRunning) {
      console.log('waiting on tracked task update');
      await this.updateTrackedTask;
    }

    this.lastBlockClicked = block.timeBlock;

    // clear all selections
    this.squaresWithTimeBlocks.forEach((b) => (b.selected = false));

    this.updateTrackedTask.perform(timeSlots);
  }

  updateTrackedTask: Task<string, [number[]]> = task(
    { restartable: true },
    async (timeSlots: number[]) => {
      await timeout(200);

      console.log('checked blocks', timeSlots);

      this.updateTrackedTaskGql.mutate({
        id: this.args.trackedTask.id,
        chargeCodeIds: this.args.trackedTask.chargeCodes?.map((cc) => cc.id),
        timeSlots: timeSlots,
      });

      return 'done!';
    }
  );

  updateTrackedTaskGql = useMutation<
    GQLMutation,
    MutationToUpdateTrackedTaskArgs
  >(this, () => [UPDATE_TRACKED_TASK, {}]);

  // TODO move this to somewhere common
  chargeCodesQuery = useQuery<GQLQuery, QueryToChargeCodesArgs>(this, () => [
    GET_CHARGE_CODES,
  ]);

  @cached
  get chargeCodes() {
    if (this.chargeCodesQuery.loading) {
      return [];
    } else {
      return this.chargeCodesQuery.data?.chargeCodes;
    }
  }
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
