const buble = require('rollup-plugin-buble')
const commonjs = require('rollup-plugin-commonjs')
const json = require('rollup-plugin-json')
const resolve = require('rollup-plugin-node-resolve')
const serve = require('rollup-plugin-serve')
const {uglify} = require('rollup-plugin-uglify')
const {pkgs, getPackageName} = require('./bin/index.js') // Find all packages

const server = !process.env.ROLLUP_WATCH || serve('packages')
const globals = {'react-dom': 'ReactDOM', react: 'React', 'prop-types': 'PropTypes'} // Exclude from output
const pluginsCJS = [json(), resolve(), commonjs(), buble(), server]
const pluginsUMD = pluginsCJS.concat(uglify)

export default pkgs.reduce((all, path) => {
  const pkg = require(`${path}/package.json`)
  const file = getPackageName(path)
  const banner = `/*! @nrk/${file} v${pkg.version} - Copyright (c) 2017-${new Date().getFullYear()} NRK */`
  const nameCamelCase = file.replace(/-./g, (m) => m.slice(-1).toUpperCase())
  const nameTitleCase = nameCamelCase.replace(/./, (m) => m.toUpperCase())

  return all.concat({
    input: `${path}/${file}.js`, // JS CJS
    plugins: pluginsCJS,
    output: {
      format: 'cjs',
      file: `${path}/${file}.cjs.js`,
      name: nameCamelCase
    }
  }, {
    input: `${path}/${file}.js`, // JS UMD
    plugins: pluginsUMD,
    output: {
      format: 'umd',
      file: `${path}/${file}.min.js`,
      name: nameCamelCase,
      sourcemap: true,
      banner
    }
  }, {
    input: `${path}/${file}.jsx`, // JSX CJS
    external: Object.keys(globals),
    plugins: pluginsCJS,
    output: {
      format: 'cjs',
      file: `${path}/jsx.js`,
      name: nameTitleCase,
      globals
    }
  }, {
    input: `${path}/${file}.jsx`, // JSX UMD
    external: Object.keys(globals),
    plugins: pluginsUMD,
    output: {
      format: 'umd',
      file: `${path}/${file}.jsx.js`,
      name: nameTitleCase,
      sourcemap: true,
      globals,
      banner
    }
  })
}, [])
