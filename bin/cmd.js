// #!/usr/bin/env node
var fs = require('fs');
var me = require('../');
var argv = require('yargs').argv,
    clc = require('cli-color');

var outPath = undefined;
if(argv.o || argv.out) outPath = argv.o || argv.out;

if(argv._.length!==0){
  var inp = argv._[0];
  var out = (outPath===undefined)? process.stdout : fs.createWriteStream(outPath);
  me(inp,{encoding:'utf8'})
    .pipe(out);
}else{
  console.log(clc.red('[Error]: No Input File'));
  process.exit(1);
}
