# console-log-advanced

[![npm version](https://badge.fury.io/js/console-log-advanced.svg)](https://badge.fury.io/js/console-log-advanced)
[![GitHub license](https://img.shields.io/github/license/amirrr1987/console-log-advanced)](https://github.com/amirrr1987/console-log-advanced/blob/master/LICENSE)

## Description

**console-log-advanced** is a JavaScript logging library that provides advanced console logging features. It can be used in front-end frameworks like Vue, React, and Angular.

## Installation

```shell

Install via **npm**

```javascript

npm i console-log-advanced

pnpm i console-log-advanced

yarn add console-log-advanced

```

## Usage

```javascript


import ConsoleLogAdvanced from 'console-log-advanced';

const clg = new ConsoleLogAdvanced({ isDevelop: true });

const foo = { name: "foo", age: 32, isEdit: true };
 clg.logger({
    name: "foo",
    value: foo,
    path: 'src/index.js',
    line: '56',
    comment: `comment`,
    date: '2023-July-12',
    time: '21:17:38',
    isActive: true
})
```

### isDevelopMode = true & isActive = true

```plaintext
--------------------- Start log ------------------------------
Path: logger.js
Line: '56'
Date: '2023-July-12'
Time: '21:17:38'
Type: Object
Name: foo
{name: 'foo', age: 32, active: true}
comment: This is developer comment
---------------------- End log ------------------------------
```
### isDevelopMode = false
```plaintext
Sorry we are in production mode..
```

### VSCode snippet
```json
"logger": {
        "prefix": "-logger",
        "body": [
            " logger({",
            "    name: \"${1:Variable}\",",
            "    value: ${1:Variable},",
            "    path: '$RELATIVE_FILEPATH',",
            "    line: '$TM_LINE_NUMBER',",
            "    date: '${CURRENT_YEAR}-${CURRENT_MONTH_NAME}-${CURRENT_DATE}',",
            "    time: '${CURRENT_HOUR}:${CURRENT_MINUTE}:${CURRENT_SECOND}',",
            "    comment: `${2:comment}`",
            "})"
        ],
        "description": "Logger full"
}
```

### Webstrom snippet

```javascript
clg.logger({
    name: "$1",
    value: $1,
    path: '$RELATIVE_FILEPATH',
    line: '$TM_LINE_NUMBER',
    date: '${CURRENT_YEAR}-${CURRENT_MONTH_NAME}-${CURRENT_DATE}',
    time: '${CURRENT_HOUR}:${CURRENT_MINUTE}:${CURRENT_SECOND}',
    comment: `$2`,
    isActive: $isActive,
})
```

### License

MIT
