import babel from 'rollup-plugin-babel'
import commonjs from 'rollup-plugin-commonjs'
import resolve from 'rollup-plugin-node-resolve'
import serve from 'rollup-plugin-serve'
import json from 'rollup-plugin-json'
import { uglify } from 'rollup-plugin-uglify'
import utils from './bin/index.js'

const minify = uglify({ output: { comments: /^!/ } })
const globals = { 'react-dom': 'ReactDOM', react: 'React' } // Exclude from output
const external = Object.keys(globals)
const treeshake = { pureExternalModules: true } // Strip React require
const plugins = [
  json(),
  resolve({ dedupe: external }),
  commonjs(),
  babel({ presets: [['@babel/preset-env', { modules: false }]] }),
  Boolean(process.env.ROLLUP_WATCH) && serve('packages')
]

utils.buildDocs()

export default utils.pkgs.reduce((all, path) => {
  const { version } = require(`${path}/package.json`)
  const file = utils.getPackageName(path)
  const name = file.replace(/-./g, (m) => m.slice(-1).toUpperCase())
  const jsx = name.replace(/./, (m) => m.toUpperCase())

  return all.concat({
    input: `${path}/${file}.test.js`, // JS CJS
    output: {
      format: 'cjs',
      file: `${path}/${file}.test.cjs.js`,
      globals
    },
    treeshake,
    external: ['fs', 'path', 'http'],
    plugins: [
      json(),
      resolve({ preferBuiltins: true }),
      commonjs(),
      babel({ presets: [['@babel/preset-env', { modules: false }]] })
    ]
  }, {
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
}, [])
