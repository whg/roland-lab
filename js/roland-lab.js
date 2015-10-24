var editor = null;



$(document).ready(function() {

    editor = CodeMirror.fromTextArea(document.getElementById("code"), {
        lineNumbers: true,
        mode: "javascript",
        //theme: "material",
        autoCloseBrackets: true,
//        viewportMargin: Infinity,
    });

    editor.setOption("extraKeys", {
        'Cmd-E': function(cm) {
            evaluate(cm);
            return false;
        }
    })
    console.log('done');


    $("canvas").attr("width", $("canvas").width())
    $("canvas").attr("height", $("canvas").height())
    
    paper.install(window);
    paper.setup(document.getElementById("canvas"));
    // var path = new Path();
	// path.strokeColor = 'black';
	// var start = new Point(100, 100);
	// path.moveTo(start);
	// path.lineTo(start.add([ 200, -50 ]));
	// view.draw();
    setTimeout(function() { editor.refresh(); }, 100);

    // var canvas = document.getElementById("canvas");
    // var ctx = canvas.getContext('2d');
    //ctx.scale(0.5, 0.5);
    
    var hpgl_lib = null;
    $.get('js/hpgl.js', function(data) {
        hpgl_lib = data;
    });
    
    function evaluate(cm) {
        if (!hpgl_lib) return false;
        var hpgl_code = eval(hpgl_lib + cm.getValue() + 'endPathIfNeeded(); view.draw(); output;');
//        draw(hpgl_code);
        console.log(hpgl_code);
    }

    
    function draw(hpgl) {
        
        while(true) {
            var match = hpgl.match(/([A-Z]+)([0-9]+)(?:,([0-9]+))?;/);

            if (!match) {
                break;
            }
            switch (match[1]) {
                case 'SP':
                
                break;
                case 'PD':
                break;
                case 'PU':
                break;
            }
            console.log(match[1]);
            hpgl = hpgl.substr(match[0].length);
        }
    }

    
});
