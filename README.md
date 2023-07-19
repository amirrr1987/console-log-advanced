
# console-log-advanced

  

[![npm version](https://badge.fury.io/js/console-log-advanced.svg)](https://badge.fury.io/js/console-log-advanced)

[![GitHub license](https://img.shields.io/github/license/amirrr1987/console-log-advanced)](https://github.com/amirrr1987/console-log-advanced/blob/master/LICENSE)

  

## Description

  

**console-log-advanced** is an npm package for JavaScript logging. It enhances console logging in front-end frameworks like Vue, React, and Angular. It provides detailed information in development mode and deactivates logs in production mode for optimized performance.


  

## Installation

You can install **Console Log Advanced** using:

```shell
npm i -S console-log-advanced
pnpm i -S console-log-advanced
yarn add console-log-advanced
```

## Config

Importing the package

```javascript
// in project utils/logger.ts
import ConsoleLogAdvanced from 'console-log-advanced';
const clg= new ConsoleLogAdvanced({ isDevelopMode: true });
export default clg
```

The `isDevelopMode` option determines the activation of the logger in different modes. Set it to `true` to enable logging during development and `false` to disable logging in production. This feature ensures that logs are only active during the development phase for better performance in production environments.
  

## Usage

```javascript
import clg from  '../utils/logger.ts';
const foo = { name:  "foo", age:  32, isEdit:  true };
clg.logger({
	name:  "foo",
	value: foo,
	path:  'src/index.js',
	line:  '56',
	comment:  `This is an optional comment.`,
	date:  '2023-July-12',
	time:  '21:17:38',
	collapsed:  true,
	isActive:  true,
});
```

The `logger()` method has the following parameters:

- `name` (required): The name or title of the log.
- `value` (required): The value or content of the log.
- `path` (optional): The path of the file where the log is being logged.
- `line` (optional): The line number in the file where the log is being logged.
- `comment` (optional): Additional comment or description for the log.
- `date` (optional): The date of the log.
- `time` (optional): The time of the log.
- `collapsed` (optional): Whether to collapse the log group in the console. Default is `true`.
- `isActive` (optional): Whether the log is active or not. Default is `true`.

These parameters allow developers to customize the log output by providing relevant information such as log name, value, file path, line number, comments, date, and time. Additionally, developers can choose to collapse log groups in the console and control the activation status of individual logs.

## Example Output

### isDevelopMode = true 

```javascript
--------------------- Start foo ----------------------------->
Path: logger.js
Line: '56'
Date: '2023-July-12'
Time: '21:17:38'
Type: Object
Name: foo
{name: 'foo', age: 32, active: true}
comment: This is developer comment
```

### isDevelopMode = false
```

Sorry we are in production mode..

```
  
## VSCode Snippet


```json
"logger": {
	"prefix": "-logger",
	"body": [
		" clg.logger({",
			" name: \"${1:Variable}\",",
			" value: ${1:Variable},",
			" path: '$RELATIVE_FILEPATH',",
			" line: '$TM_LINE_NUMBER',",
			" date: '${CURRENT_YEAR}-${CURRENT_MONTH_NAME}-${CURRENT_DATE}',",
			" time: '${CURRENT_HOUR}:${CURRENT_MINUTE}:${CURRENT_SECOND}',",
			" comment: `${2:comment}`",
		"})"
	],
	"description": "Logger full"
}
```

## WebStorm Snippet


```javascript
clg.logger({
	name:  "$VAR",
	value: $VAR,
	path:  '$FILEPATH$',
	line:  '$LINE$',
	date:  '${YEAR}-${MONTH}-${DAY}',
	time:  '${HOUR}:${MINUTE}:${SECOND}',
	comment:  `${COMMENTS}`,
	isActive: $isActive,
})
```

## License

MIT


## License

Console Log Advanced is MIT licensed.
  

## Contribution

Contributions are welcome! If you find any issues or want to contribute to the project, please create a pull request or submit an issue on the GitHub repository.

  
## Credits

Console Log Advanced is developed and maintained by Amir Maghami.


## Support

If you need any assistance or have any questions, please contact maghami.a1987@gmail.com.

Happy logging!




  


