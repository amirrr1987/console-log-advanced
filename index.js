const _isDevelopMode = Symbol('isDevelopMode')
const _count = Symbol('count')

const colors = {
  title: 'color: red',
  info: 'color: blue',
}

const getDataType = (value) => {
  return Object.prototype.toString.call(value).split('[object ')[1].split(']')[0]
}

const logHeader = (title, collapsed) => {
  collapsed
    ? console.groupCollapsed(
      `%c       ${title}       `,
      'padding-block: 4px ;border: 1px solid red; color: blue; text-transform: capitalize;',
    )
    : console.group(
      `%c       ${title}       `,
      'padding-block: 4px ;border: 1px solid red; color: blue; text-transform: capitalize;',
    )
}

const logFooter = () => {
  console.groupEnd()
}

const logDetails = (label, content) => {
  if (!content) return
  console.info(`%c${label}: %c${content}`, colors.info, colors.title)
}

const writeProductionMessage = () => {
  console.log(
    '%cSorry, We are in production mode. Logs are deactivated',
    'background-color: #F44336; color: #FFFFFF; font-size: 16px; padding: 8px; border-radius: 8px',
  )
}

class ConsoleLogAdvanced {
  constructor({ isDevelopMode }) {
    this[_isDevelopMode] = isDevelopMode
    this[_count] = 0
  }

  logger({ name, value, path, line, comment, date, time, collapsed = true, isActive = true }) {
    if (this[_isDevelopMode]) {
      this.#_develop({ name, value, path, line, comment, date, time, collapsed, isActive })
    } else {
      this.#_production()
    }
  }

  #_develop({ name, value, path, line, comment, date, time, collapsed, isActive }) {
    if (!isActive) return
    logHeader(name, collapsed)
    logDetails('Path', path)
    logDetails('Line', line)
    logDetails('Date', date)
    logDetails('Time', time)
    logDetails('Type', getDataType(value))
    logDetails('Name', name)

    if (getDataType(value) === 'Array' || getDataType(value) === 'Object') {
      console.table(value)
    } else {
      console.info(value)
    }

    logDetails('Comment', comment)
    logFooter()
  }

  #_production() {
    this[_count]++
    if (this[_count] === 1) {
      console.log(2)
      writeProductionMessage()
    }
  }
}
export default ConsoleLogAdvanced