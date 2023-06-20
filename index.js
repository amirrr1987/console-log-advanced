const _isDevelopMode = Symbol("isDevelopMode");
const _count = Symbol("count");
class ConsoleLogAdvanced {
  constructor({ isDevelopMode }) {
    this[_isDevelopMode] = isDevelopMode;
    this[_count] = 0;
  }
  logger({ name, value, file, line, comment, isActive = true }) {
    if (this[_isDevelopMode]) {
      this.#_checkDeactivate(name, value, file, line, comment, isActive);
    } else {
      this[_count]++;
      if (this[_count] === 1) {
        this.#_runProduct();
      }
    }
  }
  #_checkDeactivate(name, value, file, line, comment, isActive) {
    if (isActive) {
      this.#_runDevelop(name, value, file, line, comment, isActive);
    } else {
      this.#_whenLogDeactivate(file, line);
    }
  }
  #_runDevelop(name, value, file, line, comment, isActive) {
    const res = Object.prototype.toString.call(value);
    const dataType = res.split("[object")[1].split("]")[0];

    if (isActive) {
      console.log(
        "                                                               "
      );
      console.log(
        "%c--------------------- Start log ------------------------------",
        "color: red"
      );
      if (file) {
        console.log(`%cFile: %c${file}`, "color: blue", "color: red");
      }
      if (line) {
        console.log(`%cLine: %c${line}`, "color: blue", "color: red");
      }
      if (name) {
        console.log(`%cVariable is: %c${name}`, "color: blue", "color: red");
      }
      if (value && dataType) {
        console.log(`%cType is: %c${dataType}`, "color: blue", "color: red");
      }
      if (value && dataType === 'Array') {
        console.log(
          `%cLength is: %c${value.length}`,
          "color: blue",
          "color: red"
        );
      }
      if (value) {
        console.log(`%cValue is:`, "color: blue");
        if (typeof value === "object") {
          console.dir(value);
        } else {
          console.log(value);
        }
      }

      if (comment) {
        console.log(`%ccomment: %c${comment}`, "color: blue", "color: red");
      }
      console.log(
        "%c---------------------- End log ------------------------------",
        "color: red"
      );
      console.log(
        "                                                               "
      );
    } else {
      this.#_whenLogDeactivate(file, line);
    }
  }
  #_whenLogDeactivate(file, line) {
    if (file && line) {
      console.log(`Logger deactivate in File ${file} in line: ${line}`);
    }
    if (file && !line) {
      console.log(`Logger deactivate in File: ${file}`);
    }
    if (!file && line) {
      console.log(`Logger deactivate in Line: ${line}`);
    }
    if (!file && !line) {
      console.log(`Logger deactivate`);
    }
  }
  #_runProduct() {
    console.log("%cSorry we are in production mode..", "color: red");
  }
}

export default ConsoleLogAdvanced