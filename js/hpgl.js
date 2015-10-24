var output = "";

var currentPath = null;

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
    console.log('begin' + currentPath);
    if (!currentPath) {
        currentPath = new Path();
    }

}

function endPathIfNeeded() {
    if (currentPath) {
        currentPath.strokeColor = "black";
        currentPath = null;
        console.log('ended');
    }
    else {
        currentPath = new Path();
    }
    console.log('efe' + currentPath);
}

function pu(x, y) {
    output+= 'PU{0},{1};'.format(arguments);

    endPathIfNeeded();
    
    currentPath.moveTo(new Point(x, y));
}

function pd(x, y) {
    output+= 'PD{0},{1};'.format(arguments);

    
    beginPathIfNeeded();
    currentPath.lineTo(new Point(x, y));
}

function sp(n) {
    output+= 'SP{0};'.format(arguments);
}
