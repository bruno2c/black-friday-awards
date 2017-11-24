const webpack = require('webpack');
const path = require('path');

module.exports = {
  context: path.resolve(__dirname, 'web/js/gallery/examples/src'),
  entry: [
    'babel-polyfill',
    './app.js',
    './appWinners.js',
  ],
  output: {
    filename: 'app.js',
    path: path.resolve(__dirname, 'web/js/gallery/dist'),
    publicPath: '/',
  },
  devServer: {
    contentBase: path.resolve(__dirname, 'web/js/gallery/examples/src'),
    port: 8000,
  },
  module: {
    rules: [
      {
        test: /\.js$/,
        exclude: [/node_modules/],
        use: [{
          loader: 'babel-loader',
          options: { presets: ['react', 'es2015', 'stage-0'] },
        }],
      },
    ],
  },
  resolve: {
    alias: {
      'react-photo-gallery': path.resolve(__dirname, 'web/js/gallery/src/Gallery'),
    }
  },
  plugins: [
    new webpack.optimize.CommonsChunkPlugin({
      name: 'common',
      filename: 'common.js',
      minChunk: 2,
    }),
  ]
};
