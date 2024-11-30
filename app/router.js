import EmberRouter from '@ember/routing/router';
import config from 'jikan-ga-aru-client/config/environment';

export default class Router extends EmberRouter {
  location = config.locationType;
  rootURL = config.rootURL;
}

Router.map(function () {
  this.route('tracker', function () {
    this.route('day', { path: '/tracker/day/:id' });
  });
  this.route('chargecodes');
  this.route('tracker.days');
});
