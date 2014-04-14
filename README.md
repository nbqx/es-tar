## es-tar

include `#include` extend-script file to standalone executable extend-script

## usage

```js
// $ npm install es-tar
var fs = require('fs');
var estar = require('es-tar');

var jsxPath = __dirname+'/jsx/test.jsx';
var out = __dirname+'/build.jsx';

estar(jsxPath,{encoding:'utf8'})
  .pipe(fs.createWriteStream(out));
```

or

    $ npm install -g es-tar
    $ es-tar jsx/test.jsx // => stdout
    $ es-tar jsx/test.jsx -o build.jsx

or with [fakestk](https://www.npmjs.org/package/fakestk)

    $ es-tar jsx/test.jsx | fakestk

