import Route from '@ember/routing/route';
import ApplicationController from './controller';
import '@glint/environment-ember-loose';

export default class Application extends Route {
  setupController(controller: ApplicationController) {
    controller.initialise();
  }
}
