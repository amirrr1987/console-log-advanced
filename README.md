
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

import Logger from  "console-log-advanced"

const logger =  new  Logger({isDevelopMode:  true})

const foo = {name:  'foo',age:  32, isEdit:  true}

logger.message({name:  'foo', value: foo , path:  '/src/logger.js', line:  300, comment:  ' This is developer comment' })

```

### isDevelopMode = true & deactivate = false

```javascript

--------------------- Start log ------------------------------
File name: logger.js
Log line: '8'
Varable name is: foo
Type is: Object
{name: 'foo', age: 32, active: true}
Comment: This is developer comment
---------------------- End log ------------------------------

```

### isDevelopMode = true  &  deactivate = true

```javascript

import Logger from  "console-log-advanced"
const logger =  new  Logger({isDevelopMode:  true})
const _init = {name:  'foo',age:  32, isEdit:  true}
logger.message({name:  '_init', value: _init , path:  '/src/logger.js', line:  300, comment:  ' This is developer comment', deactivate:  true })
console.log(`Logger is deactivate, You can active log => deactivate: false`)

```

### isDevelopMode = false

``` 
Sorry we are in production mode..
```

### VSCode snippet

``` json

"console log advanced": {
	"prefix": "message",
	"body": [
		"logger.message({ name: '${1:var}', value: ${1:var}, path: '$TM_FILENAME' , line: '$TM_LINE_NUMBER' })"
	],
	"description": "console log advanced"
}

```

### Webstrom snippet

``` javascript

logger.message({ name: '$Variable$', value: $Variable$, path: '$FileName$', line: '$LineNumber$'})

```

### License

MIT