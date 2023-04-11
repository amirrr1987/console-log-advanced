const _isDevelopMode = Symbol("isDevelopMode");
const _count = Symbol("count");

class Logger {
  constructor({ isDevelopMode }) {
    this[_isDevelopMode] = isDevelopMode;
    this[_count] = 0;
  }

  message({ name = 'Data is:', value, path = '', line = '', comment = '', deactivate = false }) {
    if (this[_isDevelopMode]) {
      if (!deactivate) {
        this.#_runDevelop(name, value, path, line, comment, deactivate);
      }
      else {
        console.log(`%cLogger is deactivate, You can active log => deactivate: false`, 'color: red')
      }
    } else {
      this[_count]++;
      if (this[_count] === 1) {
        this.#_runProduct();
      }
    }
  }
  #_runDevelop(name, value, path, line, comment) {
    const res = Object.prototype.toString.call(value)
    const dataType = res.split('[object')[1].split(']')[0]
    console.log('                                                               ');
    console.log('%c--------------------- Start log ------------------------------', 'color: red');
    console.log('                                                               ');
    if (path) console.log(`%cFile name: %c${path}`, 'color: blue', 'color: red');
    if (line) console.log(`%cLog line: %c${line}`, 'color: blue', 'color: red');
    if (name) console.log(`%cVariable name is: %c${name}`, 'color: blue', 'color: red');
    console.log(`%cType is:: %c${dataType}`, 'color: blue', 'color: red');
    if (typeof value === 'object') {
      console.dir(value);
    }
    else {
      console.log(value);
    }
    if (comment) console.log(`%cComment: %c${comment}`, 'color: blue', 'color: red');
    console.log('                                                               ');
    console.log('%c---------------------- End log ------------------------------', 'color: red');
    console.log('                                                               ');
  }
  #_runProduct() {
    console.log('%cSorry we are in production mode..', 'color: red')
  }

}

export default Logger
