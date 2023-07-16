const _isDevelop = Symbol("isDevelop");
const _count = Symbol("count");

const colors = {
  title: "color: red",
  info: "color: blue",
};

const getDataType = (value) => {
  return Object.prototype.toString.call(value).split("[object ")[1].split("]")[0];
};

const writeLogHeader = () => {
  console.groupCollapsed("%c---------- Start log -----------", colors.title);
};

const writeLogFooter = () => {
  console.groupEnd("%c----------- End log ------------", colors.title);
};

const writeLogDetails = (label, content) => {
  if (!content) return;
  console.info(`%c${label}: %c${content}`, colors.info, colors.title);
};

const writeProductionMessage = () => {
  console.error("%cSorry, logs are deactivated. We are in production mode.", colors.title);
};

class ConsoleLogAdvanced {
  constructor({ isDevelopMode }) {
    this[_isDevelop] = isDevelopMode;
    this[_count] = 0;
  }

  logger({ name, value, path, line, comment, date, time, isActive = true }) {
    if (this.#isDevelop) {
      this.#develop({ name, value, path, line, comment, date, time, isActive });
    } else {
      this.#production();
    }
  }

  #develop({ name, value, path, line, comment, date, time, isActive }) {
    if (!isActive) return;

    writeLogHeader();
    writeLogDetails("Path", path);
    writeLogDetails("Line", line);
    writeLogDetails("Date", date);
    writeLogDetails("Time", time);
    writeLogDetails("Type", getDataType(value));
    writeLogDetails("Name", name);

    if (getDataType(value) === "Array" || getDataType(value) === "Object") {
      console.table(value);
    } else {
      console.info(value);
    }

    writeLogDetails("Comment", comment);
    writeLogFooter();
  }

  #production() {
    this.#count++;
    if (this.#count === 1) {
      writeProductionMessage();
    }
  }
}

export default ConsoleLogAdvanced;
