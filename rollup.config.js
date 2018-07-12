import buble from 'rollup-plugin-buble'
import commonjs from 'rollup-plugin-commonjs'
import json from 'rollup-plugin-json'
import resolve from 'rollup-plugin-node-resolve'
import serve from 'rollup-plugin-serve'
import {uglify} from 'rollup-plugin-uglify'
import {pkgs, getPackageName} from './bin/index.js' // Find all packages

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
