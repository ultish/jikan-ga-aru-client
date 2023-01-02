import Route from '@ember/routing/route';
import ApplicationController from './controller';

export default class Application extends Route {
  setupController(controller: ApplicationController) {
    controller.initialise();
  }
}
