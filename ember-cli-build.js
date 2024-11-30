'use strict';

const EmberApp = require('ember-cli/lib/broccoli/ember-app');
// const { Webpack } = require('@embroider/webpack');
const { ESBuildMinifyPlugin } = require('esbuild-loader');
const isProduction = EmberApp.env() === 'production';

module.exports = function (defaults) {
  const app = new EmberApp(defaults, {
    // Add options here
    flatpickr: {
      theme: 'dark'
    },
  });
  // app.import('node_modules/flatpickr/dist/flatpickr.css');
  app.import('node_modules/flatpickr/dist/themes/dark.css');


  // return app.toTree();
  const { Webpack } = require('@embroider/webpack');
  return require('@embroider/compat').compatBuild(app, Webpack, {
    packagerOptions: {
      webpackConfig: {
        plugins: [
          /*new BundleAnalyzerPlugin()*/
        ],
        optimization: {
          // this is much faster prod builds than default! go esbuild-loader!
          minimizer: [
            new ESBuildMinifyPlugin({
              legalComments: 'none',
              sourcemap: false,
              minify: isProduction,
              css: true,
              exclude: [/monaco/, /codemirror/],
            }),
          ],
        },
        module: {
          rules: [
            {
              test: /\.css$/i,
              use: [
                {
                  loader: 'postcss-loader',
                  options: {
                    postcssOptions: {
                      config: 'postcss.config.js',
                    },
                  },
                },
              ],
            },
          ],
        },
      },
    },
    staticAddonTestSupportTrees: true,
    staticAddonTrees: true,
    staticHelpers: true,
    staticComponents: true,
    // splitAtRoutes: ['application'], // can also be a RegExp
  });
};
