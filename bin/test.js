import path from 'path'
import dotenv from 'dotenv'
import request from 'request'
import { SpecReporter } from 'jasmine-spec-reporter'
import browserstack from 'browserstack-local'
import { getUUID } from '../packages/utils'

dotenv.config()
const isLocal = process.env.NODE_ENV === 'test'
const user = process.env.BROWSERSTACK_USER
const key = process.env.BROWSERSTACK_KEY
const testName = new Date().toLocaleString()
const localIdentifier = getUUID()
const bsLocal = new browserstack.Local()

function config () {
  return {
    framework: 'jasmine',
    specs: [path.resolve(__dirname, '..', 'packages/*/*.test.js')],
    seleniumAddress: 'http://hub-cloud.browserstack.com/wd/hub',
    directConnect: isLocal,
    SELENIUM_PROMISE_MANAGER: false,
    jasmineNodeOpts: {
      defaultTimeoutInterval: 2 * 60 * 1000,
      print: () => {} // Disable dot reporter
    },
    allScriptsTimeout: 30000,
    getPageTimeout: 30000,
    logLevel: 'INFO',
    multiCapabilities: capabilities.map((cap) => {
      return {
        'browserstack.user': user,
        'browserstack.key': key,
        'browserstack.debug': false, // Capture screenshots for visual logs
        'browserstack.video': false, // Capture video of tests
        'browserstack.console': 'errors', // Capture console logs
        'browserstack.localIdentifier': localIdentifier,
        project: 'core-components',
        build: testName,
        name: [
          cap.browserName.replace(/./, (m) => m.toUpperCase()),
          cap.browser_version ? parseInt(cap.browser_version) : ''
        ].join(' '),
        ...cap
      }
    }),
    beforeLaunch: async () => {
      await new Promise((resolve, reject) => {
        bsLocal.start({ key, localIdentifier, forceLocal: true }, (error) => {
          if (error) return reject(Error('BrowserStack Local error: ' + error))
          console.log('BrowserStack Local started')
          resolve()
        })
      })
    },
    afterLaunch: async () => {
      await new Promise((resolve) => {
        bsLocal.stop(() => {
          console.log('BrowserStack Local stopped')
          resolve()
        })
      })
    },
    onPrepare: () => {
      jasmine.getEnv().addReporter(new SpecReporter({
        displayFailuresSummary: true,
        displayFailuredSpec: true,
        displaySuiteNumber: true,
        displaySpecDuration: true
      }))
      browser.waitForAngularEnabled(false)
    },
    onComplete: async (passed) => {
      const session = await browser.getSession()
      request({
        uri: `https://${user}:${key}@api.browserstack.com/automate/sessions/${session.id_}.json`,
        method: 'PUT',
        form: { status: passed ? 'passed' : 'failed' }
      })
    }
  }
}

const capabilities = isLocal ? [
  {
    browserName: 'chrome',
    chromeOptions: {
      args: ['--headless', '--window-size=800x600']
    }
  }
  // {
  //   browserName: 'firefox'
  // }
] : [
  // {
  //   browserName: 'Chrome',
  //   browser_version: '37'
  //   os: 'Windows',
  //   os_version: '10',
  // },
  // {
  //   browserName: 'Chrome',
  //   browser_version: '46'
  //   os: 'Windows',
  //   os_version: '10',
  // }
  {
    browserName: 'Chrome',
    browser_version: '57',
    os: 'Windows',
    os_version: '10'
  },
  {
    browserName: 'Edge',
    browser_version: '15.0',
    os: 'Windows',
    os_version: '10'
  }
  // {
  //   browserName: 'Edge',
  //   browser_version: '18.0',
  //   os: 'Windows',
  //   os_version: '10'
  // },
  // {
  //   browserName: 'Edge',
  //   browser_version: '17.0',
  //   os: 'Windows',
  //   os_version: '10'
  // },
  // {
  //   browserName: 'Firefox',
  //   os: 'Windows',
  //   os_version: '10'
  // },
  // {
  //   browserName: 'Firefox',
  //   browser_version: '52.0'
  //   os: 'Windows',
  //   os_version: '10',
  // },
  // {
  //   browserName: 'Firefox',
  //   browser_version: '44.0'
  //   os: 'Windows',
  //   os_version: '7',
  // },
  // {
  //   browserName: 'IE',
  //   browser_version: '10'
  //   os: 'Windows',
  // },
  // {
  //   browserName: 'IE',
  //   browser_version: '11',
  //   os: 'Windows',
  //   os_version: '10'
  // },
  // {
  //   browserName: 'IE',
  //   browser_version: '11'
  //   os: 'Windows',
  //   os_version: '7',
  // },
  // {
  //   browserName: 'Opera',
  //   os: 'Windows',
  //   os_version: 'XP',
  //   browser_version: '12.16',
  //   resolution: '1024x768'
  // },
  // {
  //   browserName: 'Safari',
  //   os: 'OS X',
  //   os_version: 'High Sierra'
  // },
  // {
  //   browserName: 'Safari',
  //   browser_version: '7.1',
  //   os: 'OS X',
  //   os_version: 'Mavericks',
  //   resolution: '1024x768'
  // },
  // {
  //   browserName: 'Safari',
  //   browser_version: '8.0',
  //   os: 'OS X',
  //   os_version: 'Yosemite',
  //   resolution: '1024x768'
  // },
  // {
  //   browserName: 'Safari',
  //   browser_version: '9.1',
  //   os: 'OS X',
  //   os_version: 'El Capitan',
  //   resolution: '1024x768'
  // },
  // {
  //   browserName: 'Safari',
  //   browser_version: '10.0',
  //   os: 'OS X',
  //   os_version: 'Sierra',
  //   resolution: '1024x768'
  // },
  // {
  //   device: 'iPad Pro 9.7 2016',
  //   real_mobile: 'true',
  //   nativeWebTap: 'true',
  // },
  // {
  //   device: 'iPhone 8',
  //   os: 'iOS',
  //   os_version: '11',
  //   real_mobile: 'true',
  //   nativeWebTap: 'true',
  // },
  // {
  //   device: 'iPhone 8',
  //   os: 'iOS',
  //   os_version: '12',
  //   real_mobile: 'true',
  //   nativeWebTap: 'true',
  // },
  // {
  //   os_version: '11',
  //   device: 'iPhone SE',
  //   real_mobile: 'true',
  //   nativeWebTap: 'true',
  // },
  // {
  //   device: 'iPhone X',
  //   os_version: '11',
  //   real_mobile: 'true',
  //   nativeWebTap: 'true',
  // },
  // {
  //   device: 'iPhone XS',
  //   os_version: '12',
  //   real_mobile: 'true',
  //   nativeWebTap: 'true',
  // },
  // {
  //   os_version: '9.0',
  //   device: 'Google Pixel 3',
  //   real_mobile: 'true',
  // },
  // {
  //   os_version: '8.0',
  //   device: 'Samsung Galaxy S9',
  //   real_mobile: 'true',
  // },
  // {
  //   os_version: '7.1',
  //   device: 'Samsung Galaxy Note 8',
  //   real_mobile: 'true',
  // },
  // {
  //   os_version: '7.0',
  //   device: 'Samsung Galaxy S8',
  //   real_mobile: 'true',
  // },
  // {
  //   os_version: '6.0',
  //   device: 'Samsung Galaxy Note 4',
  //   real_mobile: 'true',
  // }
]

exports.config = config()
