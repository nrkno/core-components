import fs from 'fs'
import path from 'path'

const coreProgress = fs.readFileSync(path.resolve(__dirname, 'core-progress.min.js'), 'utf-8')
const customElements = fs.readFileSync(require.resolve('@webcomponents/custom-elements'), 'utf-8')

describe('core-progress', () => {
  beforeEach(async () => {
    await browser.refresh()
    await browser.executeScript(customElements)
    await browser.executeScript(coreProgress)
  })

  it('sets up properties', async () => {
    await browser.executeScript(() => {
      document.body.innerHTML = `
        <core-progress></core-progress>
      `
    })
    await expect($('core-progress').getAttribute('type')).toEqual('linear')
    await expect($('core-progress').getAttribute('value')).toEqual('0')
    await expect($('core-progress').getAttribute('role')).toEqual('img')
    await expect($('core-progress').getAttribute('aria-label')).toEqual('0%')
  })

  it('updates label from value', async () => {
    await browser.executeScript(() => {
      document.body.innerHTML = `
        <core-progress value="0.2"></core-progress>
      `
    })
    await expect($('core-progress').getAttribute('aria-label')).toEqual('20%')
    await browser.executeScript(() => (document.querySelector('core-progress').value = 0))
    await expect($('core-progress').getAttribute('aria-label')).toEqual('0%')
    await browser.executeScript(() => (document.querySelector('core-progress').value = 1))
    await expect($('core-progress').getAttribute('aria-label')).toEqual('100%')
  })

  it('updates label from value as radial', async () => {
    await browser.executeScript(() => {
      document.body.innerHTML = `
        <core-progress value="0.2" type="radial"></core-progress>
      `
    })
    await expect($('core-progress').getAttribute('aria-label')).toEqual('20%')
    await browser.executeScript(() => (document.querySelector('core-progress').value = 0))
    await expect($('core-progress').getAttribute('aria-label')).toEqual('0%')
    await browser.executeScript(() => (document.querySelector('core-progress').value = 1))
    await expect($('core-progress').getAttribute('aria-label')).toEqual('100%')
  })

  it('updates label from indeterminate value', async () => {
    await browser.executeScript(() => {
      document.body.innerHTML = `
        <core-progress value="Loading..."></core-progress>
      `
    })
    await expect($('core-progress').getAttribute('aria-label')).toEqual('Loading...')
  })

  it('calculates percentage relative to max', async () => {
    await browser.executeScript(() => {
      document.body.innerHTML = `
        <core-progress value="0.5"></core-progress>
      `
    })
    await expect($('core-progress').getAttribute('aria-label')).toEqual('50%')
    await browser.executeScript(() => (document.querySelector('core-progress').max = 10))
    await expect($('core-progress').getAttribute('aria-label')).toEqual('5%')
    await browser.executeScript(() => (document.querySelector('core-progress').max = 100))
    await expect($('core-progress').getAttribute('aria-label')).toEqual('1%')
  })

  it('does not trigger change event on max', async () => {
    await browser.executeScript(() => {
      document.body.innerHTML = `
        <core-progress></core-progress>
      `
      document.addEventListener('change', () => (document.body.appendChild(document.createElement('i'))))
      document.querySelector('core-progress').max = 2
    })
    await expect(browser.isElementPresent($('i'))).toEqual(false)
  })

  it('triggers change event on value', async () => {
    await browser.executeScript(() => {
      document.body.innerHTML = `
        <core-progress></core-progress>
      `
      document.addEventListener('change', () => (document.body.appendChild(document.createElement('i'))))
      document.querySelector('core-progress').value = 2
    })
    await expect(browser.isElementPresent($('i'))).toEqual(true)
  })

  it('triggers change event on indeterminate value', async () => {
    await browser.executeScript(() => {
      document.body.innerHTML = `
        <core-progress></core-progress>
      `
      document.addEventListener('change', () => (document.body.appendChild(document.createElement('i'))))
      document.querySelector('core-progress').value = 'Loading...'
    })
    await expect(browser.isElementPresent($('i'))).toEqual(true)
  })
})
