var fs = require('fs');
var estar = require('.');

var jsxPath = __dirname+'/jsx/test.jsx';
var out = __dirname+'/build.jsx';

estar(jsxPath,{encoding:'utf8'})
  .pipe(fs.createWriteStream(out));
