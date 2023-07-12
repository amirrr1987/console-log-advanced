import { log } from "console";
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
const writeStart = () => log("%c---------- Start log -----------", red())
const writeEnd = () => log("%c----------- End log ------------", red())

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
      if (!!path) log(`%cPath: %c${path}`, blue(), red());
      if (!!line) log(`%cLine: %c${line}`, blue(), red());
      if (!!date) log(`%cDate: %c${date}`, blue(), red());
      if (!!time) log(`%cTime: %c${time}`, blue(), red());
      log(`%cType: %c${getDataType(value)}`, blue(), red());
      if (getDataType(value) == 'Object') {
        log(`%cLength: %c${value.lenght}`, blue(), red());
      }
      log(`%Name: %c${name}`, blue(), red());
      log(value);
      if (!!comment) log(`%ccomment: %c${comment}`, blue(), red());
      writeEnd()
    }
  }
  #production() {
    this[_count]++
    if (this[_count] === 1) {
      console.log(`%cSorry logs is deactive, We are in production mode..`, red());
    }
  }
}
export default ConsoleLogAdvanced