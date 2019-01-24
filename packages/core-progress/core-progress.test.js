const coreProgress = require('./core-progress.min')
const standardHTML = `
<label>Progress:
  <progress class="my-progress"></progress>
</label>
`

describe('core-progress', () => {
  beforeEach(() => { document.body.innerHTML = standardHTML })
  it('should exist', () => {
    expect(coreProgress).toBeInstanceOf(Function)
  })

  it('should add all attributes upon init', () => {
    coreProgress('.my-progress', 0.5)
    expect(document.querySelector('.my-progress').getAttribute('value')).toBe('0.5')
    expect(document.querySelector('.my-progress').getAttribute('max')).toBe('1')
    expect(document.querySelector('.my-progress').getAttribute('role')).toBe('img')
    expect(document.querySelector('.my-progress').getAttribute('aria-label')).toBe('50%')
  })
  it('should update progress value when provided numerical value', () => {
    coreProgress('.my-progress', '5')
    expect(document.querySelector('.my-progress').getAttribute('value')).toBe('5')
  })
  it('should update progress value to numeric 0 when provided', () => {
    coreProgress('.my-progress', '5')
    coreProgress('.my-progress', 0)
    expect(document.querySelector('.my-progress').getAttribute('value')).toBe('0')
  })
  it('should update progress value when provided object with property value', () => {
    coreProgress('.my-progress', { value: 5, max: 100 })
    expect(document.querySelector('.my-progress').getAttribute('value')).toBe('5')
  })
  it('should update aria-label with percentage', () => {
    coreProgress('.my-progress', { value: 50, max: 100 })
    expect(document.querySelector('.my-progress').getAttribute('aria-label')).toBe('50%')

    coreProgress('.my-progress', 60)
    expect(document.querySelector('.my-progress').getAttribute('aria-label')).toBe('60%')
  })
  it('should remove progress value when provided string value and set aria-label', () => {
    coreProgress('.my-progress', 'Loading...')

    expect(document.querySelector('.my-progress').getAttribute('value')).toBeNull()
    expect(document.querySelector('.my-progress').getAttribute('aria-label')).toBe('Loading...')
  })
  it('should update progress max when provided object with property max', () => {
    coreProgress('.my-progress', { value: 5, max: 10 })
    expect(document.querySelector('.my-progress').getAttribute('max')).toBe('10')

    coreProgress('.my-progress', { max: 100 })
    expect(document.querySelector('.my-progress').getAttribute('max')).toBe('100')
  })
  it('should add style tag when progress is not supported in browser', () => {
    const progressElement = window.HTMLProgressElement
    window.HTMLProgressElement = undefined

    coreProgress('.my-progress', { value: 5, max: 10 })
    expect(document.head.querySelector('style')).not.toBeNull()

    window.HTMLProgressElement = progressElement
  })
  it('dispatches event upon value change', () => {
    const progressSpy = jest.fn()
    window.addEventListener('progress.change', progressSpy)

    coreProgress('.my-progress', { value: 5, max: 100 })
    coreProgress('.my-progress', 50)

    expect(progressSpy).toBeCalled()
  })
})
