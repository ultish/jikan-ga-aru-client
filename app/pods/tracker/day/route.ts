import Route from '@ember/routing/route';

export default class TrackerDay extends Route {
  model(param: any) {
    console.log(param);
    // prevent ember from being smart and trying to load a
    // model via dynamic route info
  }
}
