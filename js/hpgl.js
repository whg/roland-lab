var output = "";

var currentPath = new Path();
project.activeLayer.clear();

// edited from:
// http://stackoverflow.com/questions/610406/javascript-equivalent-to-printf-string-format
if (!String.prototype.format) {
  String.prototype.format = function(args) {
    return this.replace(/{(\d+)}/g, function(match, number) { 
      return typeof args[number] != 'undefined'
        ? args[number]
        : match
      ;
    });
  };
}

function beginPathIfNeeded() {
    if (!currentPath) {
        currentPath = new Path();
        console.log('created new path');
    }

}

function endPathIfNeeded() {
    if (currentPath && currentPath.segments.length > 0) {
        console.log(currentPath.segments);
        console.log(currentPath);
        project.activeLayer.addChild(currentPath);
        currentPath.strokeColor = "black";
        currentPath = null;
        console.log('ended');
    }
}

function pu(x, y) {
    output+= 'PU{0},{1};'.format(arguments);

    endPathIfNeeded();
//    beginPathIfNeeded();
    
//    currentPath.moveTo(new Point(x, y));
}

function pd(x, y) {
    output+= 'PD{0},{1};'.format(arguments);

    beginPathIfNeeded();
    currentPath.lineTo(new Point(x, y));
}

function sp(n) {
    output+= 'SP{0};'.format(arguments);
}

// Processing-like functions

var matrixStack = [];
var currentMatrix = null;

function pushMatrix() {
    matrixStack.push(new Matrix());
    currentMatrix = matrixStack[matrixStack.length-1];
}
pushMatrix();

function translate(x, y) {
    currentMatrix = currentMatrix.translate(x, y);
}

function rotate(a) {
    currentMatrix = currentMatrix.rotate(a, 0, 0);
}

function scale(x, y) {
    if (y === undefined) y = x;
    currentMatrix = currentMatrix.scale(x, y);
}

function line(x1, y1, x2, y2) {

    var p1 = currentMatrix.transform(new Point(x1, y1));
    var p2 = currentMatrix.transform(new Point(x2, y2));
    
    pu(p1.x, p1.y);
    pd(p1.x, p1.y);
    pd(p2.x, p2.y);
    pu(p2.x, p2.y);
}

function rect(x, y, w, h) {

    if (w === undefined && h === undefined) {
        w = x;
        h = y;
        x = 0;
        y = 0;
    }
    
    var p1 = currentMatrix.transform(new Point(x, y));
    var p2 = currentMatrix.transform(new Point(x+w, y));
    var p3 = currentMatrix.transform(new Point(x+w, y+h));
    var p4 = currentMatrix.transform(new Point(x, y+h));
    
    pu(p1.x, p1.y);
    pd(p1.x, p1.y);
    pd(p2.x, p2.y);
    pd(p3.x, p3.y);
    pd(p4.x, p4.y);
    pd(p1.x, p1.y);
    pu(p1.x, p1.y);
}

function square(x, y, w) {

    if (y === undefined && w === undefined) {
        w = x;
        x = 0;
        y = 0;
    }
    
    rect(x, y, w, w);
}

var shapeVertices = null;

function beginShape() {
    shapeVertices = [];
}

function endShape() {
    if (shapeVertices.length < 1) {
        return;
    }
    
    var start = currentMatrix.transform(shapeVertices[0]);
    pu(start.x, start.y);

    shapeVertices.forEach(function(p) {
        var pt = currentMatrix.transform(p);
        pd(pt.x, pt.y);
    });

    shapeVertices = [];
}

function vertex(x, y) {
    shapeVertices.push(new Point(x, y));
}
