class Logger {

  constructor({ isDevelopMode }) {
    this._isDevelopMode = isDevelopMode
    this._count = 0

  }
  message({ name, value }) {
    if (this._isDevelopMode) {
      this.#_runDevelop(name, value)
    }
    else {
      this._count += 1
      if (this._count === 1) {
        this.#_runProduct()
      }
    }
  }
  #_runDevelop(name, value) {
    console.log('                                                               ');
    console.log('%c--------------------------------------------------------------', 'color: red');
    console.log('%c--------------------- Start log ------------------------------', 'color: red');
    console.log('                                                               ');
    console.time("log duration is:");
    const res = Object.prototype.toString.call(value)
    const dataType = res.split('[object')[1].split(']')[0]
    console.log(`Type is: ${dataType}`);
    console.log(name, value);
    console.log('                                                               ');
    console.timeEnd("log duration is:");
    console.log('%c---------------------- End log ------------------------------', 'color: red');
    console.log('%c-------------------------------------------------------------', 'color: red');
    console.log('                                                               ');
  }
  #_runProduct() {
    console.log('%cSorry we are in production mode..', 'color: red')
  }

}
module.exports = Logger;



