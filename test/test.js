var should = require('should'),
    fs = require('fs');

var estar = require('../');

describe('es-tar',function(){
  var mainJsxPath = __dirname+'/fixtures/a.jsx';
  var est = estar(mainJsxPath,{encoding:'utf8'});
  var outPath = __dirname+'/out.jsx';
  var out = fs.createWriteStream(outPath);

  it('should be transform stream',function(done){
    est.should.have.property('_transformState');
    done();
  });

  it('should be same content',function(done){
    est.pipe(out);
    est.on('end',function(){
      var res = fs.readFileSync(outPath)+'';
      res.should.be.equal(fs.readFileSync(__dirname+'/result.txt')+'');
      done();
    });
  });

  it('should be same content in `estar.sync`',function(done){
    var out = estar.sync(mainJsxPath,{encoding:'utf8'});
    var res = fs.readFileSync(__dirname+'/result.txt')+'';
    out.should.be.equal(res);
    done();
  });

  after(function(done){
    fs.unlink(outPath,function(){
      done();
    });
  });
});
