// const isDev = process.env.NODE_ENV === 'development'
const webpack = require('webpack')
const name = require('./package.json').name.replace(/[^/]+\//, '') // RegEx to remove package name scope
const path = require('path')
const fs = require('fs')

const config = {
  context: __dirname,
  entry: () =>
    fs.readdirSync(__dirname).reduce((files, file) => {
      const [base, ext] = file.replace('index', name).split('.')
      if (ext === 'js') files[base] = files[`${base}.min`] = `./${file}`
      if (ext === 'jsx') files[`${base}.${ext}`] = `./${file}`            // No jsx in dist
      return files
    }, {}),
  output: {
    path: path.resolve(__dirname, 'dist'),
    publicPath: '/',
    filename: '[name].js',
    libraryTarget: 'umd',
    library: name
  },
  devServer: {
    contentBase: [__dirname]
  },
  module: {
    rules: [{
      test: /\.jsx?$/,
      exclude: [/node_modules/],
      use: [{
        loader: 'babel-loader',
        options: { presets: ['env', 'react'] }
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
