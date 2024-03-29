const path = require('path');
const nodeExternals = require('webpack-node-externals');

module.exports = {
  entry: './src/index.ts',
  module: {
    rules: [
      {
        test: /\.ts$/,
        use: 'ts-loader',
        exclude: /node_modules/
      }
    ]
  },
  resolve: {
    extensions: [ '.ts', '.js' ]
  },
  devtool: 'inline-source-map',
  output: {
    filename: 'bundle.js',
    libraryTarget: 'this',
    path: path.resolve(__dirname, 'dist')
  },
  target: "node",
  externals: [nodeExternals()],
};