import Route from '@ember/routing/route';
import ApplicationController from 'jikan-ga-aru-client/controllers/application';
import '@glint/environment-ember-loose';

export default class Application extends Route {
  setupController(controller: ApplicationController) {
    controller.initialise();
  }
}
