jsx.require (['sizzle.sizzle'], function(){
  jsx.Events = {
    observe: function(element, type, handler){
      if (element.addEventListener) {
        element.addEventListener(type, handler, false);
      } else if (element.attachEvent) {
        element.attachEvent("on" + type, handler);
      }
    },
    stopObserving: function (element, type, handler){
      if (element.removeEventListener) {
        element.removeEventListener(type, handler, false);
      } else if (element.detachEvent) {
        element.detachEvent("on" + type, handler);
      }
    }
  };
  jsx.Events.element = function(event){
    return  event.srcElement || event.target;
  };
  jsx.Events.isLeftClick = function(event){
    return jsx.Events.fix(event).which == 1;
  };
  jsx.Events.pageX = function(event){
    return jsx.Events.fix(event).pageX;
  };
  jsx.Events.pageY = function(event){
    return jsx.Events.fix(event).pageY;
  };
  jsx.Events.fix = function(event){
    if (!event.which && event.button) {
      event.which = (event.button & 1 ? 1 : (event.button & 2 ? 3 : (event.button & 4 ? 2 : 0)));
    }

    if ( event.pageX == null && event.clientX !== null ) {
      
      var doc = document.documentElement, body = document.body;
      event.pageX = event.clientX + (doc && doc.scrollLeft || body && body.scrollLeft || 0) - (doc.clientLeft || 0);
      event.pageY = event.clientY + (doc && doc.scrollTop || body && body.scrollTop || 0) - (doc.clientTop || 0);
    }
    return event;
  };
  jsx.loaded('sizzle.Events');
});