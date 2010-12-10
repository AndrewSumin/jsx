jsx.Dom = {
  $: function(id){
    return document.getElementById(id);
  },
  doHTMLElement: function (html){
    var fragment = document.createElement('div');
    fragment.innerHTML = html;
    return fragment.firstChild;
  },

  isChecked: function(input){
    return input.checked;
  },

  insertAfter: function(node, target){
    var next = target.nextSibling;
    var parent = target.parentNode;
    if (next){
      parent.insertBefore(node, next);
    }else{
      parent.appendChild(node);
    }
  },

  fillSelect : function(select, options) {
    select.innerHTML = '';
    this.appendSelect(select, options);
  },

  appendSelect : function(select, options) {
    for ( var indx = 0, l = options.length; indx < l; indx++) {
      select.appendChild(this.createOption(options[indx].value, options[indx].text));
    }
  },

  createOption : function(value, text) {
    var option = document.createElement('option');
    option.value = value;
    option.innerHTML = text;
    return option;
  },

  getScroll:function(){
    return {
      top: (document.documentElement && document.documentElement.scrollTop) || (document.body && document.body.scrollTop),
      left: (document.documentElement && document.documentElement.scrollLeft) || (document.body && document.body.scrollLeft)
    };
  },

  getScrollBox:function(){
    return {
      height: (document.documentElement && document.documentElement.scrollHeight) || (document.body && document.body.scrollHeight),
      width: (document.documentElement && document.documentElement.scrollWidth) || (document.body && document.body.scrollWidth)
    };
  },

  redraw: function(element, force) {
    if (!force && !jsx.Vars.msie6 && !jsx.Vars.msie7) {
      return;
    }
    // пиздец
    document.body.style.position = 'absolute';
    document.body.clientHeight;
    if (element) {
      element.style.borderRight = '10px solid white';
    }
    window.setTimeout(function(){
      document.body.style.position = 'static';
      if (element) {
        element.style.borderRight = '0';
      }
    },10);
    // пиздец
  },

  hasParentWithClassName: function(element,className) {
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
  }

};

jsx.require([jsx.base + '.Dom'], jsx.bind(jsx, jsx.loaded, 'Dom'));