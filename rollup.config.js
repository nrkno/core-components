const buble = require('rollup-plugin-buble')
const commonjs = require('rollup-plugin-commonjs')
const json = require('rollup-plugin-json')
const resolve = require('rollup-plugin-node-resolve')
const serve = require('rollup-plugin-serve')
const {uglify} = require('rollup-plugin-uglify')
const {pkgs, getPackageName} = require('./bin/index.js') // Find all packages

const server = !process.env.ROLLUP_WATCH || serve('packages')
const globals = {'react-dom': 'ReactDOM', react: 'React'} // Do not include react in out package
const plugins = [json(), resolve(), commonjs(), buble(), uglify(), server]

export default pkgs
  .map((path) => ({path, name: getPackageName(path)})) // Find packages
  .reduce((all, {path, name}) => all.concat({
    input: `${path}/${name}.js`, // JS
    output: {
      file: `${path}/${name}.min.js`,
      name: name.replace(/-./g, (m) => m.slice(-1).toUpperCase()), // camelCase
      sourcemap: true,
      format: 'umd'
    },
    plugins
  }, {
    input: `${path}/${name}.jsx`, // JSX
    output: {
      file: `${path}/jsx/index.js`,
      name: name.replace(/(^|-)./g, (m) => m.slice(-1).toUpperCase()), // TitleCase
      sourcemap: true,
      format: 'umd',
      globals
    },
    external: Object.keys(globals),
    plugins
  }), [])
