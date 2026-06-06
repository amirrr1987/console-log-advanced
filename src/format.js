export const typeOf = (value) => Object.prototype.toString.call(value).slice(8, -1)

export const formatTime = (date = new Date()) =>
  date.toLocaleTimeString('en-GB', { hour: '2-digit', minute: '2-digit', second: '2-digit' })

export const formatDate = (date = new Date()) =>
  date.toLocaleDateString('en-GB', { year: 'numeric', month: 'short', day: '2-digit' })

export function formatTimestamp(date = new Date(), format = 'locale') {
  if (typeof format === 'function') return format(date)

  switch (format) {
    case 'iso':
      return date.toISOString()
    case 'time-only':
      return formatTime(date)
    case 'date-only':
      return formatDate(date)
    case 'locale':
    default:
      return `${formatDate(date)} ${formatTime(date)}`
  }
}

export function printField(label, value, styles = {}) {
  if (value == null || value === '') return

  const labelStyle = styles.label ?? 'color:#64748b'
  const valueStyle = styles.value ?? 'color:#0ea5e9;font-weight:600'

  console.info(`%c${label}: %c${value}`, labelStyle, valueStyle)
}

export function printValue(value, kind = typeOf(value)) {
  switch (kind) {
    case 'Map':
      console.table(Array.from(value, ([key, val]) => ({ key, value: val })))
      return
    case 'Set':
      console.table(Array.from(value, (entry, index) => ({ index, value: entry })))
      return
    case 'Array':
    case 'Object':
      console.table(value)
      return
    case 'Date':
      console.info(`${value.toISOString()} (local: ${value.toLocaleString()})`)
      return
    case 'Promise':
      console.info('Promise { pending }')
      value.then(
        (resolved) => console.info('  ↳ resolved:', resolved),
        (reason) => console.info('  ↳ rejected:', reason),
      )
      return
    case 'Error':
      console.info(value.stack ?? value.message ?? value)
      return
    default:
      if (value !== undefined) console.info(value)
  }
}
