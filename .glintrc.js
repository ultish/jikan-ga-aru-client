'use strict';

module.exports = {
  checkStandaloneTemplates: true,
  environment: {
    'ember-loose': {
      // Ember-specific configuration
      checkDynamicComponents: true,
      checkHelpers: true,
      checkModifiers: true,
    },
  },
};