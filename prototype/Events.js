jsx.require (['prototype.prototype'], function(){
  jsx.Events = Event;
  jsx.Events.pageX = Event.pointerX;
  jsx.Events.pageY = Event.pointerY;
  
  jsx.loaded('prototype.Events');
});