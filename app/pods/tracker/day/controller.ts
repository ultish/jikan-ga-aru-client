import Controller from '@ember/controller';
import { TrackerDayModel } from 'jikan-ga-aru-client/pods/tracker/day/route';

export default class TrackerDayController extends Controller {
  declare model: TrackerDayModel;
}

// DO NOT DELETE: this is how TypeScript knows how to look up your controllers.
declare module '@ember/controller' {
  interface Registry {
    'tracker/day': TrackerDayController;
  }
}
