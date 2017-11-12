const path = require('path')
const webpack = require('webpack')

const config = {
  entry: {
    'core-components': './index.js',
    'core-components.min': './index.js'
  },
  output: {
    path: path.resolve(__dirname, 'dist'),
    publicPath: '/',
    filename: '[name].js',
    library: 'core-components',
    libraryTarget: 'umd'
  },
  context: __dirname,
  devServer: {
    contentBase: [__dirname]
  },
  module: {
    rules: [{
      test: /\.js?$/,
      exclude: [/node_modules/],
      use: [{
        loader: 'babel-loader',
        options: { presets: ['env'] }
      }]
    }]
  },
  plugins: [
    new webpack.optimize.ModuleConcatenationPlugin(),
    new webpack.optimize.UglifyJsPlugin({
      include: /(\.min)\.js$/,
      sourceMap: true
    })
  ]
}

module.exports = config
