const buble = require('rollup-plugin-buble')
const json = require('rollup-plugin-json')
const uglify = require('rollup-plugin-uglify')
const {pkgs, getPackageName} = require('./bin/index.js') // Find all packages

const globals = {'react-dom': 'ReactDOM', react: 'React'} // Do not include react in out package
const plugins = [json(), buble(), uglify()]

export default pkgs
  .map((path) => ({path, name: getPackageName(path)})) // Find packages
  .concat({path: 'packages', name: 'core-components'}) // Include bundle
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
