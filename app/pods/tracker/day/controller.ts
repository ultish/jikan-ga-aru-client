import Controller from '@ember/controller';
import { GQLTrackedDay } from 'jikan-ga-aru-client/graphql/schemas';

export default class TrackerDay extends Controller {
  get trackedDay(): GQLTrackedDay | undefined {
    const model: any = this.model;

    if (model?.data?.trackedDays?.length) {
      return model?.data?.trackedDays[0];
    } else {
      return undefined;
    }
  }
}

// DO NOT DELETE: this is how TypeScript knows how to look up your controllers.
declare module '@ember/controller' {
  interface Registry {
    'tracker/day': TrackerDay;
  }
}
