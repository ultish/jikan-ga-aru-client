'use strict';

const EmberApp = require('ember-cli/lib/broccoli/ember-app');
// const { Webpack } = require('@embroider/webpack');
// const { ESBuildMinifyPlugin } = require('esbuild-loader');
// const isProduction = EmberApp.env() === 'production';

module.exports = function (defaults) {
  let app = new EmberApp(defaults, {
    // Add options here
    flatpickr: {
      theme: 'dark',
    },
  });

  // Use `app.import` to add additional libraries to the generated
  // output files.
  //
  // If you need to use different assets in different
  // environments, specify an object as the first parameter. That
  // object's keys should be the environment name and the values
  // should be the asset to use in that environment.
  //
  // If the library that you are including contains AMD or ES6
  // modules that you would like to import into your application
  // please specify an object with the list of modules as keys
  // along with the exports of each module as its value.

  return app.toTree();
  // const { Webpack } = require('@embroider/webpack');
  // return require('@embroider/compat').compatBuild(app, Webpack, {
  //   packagerOptions: {
  //     webpackConfig: {
  //       plugins: [
  //         /*new BundleAnalyzerPlugin()*/
  //       ],
  //       optimization: {
  //         // this is much faster prod builds than default! go esbuild-loader!
  //         minimizer: [
  //           new ESBuildMinifyPlugin({
  //             legalComments: 'none',
  //             sourcemap: false,
  //             minify: isProduction,
  //             css: true,
  //             exclude: [/monaco/, /codemirror/],
  //           }),
  //         ],
  //       },
  //     },
  //   },
  //   staticAddonTestSupportTrees: true,
  //   staticAddonTrees: true,
  //   staticHelpers: true,
  //   staticComponents: true,
  //   // splitAtRoutes: ['application'], // can also be a RegExp
  // });
};
