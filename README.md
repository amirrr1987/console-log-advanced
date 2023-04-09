# advanced-console-log

1. console log is show in block line width start and end

2. Check data type

## Install

Install via **npm**

```javascript
npm i -D console-log-advanced
```

## Usage

```javascript

import  Logger   from "console-log-advanced-log"

const logger = new Logger({isDevelopMode: true})


const foo = {name:  'foo',age:  32, active:  true}

logger.message({name: 'sdfsdf', value: foo})

```

## isDevelopMode === 'true'

```javascript

--------------------------------------------------------------
--------------------- Start log ------------------------------
Type is:  Object
foo {name: 'foo', age: 32, active: true}
log duration is:: 0.3232421875 ms
---------------------- End log ------------------------------
-------------------------------------------------------------

```

## isDevelopMode === false

```javascript

Sorry we are in production mode..

```

## License

MIT
