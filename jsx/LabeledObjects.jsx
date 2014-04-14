LabeledObjects = this.LabeledObjects || {};

LabeledObjects._find = function(obj){
  var lname = obj.label || obj.name || "NOT_LABELED";
  var otype = obj.toString();
  return {
    name: lname,
    type: otype
  }
};

// TODO: same label-name
LabeledObjects.findAllWithType = function(){
  var args = Array.prototype.slice.call(arguments);

  if(args.length===1){
    var obj = args[0];
    return LabeledObjects.findAllWithType(obj,{});
  }else{
    var obj = args[0];
    var ret = args[1];
    var children = obj.allPageItems;
    var o = LabeledObjects._find(obj);

    ret[o.name] = {};
    ret[o.name]["type"] = o.type;

    if(children.length!==0){
      if(!ret[o.name].hasOwnProperty("children")) ret[o.name]["children"] = {};
      for(var i=0; i<children.length; i++){
        var c = children[i];
        LabeledObjects.findAllWithType(c,ret[o.name]["children"]);
      }
    }
    return ret
  }
};

LabeledObjects.findAll = function(obj){
  var ret = [];
  var objs = LabeledObjects.findAllWithType(obj);
  function recur(o,r){
    var keys = (function(_o){
      for(var k in _o){
        r.push(k);
      }

      if(_o[k].hasOwnProperty("children")){
        var _r = recur(_o[k]["children"],[]);
        r.push(_r);
      }

      return r
    })(o);

    return keys
  }
  return recur(objs,[]);
};

