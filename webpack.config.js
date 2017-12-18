const webpack = require('webpack')
const config = require('./package.json')
const path = require('path')
const fs = require('fs')

module.exports = {
  context: __dirname,
  entry: () =>
    fs.readdirSync(__dirname).reduce((files, file) => {
      const [base, ext] = file.split('.')
      if (base === 'date') return files
      if (ext === 'js') files[base] = files[`${base}.min`] = `./${file}`
      if (ext === 'jsx') files[`${base}.${ext}`] = `./${file}`
      return files
    }, {}),
  output: {
    path: path.resolve(__dirname, 'dist'),
    publicPath: '/',
    filename: '[name].js',
    libraryTarget: 'umd',
    library: 'coreComponents'
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
        options: {
          presets: ['env', 'react'],
          plugins: ['transform-object-rest-spread']
        }
      }]
    }]
  },
  plugins: [
    new webpack.optimize.ModuleConcatenationPlugin(),
    new webpack.optimize.UglifyJsPlugin({
      include: /(\.min)\.js$/,
      sourceMap: true
    }),
    new webpack.DefinePlugin({
      __VERSION__: JSON.stringify(config.version)
    })
  ]
}
