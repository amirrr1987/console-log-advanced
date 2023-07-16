const _isDevelop = Symbol('isDevelop')
const _count = Symbol('count')

const colors = {
  title: 'color: red',
  info: 'color: blue',
}

const getDataType = (value) => {
  return Object.prototype.toString.call(value).split('[object ')[1].split(']')[0]
}

const logHeader = (title, collapsed) => {

  collapsed ? console.groupCollapsed(`%c---------- Start ${title} -----------`, colors.title) : console.group(`%c---------- Start ${title} -----------`, colors.title)

}

const logFooter = () => {
  console.groupEnd('%c----------- End log ------------', colors.title)
}

const logDetails = (label, content) => {
  if (!content) return
  console.info(`%c${label}: %c${content}`, colors.info, colors.title)
}

const writeProductionMessage = () => {
  console.error('%cSorry, logs are deactivated. We are in production mode.', colors.title)
}

class ConsoleLogAdvanced {
  constructor({ isDevelopMode }) {
    this[_isDevelop] = isDevelopMode
    this[_count] = 0
  }

  logger({ name, value, path, line, comment, date, time, collapsed = true, isActive = true }) {
    if (this[_isDevelop]) {
      this.#_develop({ name, value, path, line, comment, date, time, collapsed, isActive })
    } else {
      this.#_production()
    }
  }

  #_develop({ name, value, path, line, comment, date, time, collapsed, isActive }) {
    if (!isActive) return
    const filePath = 'src\\views\\pages\\topics\\Index.vue';
    const relativeFilePath = filePath.replace(/\\/g, '/');


    logHeader(name, collapsed)
    logDetails('Path', relativeFilePath)
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
    this._count++
    if (this._count === 1) {
      writeProductionMessage()
    }
  }
}

export default ConsoleLogAdvanced;
