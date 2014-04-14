var fs = require('fs'),
    path = require('path');
var falafel = require('falafel'),
    through2 = require('through2'),
    byline = require('byline');

var commentOut = through2(function(chunk,enc,next){
  var line = chunk+'';
  if(/^#target/.test(line)){
    line = line.replace(/^#target/,"//#target");
  }
  if(/^#include/.test(line)){
    line = line.replace(/^#include/,"//#include");
  }
  this.push(line+"\n");
  next();
});

var converter = function(basePath){
  var ret = [];
  var baseDir = path.dirname(path.resolve(basePath));
  
  return through2(
    function(c,e,n){ 
      ret.push(c+'');n();
    },
    function(n){
      var code = ret.join('');
      var out = falafel(code,{comment:true},function(node){

        // #target, #include
        if(node.type==='Line'){
          var source = node.source();

          // #target
          var tgt = /^\/\/#target.*$/gi;
          if(source.match(tgt)){
            node.update(source.replace(/\/\/#target/,"#target"));
          }

          // #include
          var inc = /^\/\/#include "(.*?)"$/gi;
          if(source.match(inc)){
            var m = inc.exec(source);
            var p = baseDir+'/'+m[1];
            if(fs.existsSync(p)){
              var src = fs.readFileSync(p);
              node.update(src);
            }
          }
        }
      });
      this.push(out.toString());
      n();
    });
};

module.exports = function(path,opts){
  var stream = fs.createReadStream(path,opts);
  return byline(stream).pipe(commentOut).pipe(converter(path));
};
