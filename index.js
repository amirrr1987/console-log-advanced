let mode = 'product';

const isDevelopMode = (status) => {
  mode = status;
};
const runArray = (data) => {
  console.dir(data);
};
const runObject = (data) => {
  console.table(data);
};
const runString = (data) => {
  console.log(data);
};
const runNumber = (data) => {
  console.log(data);
};
const runStringNumber = (data) => { 
  console.log('runStringNumber');
  console.log(data);
}
const runBoolean = (data) => {
  console.log(data);
};
const runNull = () => {
  console.log("null");
};
const runUndefined = () => {
  console.log("undefined");
};

const runDevelop = (data) => {

  let dataType = typeof data;
  if (dataType && Array.isArray(data)){
    dataType = "array";
  }
  if (typeof parseInt(data) === "number") {
    dataType = "stringNumber";  
  }

  switch (dataType) {
    case 'array':
      runArray(data)
      break
      
    case 'object':
      runObject(data);
      break;
        
    case 'string':
      runString(data);
      break;
          
    case 'number':
      runNumber(data);
      break;
          
    case 'stringNumber':
      runStringNumber(data);
      break;

    case 'boolean':
      runBoolean(data);
      break;

    case 'null':
      runNull(data);
      break;

    case 'undefined':
      runUndefined(data);
      break;
    
  }
};
const runProduct = () => {
  console.log("Sorry, we are in product mode");
};
const logger = (logData) => {

  if (mode == "develop") {
    runDevelop(logData);
  }
  if (mode == "product") {
    runProduct();
  }
};

module.exports.isDevelopMode = isDevelopMode;
module.exports.logger = logger;
