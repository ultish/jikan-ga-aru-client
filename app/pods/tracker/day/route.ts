import Route from '@ember/routing/route';

type Resolved<P> = P extends Promise<infer T> ? T : P;

export type TrackerDayModel = Resolved<ReturnType<TrackerDayRoute['model']>>;

export default class TrackerDayRoute extends Route {
  id: string | undefined = undefined;

  async model({ id }: { id: string }) {
    console.log(id);
    this.id = id;

    // prevent ember from being smart and trying to load a
    // model via dynamic route info

    //fetch the tracked day

    // fetch the timeChargeTotals using the week and year of trackedday

    return {
      id,
    };
  }
}
