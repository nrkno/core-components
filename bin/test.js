import path from 'path'
import dotenv from 'dotenv'
import reporters from 'jasmine-reporters'

dotenv.config()
const isLocal = process.env.NODE_ENV === 'test'
const testName = new Date().toLocaleString()

function config () {
  return {
    framework: 'jasmine',
    specs: [path.resolve(__dirname, '..', 'packages/core-progress/*.test.js')],
    seleniumAddress: 'http://hub-cloud.browserstack.com/wd/hub',
    directConnect: isLocal,
    SELENIUM_PROMISE_MANAGER: false,
    jasmineNodeOpts: {
      defaultTimeoutInterval: 30000,
      print: () => {} // Disable dot reporter
    },
    logLevel: 'INFO',
    multiCapabilities: capabilities.map((cap) => {
      return {
        'browserstack.user': process.env.BROWSERSTACK_USER,
        'browserstack.key': process.env.BROWSERSTACK_KEY,
        project: 'core-components',
        build: testName,
        name: [
          cap.browserName.replace(/./, (m) => m.toUpperCase()),
          cap.browser_version ? parseInt(cap.browser_version) : ''
        ].join(' '),
        ...cap
      }
    }),
    onPrepare: () => {
      jasmine.getEnv().addReporter(new reporters.TapReporter())
      browser.waitForAngularEnabled(false)
    },
    onComplete: () => {
      console.log(`Test ${testName} finished`)
    }
  }
}

const capabilities = isLocal ? [{ browserName: 'chrome' }] : [
  {
    browserName: 'Chrome',
    os: 'Windows',
    os_version: '10',
    browser_version: '37',
  },
  {
    browserName: 'Chrome',
    os: 'Windows',
    os_version: '10',
    browser_version: '46',
  },
  {
    browserName: 'Chrome',
    os: 'Windows',
    os_version: '10',
    browser_version: '57',
  },
  {
    browserName: 'Edge',
    browser_version: '18.0',
    os: 'Windows',
    os_version: '10'
  },
  {
    browserName: 'Edge',
    browser_version: '17.0',
    os: 'Windows',
    os_version: '10'
  },
  {
    browserName: 'Edge',
    os: 'Windows',
    os_version: '10',
    browser_version: '15.0',
    resolution: '1024x768'
  },
  {
    browserName: 'Firefox',
    os: 'Windows',
    os_version: '10'
  },
  {
    browserName: 'Firefox',
    os: 'Windows',
    os_version: '10',
    browser_version: '52.0'
  },
  {
    browserName: 'Firefox',
    os: 'Windows',
    os_version: '7',
    browser_version: '44.0'
  },
  {
    browserName: 'IE',
    os: 'Windows',
    browser_version: '10'
  },
  {
    browserName: 'IE',
    browser_version: '11',
    os: 'Windows',
    os_version: '10'
  },
  {
    browserName: 'IE',
    os: 'Windows',
    os_version: '7',
    browser_version: '11'
  },
  {
    browserName: 'Opera',
    os: 'Windows',
    os_version: 'XP',
    browser_version: '12.16',
    resolution: '1024x768'
  },
  {
    browserName: 'Safari',
    os: 'OS X',
    os_version: 'High Sierra'
  },
  {
    browserName: 'Safari',
    os: 'OS X',
    os_version: 'Mavericks',
    browser_version: '7.1',
    resolution: '1024x768'
  },
  {
    browserName: 'Safari',
    os: 'OS X',
    os_version: 'Yosemite',
    browser_version: '8.0',
    resolution: '1024x768'
  },
  {
    browserName: 'Safari',
    os: 'OS X',
    os_version: 'El Capitan',
    browser_version: '9.1',
    resolution: '1024x768'
  },
  {
    browserName: 'Safari',
    os: 'OS X',
    os_version: 'Sierra',
    browser_version: '10.0',
    resolution: '1024x768'
  }
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
