var fs = require('fs');
var estar = require('.');

var jsxPath = __dirname+'/jsx/test.jsx';
var out = __dirname+'/build.jsx';

// stream
estar(jsxPath,{encoding:'utf8'})
  .pipe(fs.createWriteStream(out));

// sync
console.log(estar.sync(jsxPath,{encoding:'utf8'}));
