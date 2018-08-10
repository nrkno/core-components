const {execSync} = require('child_process')
const path = require('path')
const fs = require('fs')
const args = getProcessArgs()
const pkgs = getPackagePaths()

module.exports = {args, pkgs, getProcessArgs, getPackageName, getPackagePaths}

// Utilities -------------------------------------------------------------------
function getProcessArgs () {
  return process.argv.slice(2).reduce((args, arg) => {
    const [key, value = true] = arg.split('=')
    args[key.replace(/^-*/g, '')] = value
    return args
  }, {})
}

function getPackageName (packagePath) {
  return packagePath.split(path.sep).pop()
}

function getPackagePaths () {
  const dir = path.join(process.cwd(), 'packages')
  return fs.readdirSync(dir).reduce((packages, file) => {
    const isPackage = fs.existsSync(path.join(dir, file, 'package.json'))
    return packages.concat(isPackage ? path.join(dir, file) : [])
  }, [])
}

// Exectution: install ---------------------------------------------------------
if (args.install) {
  pkgs.forEach((path) => {
    console.log(`Installing ${getPackageName(path)}`)
    execSync('npm install', {cwd: path, stdio: 'inherit'})
    console.log('') // Insert new line
  })
}

// Exectution: publish ---------------------------------------------------------
if (args.publish) {
  const update = pkgs.filter((path) => args[getPackageName(path)])
  const action = args.publish.replace(/./, (m) => m.toUpperCase()) // Title case action
  const names = update.map(getPackageName).join(', ')

  // Update packages
  update.forEach((path) => {
    console.log(`Publishing ${getPackageName(path)}`)
    execSync(`npm version ${args.publish} -m 'Release ${args.publish} %s'`, {cwd: path, stdio: 'inherit'})
    execSync(`git push && git push --tags && npm publish --access public`, {cwd: path, stdio: 'inherit'})
    console.log('') // Insert new line
  })

  // Update main package
  console.log(`Updating version for core-components`)
  execSync(`git commit -am "${action} ${names}" && git push`, {cwd: process.cwd(), stdio: 'inherit'})
  execSync(`npm version ${args.publish}`, {cwd: process.cwd(), stdio: 'inherit'})
  execSync(`git push && git push --tags`, {cwd: process.cwd(), stdio: 'inherit'})
  console.log('') // Insert new line
}

// CSS: convert ----------------------------------------------------------------
if (args.css) {
  const file = path.join(process.cwd(), 'packages/core-dialog/core-dialog')
  const css = String(fs.readFileSync(`${file}.css`))

  const regExp = {
    rule: /.+{(\n*|.*)*?}/g,
    statement: /([^;{}]*;)+?/g,
    comments: /\/\*([^\*\/])*\*\//g
  }

  function css2sass(sourcePath, targetPath) {
    if(!path.isAbsolute(sourcePath)){
      throw new Error('sourcePath shoule be sbaolute')
    }
    var source = fs.statSync(sourcePath)
    if (source.isFile()) {
      if (!targetPath) {
        targetPath = sourcePath.replace('.css', '.sass')
      }
    } else {
      throw new Error('sourcePath is not exist')
    }

    var buffer = fs.readFileSync(sourcePath)
    var ruleList = matchs(regExp.rule, buffer.toString())
    var resultList = ruleList.map(rule => convert(rule))
    var result = resultList.join('\n')
    fs.writeFileSync(targetPath, result)
  }

  function convert (rule) {
    var result = ''
    var selector = /[^{]*/.exec(rule)
    if (selector) {
      result += selector[0] + '\n'
    }
    var statements = matchs(regExp.statement, rule)
    var statements = statements.map(statement => {
      statement = statement.replace(';', '').replace(/ /g, '').replace(/\n/g, '')
      var arr = statement.split('*/')
      if (arr.length > 1) {
        arr[0] += '*/'
        arr[1] = '  ' + arr[1]
      }
      statement = arr.join('\n')
      if (statement.indexOf('\n') === -1) {
        statement = statement + '\n'
      }
      return '  ' + statement
    })
    return result + statements.join('')
  }

  function matchs (reg, str) {
    var result = []
    var match
    while (match = reg.exec(str)) {
      result.push(match[0])
    }
    return result
  }

  // css.replace(/\.([^{]+)/g, '@mixin $1()')
  fs.writeFileSync(`${file}.scss`, css2sass(css)) // SCSS
}
