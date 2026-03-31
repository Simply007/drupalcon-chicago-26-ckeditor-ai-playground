const path = require('path');
const webpack = require('webpack');

module.exports = {
  entry: './js/ckeditor5_plugins/timestamp/src/index.js',
  output: {
    path: path.resolve(__dirname, 'js/build'),
    filename: 'timestamp.js',
    library: ['CKEditor5', 'timestamp'],
    libraryTarget: 'umd',
    libraryExport: 'default'
  },
  plugins: [
    new webpack.DllReferencePlugin({
      manifest: require.resolve('ckeditor5/build/ckeditor5-dll.manifest.json'),
      scope: 'ckeditor5/src',
      name: 'CKEditor5.dll'
    })
  ],
  module: {
    rules: [
      {
        test: /\.js$/,
        exclude: /node_modules/
      }
    ]
  }
};
