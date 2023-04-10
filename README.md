# console-log-advanced

1. console log is show in block line width start and end

2. Check data type

## Install

Install via **npm**

```javascript
npm i -D console-log-advanced
```

## Usage

```javascript

import Logger from "console-log-advanced"

const logger = new Logger({isDevelopMode: true})

const foo = {name:  'foo',age:  32, active:  true}

logger.message({name: 'foo', value: foo , path: '/src/logger.js'})

```

### isDevelopMode = true

```javascript

--------------------------------------------------------------
--------------------- Start log ------------------------------

File name: logger.js
Log line: '8'
Varable name is: foo
Type is:  Object
{name: 'foo', age: 32, active: true}

---------------------- End log ------------------------------
-------------------------------------------------------------

```

### isDevelopMode = false

```
Sorry we are in production mode..
```


### VSCode snippet

```
"console log advanced": {
  "prefix": "message",
  "body": [
    "logger.message({ name: '${1:var}', value: ${1:var}, path: '$TM_FILENAME' , line: '$TM_LINE_NUMBER' })"
  ],
  "description": "console log advanced"
}
```

### License

MIT
