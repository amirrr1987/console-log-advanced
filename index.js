let mode = "product";

const isDevelopMode = (status) => {
  mode = status;
};
const logArray = (data) => {
  console.log("Type is: array");
  console.dir(data);
};
const logObject = (data) => {
  console.log("Type is: object");
  console.table(data);
};
const logString = (data) => {
  console.log("Type is: string");
  console.log(data);
};
const logNumber = (data) => {
  console.log("Type is: number");
  console.log(data);
};
const logStringNumber = (data) => {
  console.log("Type is: string number");
  console.log(data);
};
const logBoolean = (data) => {
  console.log("Type is: boolean");
  console.log(data);
};
const logNull = () => {
  console.log("Type is: null");
  console.log("null");
};
const logUndefined = () => {
  console.log("Type is: undefined");
  console.log("undefined");
};

const logDevelop = (data) => {
  let dataType = typeof data;
  if (dataType && Array.isArray(data)) {
    dataType = "array";
  }
  if (dataType === "string" && typeof parseInt(data) === "number") {
    dataType = "stringNumber";
  }

  switch (dataType) {
    case "array":
      logArray(data);
      break;

    case "object":
      logObject(data);
      break;

    case "string":
      logString(data);
      break;

    case "number":
      logNumber(data);
      break;

    case "stringNumber":
      logStringNumber(data);
      break;

    case "boolean":
      logBoolean(data);
      break;

    case "null":
      logNull(data);
      break;

    case "undefined":
      logUndefined(data);
      break;
  }
};

const logger = (logData) => {
  if (mode == "develop") {
    logDevelop(logData);
  }
  if (mode == "product") {
    console.log("Sorry, we are in product mode");
  }
};

module.exports.isDevelopMode = isDevelopMode;
module.exports.logger = logger;
