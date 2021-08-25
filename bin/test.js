import 'regenerator-runtime/runtime'
import path from 'path'
import dotenv from 'dotenv'
import { SpecReporter } from 'jasmine-spec-reporter'
import { getUUID } from '../packages/utils'
import Axios from 'axios'

dotenv.config()
const isLocal = process.env.NODE_ENV === 'test'
const username = process.env.SMARTBEAR_USER
const authKey = process.env.SMARTBEAR_AUTHKEY
const localIdentifier = getUUID()
const identifier = new Date().toLocaleString()
const specs = path.resolve(process.cwd(), `packages/*/*.test.${isLocal ? '' : 'cjs.'}js`)

const commonCapabilities = {
  username,
  password: authKey,
  record_video: true,
  record_network: false, // there is an issue with CBT, forcing us not to record network p.t.
  build: 'core-components tests'
}

function completeCaps (caps) {
  return caps.map((cap) => ({
    browserName: '', // TypeError: Target browser must be a string...
    ...commonCapabilities,
    ...cap
  }))
}

/**
 * stripSensitiveValuesByKey replaces value of target key (e.g 'password') with a redacted value
 * @param {Array} entryList List of key-value objects
 * @param {String} key key to be replaced
 * @returns {Array} entryList with replaced values (if any were found)
 */
function stripSensitiveValuesByKey (entryList, key) {
  const VAL_REDACTED = '**Value redacted**'
  return entryList.map(entry => Object.prototype.hasOwnProperty.call(entry, key)
    ? ({
        ...entry,
        [key]: VAL_REDACTED
      })
    : entry)
}

function config () {
  console.log('isLocal?', isLocal)
  console.log('capabilities:', stripSensitiveValuesByKey(capabilities, 'password'))
  return {
    framework: 'jasmine',
    specs: [specs],
    seleniumAddress: `http://${username}:${authKey}@hub.crossbrowsertesting.com:80/wd/hub`,
    directConnect: isLocal,
    SELENIUM_PROMISE_MANAGER: false,
    jasmineNodeOpts: {
      defaultTimeoutInterval: 20 * 1000, // 20 sek
      print: Function.prototype // Disable dot reporter
    },
    allScriptsTimeout: 30000,
    getPageTimeout: 30000,
    logLevel: 'INFO',
    multiCapabilities: capabilities.map((cap) => {
      return {
        'cbt.user': username,
        'cbt.key': authKey,
        'cbt.debug': false, // Capture screenshots for visual logs
        'cbt.record_video': false, // Capture video of tests
        'cbt.console': 'errors', // Capture console logs
        'cbt.localIdentifier': localIdentifier,
        'cbt.sendKeys': true,
        project: 'core-components',
        build: identifier,
        name: ['core-components, ',
          (cap.browserName || cap.device).replace(/./, (m) => m.toUpperCase()),
          cap.browser_version ? parseInt(cap.browser_version) : ''
        ].join(' '),
        ...cap
      }
    }),
    onPrepare: () => {
      const env = jasmine.getEnv()
      env.addReporter(new SpecReporter({
        spec: {
          displaySuccessful: true,
          displayFailed: true,
          displayStacktrace: 'pretty',
          displayErrorMessages: true
        },
        summary: false
      }))
      browser.waitForAngularEnabled(false)
    },
    onComplete: async (passed) => {
      console.log('Test passed?', passed)
      if (isLocal) return // Break early to limit logging for local testing.

      const session = await browser.getSession()
      console.log('session:', session)
      console.log('sessionId:', session.id_)
      await browser.waitForAngularEnabled(false)
      const passedText = passed ? 'pass' : 'fail'
      Axios.put(`https://crossbrowsertesting.com/api/v3/selenium/${session.id_}`, {
        action: 'set_score',
        score: passedText,
        json: true,
        resolveWithFullResponse: false
      }, {
        auth: {
          username,
          password: authKey
        }
      })
        .then(_ => console.log('Score set successfully with response: '))
        .catch(err => console.error('Setting score failed with error: ', err))
    }
  }
}
const capabilities = isLocal
  ? [
      {
        browserName: 'chrome',
        chromeOptions: {
          args: ['--headless', '--window-size=800x600']
        }
      }
    ]
  : completeCaps([
    // Edge 18.18362, Windows 10, hits=218803, vdist=0.184
    // Edge 18.17763, Windows 10, hits=70727, vdist=0.178
    // Edge 18.18363, Windows 10, hits=15274, vdist=0.184
    // core-components
    {
      tags: {
        id: 'edge',
        browser: 'edge',
        platform: 'windows',
        device: 'desktop',
        hits: 304804,
        popularity: 'high',
        default: true
      },
      platform: 'Windows 10',
      browserName: 'MicrosoftEdge',
      version: '18'
    }
  ])

exports.config = config()
