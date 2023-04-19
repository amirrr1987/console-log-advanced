
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

import ConsoleLogAdvanced from  "console-log-advanced"

const clg =  new  ConsoleLogAdvanced({isDevelopMode:  true})

const foo = {name:  'foo',age:  32, isEdit:  true}

clg.logger({name:  'foo', value: foo , path:'logger.js', line:  8, commit: 'This is developer commit' })

```

### isDevelopMode = true & deactivate = false

```javascript

--------------------- Start log ------------------------------
File: logger.js
Line: '8'
Variable is: foo
Type is: Object
{name: 'foo', age: 32, active: true}
Commit: This is developer commit
---------------------- End log ------------------------------

```

### isDevelopMode = true  &  deactivate = true

```javascript

import ConsoleLogAdvanced from  "console-log-advanced"
const clg =  new  ConsoleLogAdvanced({isDevelopMode:  true})
const _init = {name:  'foo',age:  32, isEdit:  true}
clg.logger({name:  '_init', value: _init , path:'logger.js', line:  8, commit: 'This is developer commit' })
console.log(`Logger is deactivate`)

```

### isDevelopMode = false

``` 
Sorry we are in production mode..
```

### VSCode snippet

``` json

"Console Log Advanced": {
		"prefix": "clg",
		"body": [
			"clg.logger({ name: \"${1:Variable}\", value: ${1:Variable}, path: '$TM_FILENAME', line: '$TM_LINE_NUMBER', commit: \"${2:comment}\", deactivate: false })"
		],
		"description": "Console Log Advanced"
}

```

### Webstrom snippet

``` javascript

logger.message({ name: '$Variable$', value: $Variable$, path: '$FileName$', line: '$LineNumber$'})

```

### License

MIT