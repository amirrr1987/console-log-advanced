# console-log-advanced

console-log-advanced is an npm package that enhances logging functionality for developers, providing detailed information for efficient debugging in the browser or Node.js console.

Some of the benefits of using this package are:

*   Displaying more detailed information about variables on the console
*   Showing the file path and line number on the console
*   Providing additional details about the variables on the console
*   Creating comprehensive comments for debugging your code

console-log-advanced improves code quality and debugging efficiency by enabling detailed console logging, reducing the need for console.log statements, and facilitating quick error detection and fixing.

## Install

Install via **npm**

```javascript

npm i console-log-advanced

```

Install via **pnpm**

```javascript

pnpm i console-log-advanced

```

Install via **yarn**

```javascript

yarn add console-log-advanced

```

## Usage

```javascript

import ConsoleLogAdvanced from  "console-log-advanced"

const clg = new ConsoleLogAdvanced({ isDevelopMode: true })

const foo = { name:'foo', age:32, isEdit:true }

clg.logger({ name:'foo', value: foo , path:'logger.js', line:8, commit:'This is developer commit', isActive: true })

```

### isDevelopMode = true & isActive = true

```javascript

--------------------- Start log ------------------------------
File: logger.js
Line: '8'
Variable is: foo
Type is: Object
Value is:
{name: 'foo', age: 32, active: true}
Commit: This is developer commit
---------------------- End log ------------------------------

```

### isDevelopMode = true & isActive = false

```plaintext
Logger is deactivate in file logger.js on line 8
```

### isDevelopMode = false

```plaintext
Sorry we are in production mode..
```

### VSCode snippet

```plaintext
"Console Log Advanced": {
    "prefix": "clg",
     "body": [
          "clg.logger({ name: \"${1:Variable}\", value: ${1:Variable}, path: '$TM_FILENAME', line: '$TM_LINE_NUMBER', commit: \"${2:comment}\", isActive: false })"
     ],
     "description": "Console Log Advanced"
}
```

### Webstrom snippet

```javascript
logger.message({ name: '$Variable$', value: $Variable$, path: '$FileName$', line: '$LineNumber$',commit: '$Commit',isActive: $isActive})
```

### License

MIT