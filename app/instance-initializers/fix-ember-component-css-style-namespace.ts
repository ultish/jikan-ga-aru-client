import ApplicationInstance from '@ember/application/instance';
// @ts-ignore
import podNames from 'ember-component-css/pod-names';

function initialize(appInstance: ApplicationInstance): void {
  for (const [componentPath, styleNamespace] of Object.entries(
    podNames as Record<string, string>
  )) {
    // https://api.emberjs.com/ember/3.14/classes/ApplicationInstance/methods/factoryFor?anchor=factoryFor
    const factoryForComponent = appInstance.factoryFor(
      `component:${componentPath}`
    ); // Instance ist FactoryManager
    if (factoryForComponent === undefined) {
      continue; // no component
    }

    // @ts-ignore
    const componentCtor = factoryForComponent.class;
    if (componentCtor === undefined) {
      continue;
    }

    // https://github.com/ebryn/ember-component-css/issues/293#issuecomment-483425075
    Object.defineProperty(componentCtor.prototype, 'styleNamespace', {
      configurable: true,
      enumerable: true,
      get: function () {
        return styleNamespace;
      },
    });
  }
}

export default {
  after: 'route-styles', // run after `ember-component-css` "route-styles"-Initializer
  initialize,
};
