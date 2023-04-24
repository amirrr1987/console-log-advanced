# console-log-advanced

The console-log-advanced is an npm package designed to provide developers with more detailed and advanced logging functionality in the browser console or Node.js console. By logging more specific information into the console, you can improve your code and debug more efficiently.

Some of the benefits of using this package are:

*   Displaying more detailed information about variables on the console
*   Showing the file path and line number on the console
*   Providing additional details about the variables on the console
*   Creating comprehensive comments for debugging your code

In your projects, you can use these benefits to improve your code during the development phase. By logging more information into the console, you can quickly find and fix errors and bugs. Additionally, by providing more information on the console, you can write cleaner code and avoid using console.log statements for debugging.

## Install

Install via **npm**

```javascript

npm i console-log-advanced

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

clg.logger({ name:'foo', value: foo , path:'logger.js', line:8, commit:'This is developer commit' })

```

### isDevelopMode = true & isActive = true

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

### isDevelopMode = true & isActive = false

```javascript

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

logger.message({ name: '$Variable$', value: $Variable$, path: '$FileName$', line: '$LineNumber$'})

```

### License

MIT