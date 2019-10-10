import fs from 'fs'
import path from 'path'
import { prop, attr } from '../test-utils'

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
    await expect(prop('core-progress', 'type')).toEqual('linear')
    await expect(prop('core-progress', 'value')).toEqual('0')
    await expect(attr('core-progress', 'role')).toEqual('img')
    await expect(attr('core-progress', 'aria-label')).toEqual('0%')
  })

  it('updates label from value', async () => {
    await browser.executeScript(() => {
      document.body.innerHTML = `
        <core-progress value="0.2"></core-progress>
      `
    })
    await expect(attr('core-progress', 'aria-label')).toEqual('20%')
    await browser.executeScript(() => (document.querySelector('core-progress').value = 0))
    await expect(attr('core-progress', 'aria-label')).toEqual('0%')
    await browser.executeScript(() => (document.querySelector('core-progress').value = 1))
    await expect(attr('core-progress', 'aria-label')).toEqual('100%')
  })

  it('updates label from value as radial', async () => {
    await browser.executeScript(() => {
      document.body.innerHTML = `
        <core-progress value="0.2" type="radial"></core-progress>
      `
    })
    await expect(attr('core-progress', 'aria-label')).toEqual('20%')
    await browser.executeScript(() => (document.querySelector('core-progress').value = 0))
    await expect(attr('core-progress', 'aria-label')).toEqual('0%')
    await browser.executeScript(() => (document.querySelector('core-progress').value = 1))
    await expect(attr('core-progress', 'aria-label')).toEqual('100%')
  })

  it('updates label from indeterminate value', async () => {
    await browser.executeScript(() => {
      document.body.innerHTML = `
        <core-progress value="Loading..."></core-progress>
      `
    })
    await expect(attr('core-progress', 'aria-label')).toEqual('Loading...')
  })

  it('calculates percentage relative to max', async () => {
    await browser.executeScript(() => {
      document.body.innerHTML = `
        <core-progress value="0.5"></core-progress>
      `
    })
    await expect(attr('core-progress', 'aria-label')).toEqual('50%')
    await browser.executeScript(() => (document.querySelector('core-progress').max = 10))
    await expect(attr('core-progress', 'aria-label')).toEqual('5%')
    await browser.executeScript(() => (document.querySelector('core-progress').max = 100))
    await expect(attr('core-progress', 'aria-label')).toEqual('1%')
  })

  it('does not trigger change event on max', async () => {
    await browser.executeScript(() => {
      document.body.innerHTML = `
        <core-progress></core-progress>
      `
      document.addEventListener('change', () => (window.triggered = true))
      document.querySelector('core-progress').max = 2
    })
    await expect(browser.executeScript(() => window.triggered)).toBeFalsy()
  })

  it('triggers change event on value', async () => {
    await browser.executeScript(() => {
      document.body.innerHTML = `
        <core-progress></core-progress>
      `
      document.addEventListener('change', () => (window.triggered = true))
      document.querySelector('core-progress').value = 2
    })
    await expect(browser.executeScript(() => window.triggered)).toBeTruthy()
  })

  it('triggers change event on indeterminate value', async () => {
    await browser.executeScript(() => {
      document.body.innerHTML = `
        <core-progress></core-progress>
      `
      document.addEventListener('change', () => (window.triggered = true))
      document.querySelector('core-progress').value = 'Loading...'
    })
    await expect(browser.executeScript(() => window.triggered)).toBeTruthy()
  })
})
