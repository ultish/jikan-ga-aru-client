import Controller from '@ember/controller';
import { action } from '@ember/object';
import { tracked } from '@glimmer/tracking';
import { inject as service } from '@ember/service';
import Prefs from 'jikan-ga-aru-client/services/prefs';
import '@glint/environment-ember-loose';

export default class ApplicationController extends Controller {
  @service declare prefs: Prefs;

  startTimes = [6, 7, 8, 9, 10, 11, 12];

  initialise() {
    // this.startTime = localStorage.getItem('jga-start-time') ?? '6';
  }

  @action
  setStartTime(val: number) {
    localStorage.setItem('jga-start-time', val.toString());

    // this.startTime = val;
    this.prefs.setStartTimeNum(val);
  }

  @tracked
  sideBarClosed = false;

  @action
  sideBarControl() {
    this.sideBarClosed = !this.sideBarClosed;
  }
}

// DO NOT DELETE: this is how TypeScript knows how to look up your controllers.
declare module '@ember/controller' {
  interface Registry {
    application: ApplicationController;
  }
}
