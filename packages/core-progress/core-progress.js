import { name, version } from './package.json'
import { dispatchEvent, queryAll } from '../utils'

const UUID = `data-${name}-${version}`.replace(/\W+/g, '-') // Strip invalid attribute characters

export default function progress (elements, value) {
  const options = typeof value === 'object' ? value : { value }
  const indeterminate = typeof options.value === 'string'

  return queryAll(elements).map((progress) => {
    progress.max = Number(options.max) || progress.max

    progress.setAttribute(UUID, '')
    progress.setAttribute('role', 'img')

    if (indeterminate) {
      progress.removeAttribute('value')
      progress.setAttribute('aria-label', options.value)
    } else if (options.hasOwnProperty('value')) {
      progress.value = Number(options.value) || 0
      const percent = progress.value / progress.max * 100

      progress.setAttribute('aria-label', `${percent}%`)

      dispatchEvent(UUID, 'progress.changed', { percent })
    }

    return progress
  })
}
