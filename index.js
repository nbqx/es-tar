var fs = require('fs'),
    path = require('path');

var _reduce = require('lodash.reduce'),
    falafel = require('falafel'),
    through2 = require('through2'),
    byline = require('byline');

var _commentOut = function(line){
  if(/^#target/.test(line)){
    line = line.replace(/^#target/,"//#target");
  }
  if(/^#include/.test(line)){
    line = line.replace(/^#include/,"//#include");
  }
  return line;
};

var commentOut = through2(function(chunk,enc,next){
  var line = _commentOut(chunk+'');
  this.push(line+"\n");
  next();
});

var _converter = function(code,basePath){
  var baseDir = path.dirname(path.resolve(basePath));
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
      var inc = /^\/\/#include ["'](.*?)["']$/gi;
      if(source.match(inc)){
        var m = inc.exec(source);
        var p = require('path').resolve(baseDir,m[1]);
        if(fs.existsSync(p)){
          var src = fs.readFileSync(p);
          node.update(src);
        }
      }
    }
  });

  return out;
};

var converter = function(basePath){
  var ret = [];
  
  return through2(
    function(c,e,n){ 
      ret.push(c+'');n();
    },
    function(n){
      var code = ret.join('');
      var out = _converter(code,basePath);
      this.push(out.toString());
      n();
    });
};

function estar(path,opts){
  var stream = fs.createReadStream(path,opts);
  return byline(stream).pipe(commentOut).pipe(converter(path));
};

estar.sync = function(path,opts){
  var cont = fs.readFileSync(path)+'';
  cont = cont.split(/\r\n|\r|\n/g);
  var ret = _reduce(cont,function(m,i){
    var line = _commentOut(i);
    m += (line==='')? line : line+"\n"
    return m
  },'');

  ret = _converter(ret,path);

  return ret.toString();
};

module.exports = estar;
