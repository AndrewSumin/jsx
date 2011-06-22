jsx.require([jsx.base + '.Dom'], function(){
  jsx.Dom.$ = function(id){
    return document.getElementById(id);
  };

  jsx.Dom.doHTMLElement = function (html){
    var fragment = document.createElement('div');
    fragment.innerHTML = html;
    return fragment.firstChild;
  };

  jsx.Dom.isChecked = function(input){
    return input.checked;
  };

  jsx.Dom.isNotChecked = function(input){
    return !input.checked;
  };

  jsx.Dom.isEnable = function(input){
    return !input.disabled;
  };

  jsx.Dom.isDisabled = function(input){
    return input.disabled;
  };


  jsx.Dom.disable = function(input){
    input.disabled = true;
    return input;
  };

  jsx.Dom.enable = function(input){
    input.disabled = false;
    return input;
  };

  jsx.Dom.insertAfter = function(node, target){
    var next = target.nextSibling;
    var parent = target.parentNode;
    if (next){
      parent.insertBefore(node, next);
    }else{
      parent.appendChild(node);
    }
  };

  jsx.Dom.fillSelect = function(select, options) {
    select.innerHTML = '';
    this.appendSelect(select, options);
  };

  jsx.Dom.appendSelect = function(select, options) {
    for ( var indx = 0, l = options.length; indx < l; indx++) {
      select.appendChild(this.createOption(options[indx].value, options[indx].text));
    }
  };

  jsx.Dom.createOption = function(value, text) {
    var option = document.createElement('option');
    option.value = value;
    option.innerHTML = text;
    return option;
  };

  jsx.Dom.getScroll = function(){
    return {
      top: (document.documentElement && document.documentElement.scrollTop) || (document.body && document.body.scrollTop),
      left: (document.documentElement && document.documentElement.scrollLeft) || (document.body && document.body.scrollLeft)
    };
  };

  jsx.Dom.getScrollBox = function(){
    return {
      height: (document.documentElement && document.documentElement.scrollHeight) || (document.body && document.body.scrollHeight),
      width: (document.documentElement && document.documentElement.scrollWidth) || (document.body && document.body.scrollWidth)
    };
  };

  jsx.Dom.hasParentWithClassName = function(element,className) {
    if (!className || !element)
      return false;
    if (element.className && jsx.Dom.hasClassName(element,className)) {
      return element;
    } else {
      if (element.parentNode) {
        return jsx.Dom.hasParentWithClassName(element.parentNode,className);
      } else {
        return false;
      }
    }
  };

  jsx.loaded('Dom');
});
