jsx.require (['prototype.prototype'], function(){
  jsx.Dom.hasClassName = Element.Methods.hasClassName;
  jsx.Dom.removeClassName = Element.Methods.removeClassName;
  jsx.Dom.addClassName = Element.Methods.addClassName;
  jsx.Dom.switchClassName = Element.Methods.switchClassName;
  jsx.Dom.toggleClassName = Element.Methods.toggleClassName;
  jsx.Dom.descendantOf = Element.Methods.descendantOf;
  jsx.Dom.remove = Element.Methods.remove;
  
  jsx.Dom.getElementsBySelector = function(context, selector){
    return Element.Methods.getElementsBySelector(context, selector.replace(/input\[checked=true]/ig, 'input:checked'));
  }
  jsx.Dom.getElementBySelector = function(context, selector){
    return jsx.Dom.getElementsBySelector(context, selector)[0];
  };
  jsx.Dom.$$ = jsx.Dom.getElementBySelector;
  jsx.Dom.offset = function(element){
    var offset = Position.cumulativeOffset(element);
    return {left: offset[0], top: offset[1]};
  };
  jsx.loaded('prototype.Dom');
});