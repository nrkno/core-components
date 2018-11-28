import { name, version } from './package.json'
import { dispatchEvent, queryAll } from '../utils'

const UUID = `data-${name}-${version}`.replace(/\W+/g, '-') // Strip invalid attribute characters

export default function progress (elements, value) {
  const options = typeof value === 'object' ? value : { value }
  let indeterminate

  return queryAll(elements).map((progress) => {
    indeterminate = !progress.hasAttribute('value') && Number(options.value) !== parseFloat(options.value) // handle numeric string values
    const isNative = typeof window.HTMLProgressElement !== 'undefined'
    const oldValue = progress.getAttribute(UUID) || progress.getAttribute('value') || '0'
    const newValue = (options.value && String(options.value)) || oldValue
    const max = Number(options.max) || progress.getAttribute('max') || '1'
    const percentage = Math.round(Number(newValue) / max * 100) || 0
    const noChanges = newValue === oldValue && max === progress.getAttribute('max') && indeterminate !== progress.hasAttribute('value')
    const canUpdate = noChanges || dispatchEvent(progress, 'progress.change', { value: newValue, max, percentage, indeterminate })

    progress.setAttribute(UUID, canUpdate ? newValue : oldValue)
    progress.setAttribute('role', 'img')

    if (canUpdate) {
      if (indeterminate) {
        progress.removeAttribute('value')
        progress.setAttribute('aria-label', newValue)
      } else {
        progress.setAttribute('value', newValue)
        progress.setAttribute('max', max)
        progress.setAttribute('aria-label', `${percentage}%`)
      }
    }

    // handle old browsers and gracefully degrade the progress element
    if (!isNative && !document.getElementById(UUID)) {
      document.head.insertAdjacentHTML('beforeend', `<style id="${UUID}">[${UUID}]:after {content: attr(aria-label)}</style>`)
    }

    return progress
  })
}
