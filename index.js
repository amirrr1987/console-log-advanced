const _isDevelopMode = Symbol("isDevelopMode");
const _count = Symbol("count");
class ConsoleLogAdvanced {
  constructor({ isDevelopMode }) {
    this[_isDevelopMode] = isDevelopMode;
    this[_count] = 0;
  }
  logger({ name, value, path, line, commit, deactivate = false }) {
    if (this[_isDevelopMode]) {
      this.#_checkDeactivate(name, value, path, line, commit, deactivate);
    } else {
      this[_count]++;
      if (this[_count] === 1) {
        this.#_runProduct();
      }
    }
  }
  #_checkDeactivate(name, value, path, line, commit, deactivate) {
    if (!deactivate) {
      this.#_runDevelop(name, value, path, line, commit, deactivate);
    } else {
      this.#_whenLogDeactivate(path, line);
    }
  }
  #_runDevelop(name, value, path, line, commit, deactivate) {
    const res = Object.prototype.toString.call(value);
    const dataType = res.split("[object")[1].split("]")[0];

    if (!deactivate) {
      console.log(
        "                                                               "
      );
      console.log(
        "%c--------------------- Start log ------------------------------",
        "color: red"
      );
      console.log(
        "                                                               "
      );
      if (path) {
        console.log(`%cFile: %c${path}`, "color: blue", "color: red");
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
      if (value && value.length) {
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

      if (commit) {
        console.log(`%cCommit: %c${commit}`, "color: blue", "color: red");
      }
      console.log(
        "                                                               "
      );
      console.log(
        "%c---------------------- END log ------------------------------",
        "color: red"
      );
      console.log(
        "                                                               "
      );
    } else {
      this.#_whenLogDeactivate(path, line);
    }
  }
  #_whenLogDeactivate(path, line) {
    if (path && line) {
      console.log(`Logger deactivate in File ${path} in line: ${line}`);
    }
    if (path && !line) {
      console.log(`Logger deactivate in File: ${path}`);
    }
    if (!path && line) {
      console.log(`Logger deactivate in Line: ${line}`);
    }
    if (!path && !line) {
      console.log(`Logger deactivate`);
    }
  }
  #_runProduct() {
    console.log("%cSorry we are in production mode..", "color: red");
  }
}

export default ConsoleLogAdvanced