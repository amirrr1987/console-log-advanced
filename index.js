class Logger {

  constructor({ isDevelopMode }) {
    this._isDevelopMode = isDevelopMode
  }
  message({ name, value }) {
    this._isDevelopMode ? this.#_runDevelop(name, value) : this.#_runProduct()

  }
  #_runDevelop(name, value) {
    console.log('                                                               ');
    console.log('%c--------------------------------------------------------------', 'color: red');
    console.log('%c--------------------- Start log ------------------------------', 'color: red');
    console.time("log duration is:");
    const res = Object.prototype.toString.call(value)
    const dataType = res.split('[object')[1].split(']')[0]
    console.log(`Type is: ${dataType}`);
    console.log(name, value);
    console.timeEnd("log duration is:");
    console.log('%c---------------------- End log ------------------------------', 'color: red');
    console.log('%c-------------------------------------------------------------', 'color: red');
    console.log('                                                               ');
  }

  #_runProduct() {
    console.log('Sorry we are in production mode..')
  }
}
module.exports = Logger;



