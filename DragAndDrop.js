jsx.DragAndDrop = {};

jsx.DragAndDrop.MouseMove = function (element, offset) {
    var leftStart = null, topStart = null, moving = false, startEvent = null;
    offset = offset || 3;
    function startMove (e) {
        if (!jsx.Events.isLeftClick(e)) {
            return;
        }
        jsx.Events.stop(e);
      
        leftStart = jsx.Events.pageX(e);
        topStart = jsx.Events.pageY(e);

        Dstop.start();
        Dmove.start();
        SelectStart.start();
        DragStart.start();
       
        startEvent = e;
        jsx.CallBacks.dispatch('start', this, startEvent);
    }
    function move(e) {
        if (!moving && (Math.abs(leftStart - jsx.Events.pageX(e)) > offset || Math.abs(topStart - jsx.Events.pageY(e)) > offset)){
            moving = true;
            jsx.CallBacks.dispatch('startDrag', this, e);
        }
        if (!jsx.Events.isLeftClick(e)){
            stopMove();
        }
        jsx.CallBacks.dispatch('move', this, e);
    }
    function stop(){
        Dmove.stop();
        Dstop.stop();
        SelectStart.stop();
        DragStart.stop();

        leftStart = topStart = null;
    }
    function stopMove (e) {
        stop();
        if (moving){
          moving = false;          
          jsx.CallBacks.dispatch('stop', this, e);
        }else{
          jsx.CallBacks.dispatch('cancelDrag', this, e);
        }
    }
    function stopEvent(e){
        jsx.Events.stop(e);
    }

    var Dstart = jsx.Events.observe(element, 'mousedown', jsx.bind(this, startMove), false, true);
    var Dmove = jsx.Events.observe(document, 'mousemove', jsx.bind(this, move), false, false);
    var Dstop = jsx.Events.observe(document, 'mouseup', jsx.bind(this, stopMove), false, false);
    var SelectStart = jsx.Events.observe(document, 'selectstart', stopEvent, false, false);
    var DragStart = jsx.Events.observe(element, 'dragstart ', stopEvent, false, false);

    this.start = function(){
        Dstart.start();
    };

    this.stop = function(){
        Dstart.stop();
    };
    
    this.cancel = function(){
    	stop();
    };
};

jsx.require(['Events', 'CallBacks'], jsx.bind(jsx, jsx.loaded, 'DragAndDrop'));
