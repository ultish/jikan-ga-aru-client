import Component from '@glimmer/component';
import dayjs from 'dayjs';
// eslint-disable-next-line @typescript-eslint/ban-ts-comment
// @ts-ignore
import { cached } from 'tracked-toolbox';

interface TrackedTaskArgs {
  trackedTask: TrackedTask;
  ticks: Date[];
}

export default class TrackedTask extends Component<TrackedTaskArgs> {
  @cached
  get squares() {
    if (!this.args.ticks) {
      return [];
    }

    debugger;
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
    console.log(result);

    return [];
  }

  get squaresWithTimeBlocks() {
    console.log('ticks', this.args.ticks, this.squares);
    return [];
  }
}
