
const _isDevelop = Symbol("isDevelop");
const _count = Symbol("count");
const getDataType = (value) => {
  return Object.
    prototype
    .toString
    .call(value)
    .split("[object")[1]
    .split("]")[0]
    .split(' ')[1]
}
const red = () => "color: red"
const blue = () => "color: blue"
const writeStart = () => console.log("%c---------- Start log -----------", red())
const writeEnd = () => console.log("%c----------- End log ------------", red())

class ConsoleLogAdvanced {
  constructor({ isDevelopMode }) {
    this[_isDevelop] = isDevelopMode;
    this[_count] = 0;
  }
  logger({ name, value, path, line, comment, date, time, isActive = true }) {
    if (this[_isDevelop]) {
      this.#develop({ name, value, path, line, comment, date, time, isActive })
    }
    else {
      this.#production()
    }
  }
  #develop({ name, value, path, line, comment, date, time, isActive }) {
    if (isActive) {
      writeStart()
      if (!!path) console.log(`%cPath: %c${path}`, blue(), red());
      if (!!line) console.log(`%cLine: %c${line}`, blue(), red());
      if (!!date) console.log(`%cDate: %c${date}`, blue(), red());
      if (!!time) console.log(`%cTime: %c${time}`, blue(), red());
      console.log(`%cType: %c${getDataType(value)}`, blue(), red());
      console.log(`%cName: %c${name}`, blue(), red());
      if (getDataType(value) == 'Array' || getDataType(value) == 'Object') {
        console.dir(value);
      }
      else {
        console.log(value);
      }
      if (!!comment) console.log(`%cComment: %c${comment}`, blue(), red());
      writeEnd()
    }
  }
  #production() {
    this[_count]++
    if (this[_count] === 1) {
      console.log(`%cSorry logs is deactivate, We are in production mode..`, red());
    }
  }
}
export default ConsoleLogAdvanced