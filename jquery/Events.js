jsx.require (['jquery.jquery'], function(){
  jsx.Events = {};
  jsx.Events.observe = jsx.bind(jQuery.event, jQuery.event.add);
  jsx.Events.stopObserving = jsx.bind(jQuery.event, jQuery.event.remove);
  jsx.Events.element = function(event){
    return  event.srcElement || event.target;
  };
  jsx.Events.isLeftClick = function(event){
    return jQuery.event.fix(event).which == 1;
  };
  jsx.Events.pageX = function(event){
    return jQuery.event.fix(event).pageX;
  };
  jsx.Events.pageY = function(event){
    return jQuery.event.fix(event).pageY;
  };
  jsx.loaded('jquery.Events');
});