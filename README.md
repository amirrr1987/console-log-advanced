# advanced-console-log



A console log is show in block line width start and end, you see:

  

  

1. data file URL and name

  

2. Check data type

  

3. Check type if data is array

  

4. show data width `console.dir` method

  

  

## Install

  

Install via **npm**

  

``` javascript
npm i -D advanced-console-log
```

  

  

## Usage

  

  

``` javascript

const { isDevelopMode, logger } =  require("advanced-console-log.js");

isDevelopMode("develop");

const foo = [{name:  'foo',age:  32, active:  true}]

logger(foo)

```

  

## isDevMode === true

  

``` javascript

--------------------- Start log ------------------------------
 
- Type is:  object
- Is this an Array? Yes
- Array Length:  1
- foo return: 
[ { name: 'foo', age: 32, active: true } ]
 
---------------------  End log  ------------------------------

```

  
  ## isDevMode === false

  

``` javascript

Sorry we are in production mode..

```
  

## License

  

MIT

  

  
