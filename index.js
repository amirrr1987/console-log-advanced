let mode = 'product';
let varName = '';
const setMode = (status) => {
  mode = status;
};
const runArray = (data) => {
  console.log('--------------------- Start log ------------------------------');
  console.log('Type is: Array');
  console.log('Length is:', data.length);
  console.log(varName);
  console.dir(data);
  console.log('---------------------- End log ------------------------------');
};
const runObject = (data) => {
  console.log('--------------------- Start log ------------------------------');
  console.log('Type is: Obejct');
  console.log(varName);
  console.table(data);
  console.log('---------------------- End log ------------------------------');
};
const runString = (data) => {
  console.log('--------------------- Start log ------------------------------');
  console.log('Type is: String');
  console.log(varName , data); 
  console.log('---------------------- End log ------------------------------');
};
const runNumber = (data) => {
  console.log('--------------------- Start log ------------------------------');
  console.log('Type is: Number');
  console.log(varName , data); 
  console.log('---------------------- End log ------------------------------');
};
const runStringNumber = (data) => { 
  console.log('--------------------- Start log ------------------------------');
  console.log('Type is: String Number');
  console.log(varName , data); 
  console.log('---------------------- End log ------------------------------');
}
const runBoolean = (data) => {
  console.log('--------------------- Start log ------------------------------');
  console.log('Type is: Boolean');
  console.log(varName , data); 
  console.log('---------------------- End log ------------------------------');
};
const runNull = (data) => {
  console.log('--------------------- Start log ------------------------------');
  console.log('Type is: null');
  console.log(varName , data); 
  console.log('---------------------- End log ------------------------------');
};
const runUndefined = (data  ) => {
  console.log('--------------------- Start log ------------------------------');
  console.log('Type is: undefined');
  console.log(varName , data); 
  console.log('---------------------- End log ------------------------------');
};

function isNumeric(val) {
    return /^-?\d+$/.test(val);
}


const runDevelop = (data) => {

  let dataType = typeof data;
  if (dataType && Array.isArray(data)){
    dataType = "array";
  }
  if (isNumeric(+data) && typeof data === 'string') {
    dataType = "stringNumber";  
  }
  if (typeof data === 'object' && data == null) {
    dataType = "null";
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
const logger = (name, logData) => {
  
  if (mode == "develop") {
    varName = name+ ' return:';
    runDevelop(logData);
  }
  if (mode == "product") {
    runProduct();
  }
};

module.exports.setMode = setMode;
module.exports.logger = logger;


