// using require instead of import to play nicely with travis ci
const babel = require('rollup-plugin-babel')
const commonjs = require('rollup-plugin-commonjs')
const resolve = require('rollup-plugin-node-resolve')
const serve = require('rollup-plugin-serve')
const json = require('rollup-plugin-json')
const { uglify } = require('rollup-plugin-uglify')
const utils = require('./bin/index.js')

const minify = uglify({ output: { comments: /^!/ } })
const globals = { 'react-dom': 'ReactDOM', react: 'React' } // Exclude from output
const external = Object.keys(globals)
const treeshake = { pureExternalModules: true } // Strip React require
const plugins = [
  json(),
  resolve({ dedupe: external }),
  commonjs(),
  babel({ presets: [['@babel/preset-env', { modules: false }]] }),
  !process.env.ROLLUP_WATCH || serve('packages')
]

utils.buildDocs()

export default utils.pkgs.reduce((all, path) => {
  const { version } = require(`${path}/package.json`)
  const file = utils.getPackageName(path)
  const name = file.replace(/-./g, (m) => m.slice(-1).toUpperCase())
  const jsx = name.replace(/./, (m) => m.toUpperCase())

  return all.concat({
    input: `${path}/${file}.js`, // JS CJS
    output: {
      format: 'cjs',
      file: `${path}/${file}.cjs.js`,
      globals
    },
    treeshake,
    external,
    plugins
  }, {
    input: `${path}/${file}.js`, // JS UMD
    output: {
      format: 'umd',
      file: `${path}/${file}.min.js`,
      banner: `/*! @nrk/${file} v${version} - Copyright (c) 2017-${new Date().getFullYear()} NRK */`,
      footer: `window.customElements.define('${file}', ${name})`,
      sourcemap: true,
      globals,
      name
    },
    treeshake,
    external,
    plugins: plugins.concat(minify)
  }, {
    input: `${path}/${file}.jsx`, // JSX CJS
    output: {
      format: 'cjs',
      file: `${path}/jsx.js`,
      globals
    },
    treeshake,
    external,
    plugins
  }, {
    input: `${path}/${file}.jsx`, // JSX UMD (only used in docs)
    output: {
      format: 'umd',
      file: `${path}/${file}.jsx.js`,
      name: jsx,
      sourcemap: true,
      globals
    },
    treeshake,
    external,
    plugins
  })
}, [
  {
    input: 'packages/utils.js', // JS UMD for tests
    output: {
      format: 'umd',
      file: 'packages/utils.min.js',
      sourcemap: false,
      name: 'utils',
      globals
    },
    plugins,
    external
  }
])
