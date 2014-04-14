#target InDesign-7.0
#include "./LabeledObjects.jsx"
#include "./jsonizer-min.jsx"

var log = $.writeln;
var obj = app.activeDocument.selection[0];
log(JSON.stringify(LabeledObjects.findAllWithType(obj)));
log(JSON.stringify(LabeledObjects.findAll(obj)));
