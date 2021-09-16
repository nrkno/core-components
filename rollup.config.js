import babel from '@rollup/plugin-babel'
import commonjs from '@rollup/plugin-commonjs'
import json from '@rollup/plugin-json'
import resolve from '@rollup/plugin-node-resolve'
import serve from 'rollup-plugin-serve'
import { terser } from 'rollup-plugin-terser'
import utils from './bin/index.js'

const minify = terser({ format: { comments: /^!/ } })
const globals = { 'react-dom': 'ReactDOM', react: 'React' } // Exclude from output
const external = Object.keys(globals)
const treeshake = { moduleSideEffects: 'no-external' } // Strip React require
const babelConfig = babel({ presets: [['@babel/preset-env', { modules: false }]], babelHelpers: 'bundled' })
const plugins = [
  json(),
  resolve({ dedupe: external }),
  commonjs(), // Must be above/before babelConfig
  babelConfig,
  Boolean(process.env.ROLLUP_WATCH) && serve('packages')
]

utils.buildDocs()

export default utils.pkgs.reduce((all, path) => {
  const { version } = require(`${path}/package.json`)
  console.log(version)
  const file = utils.getPackageName(path)
  const name = file.replace(/-./g, (m) => m.slice(-1).toUpperCase())
  const jsx = name.replace(/./, (m) => m.toUpperCase())
  const bannerText = `/*! @nrk/${file} v${version} - Copyright (c) 2017-${new Date().getFullYear()} NRK */`

  return all.concat({
    input: `${path}/${file}.test.js`, // JS CJS (used for testing)
    output: {
      format: 'cjs',
      file: `${path}/${file}.test.cjs.js`,
      exports: 'none', // Tests have no exports; set to 'auto' if this changes
      banner: bannerText,
      globals
    },
    treeshake,
    external: ['fs', 'path', 'http'],
    plugins: [
      json(),
      resolve({ preferBuiltins: true }),
      commonjs(), // Must be above/before babelConfig
      babelConfig
    ]
  }, {
    input: `${path}/${file}.js`, // JS CJS
    output: {
      format: 'cjs',
      file: `${path}/${file}.cjs.js`,
      banner: bannerText,
      exports: 'default',
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
      banner: bannerText,
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
      banner: bannerText,
      exports: 'default',
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
      banner: bannerText,
      name: jsx,
      sourcemap: true,
      globals
    },
    treeshake,
    external,
    plugins
  })
}, [])
