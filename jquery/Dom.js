jsx.require (['jquery.jquery'], function(){
  jsx.Dom.hasClassName = function(element, className){
    if (!element || !element.nodeType){
      return;
    }
    return $(element).hasClass(className);
  };
  jsx.Dom.removeClassName = function(element, className){
    if (!element || !element.nodeType){
      return;
    }
    return $(element).removeClass(className);
  };
  jsx.Dom.addClassName = function(element, className){
    if (!element || !element.nodeType){
      return;
    }
    return $(element).addClass(className);
  };
  jsx.Dom.switchClassName = function(element, classOne, classTwo){
    if (jsx.Dom.hasClassName(element, classOne)){
      jsx.Dom.removeClassName(element, classOne);
      jsx.Dom.addClassName(element, classTwo);
    }else if(jsx.Dom.hasClassName(element, classTwo)){
      jsx.Dom.removeClassName(element, classTwo);
      jsx.Dom.addClassName(element, classOne);
    }
  };
  jsx.Dom.toggleClassName = function(element, className){
    if(jsx.Dom.hasClassName(element, className)){
      jsx.Dom.removeClassName(element, className);
    }else{
      jsx.Dom.addClassName(element, className);
    }
  };
  jsx.Dom.getElementsBySelector = function(context, selector){
    return jsx.toArray(jQuery(selector, context));
  };
  jsx.Dom.getElementBySelector = function(context, selector){
    return jsx.Dom.getElementsBySelector(context, selector)[0];
  };
  jsx.Dom.$$ = jsx.Dom.getElementBySelector;
  jsx.Dom.offset = function (element){
    var valueT = 0, valueL = 0;
    do {
      valueT += element.offsetTop  || 0;
      valueL += element.offsetLeft || 0;
      element = element.offsetParent;
    } while (element);
    return {left: valueL, top: valueT};
    //return jQuery(element).offset();
  };
  jsx.Dom.descendantOf = function(element, ancestor){
    var originalAncestor = ancestor;
  
    if (element.compareDocumentPosition)
      return (element.compareDocumentPosition(ancestor) & 8) === 8;
  
    if (element.sourceIndex && !jsx.Vars.Opera) {
      var e = element.sourceIndex, a = ancestor.sourceIndex,
       nextAncestor = ancestor.nextSibling;
      if (!nextAncestor) {
        do { ancestor = ancestor.parentNode; }
        while (!(nextAncestor = ancestor.nextSibling) && ancestor.parentNode);
      }
      if (nextAncestor && nextAncestor.sourceIndex)
       return (e > a && e < nextAncestor.sourceIndex);
    }
  
    while ((element = element.parentNode))
      if (element == originalAncestor) return true;
    return false;
  };
  jsx.loaded('jquery.Dom');
});