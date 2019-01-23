import { name, version } from './package.json'
import { dispatchEvent, queryAll } from '../utils'

const UUID = `data-${name}-${version}`.replace(/\W+/g, '-') // Strip invalid attribute characters

export default function progress (elements, value) {
  const options = typeof value === 'object' ? value : { value }
  const isNative = typeof window.HTMLProgressElement !== 'undefined'

  // handle old browsers and gracefully degrade the progress element
  if (!isNative && !document.getElementById(UUID)) {
    const style = document.head.appendChild(document.createElement('style'))
    style.textContent = `[${UUID}]::after{content:attr(aria-label)}`
    style.id = UUID
  }

  return queryAll(elements).map((progress) => {
    const oldValue = progress.getAttribute(UUID) || progress.getAttribute('value') || '0'
    const newValue = String(options.value != null ? options.value : oldValue)
    const max = String(options.max || progress.getAttribute('max') || 1)
    const indeterminate = Number(newValue) !== parseFloat(newValue) // handle numeric string values
    const percentage = Math.round(newValue / max * 100) || 0

    const noChanges = newValue === oldValue && max === progress.getAttribute('max') && indeterminate !== progress.hasAttribute('value')
    const canUpdate = noChanges || dispatchEvent(progress, 'progress.change', { value: newValue, max, percentage, indeterminate })
    const value = canUpdate ? newValue : oldValue

    progress.setAttribute(UUID, value)
    progress.setAttribute('role', 'img')

    if (indeterminate) {
      progress.removeAttribute('value')
      progress.setAttribute('aria-label', value)
    } else {
      progress.setAttribute('max', max) // Set max before value to make IE happy
      progress.setAttribute('value', value)
      progress.setAttribute('aria-label', `${percentage}%`)
    }

    return progress
  })
}
