jsxComponents.Editor.Frame = function(){
  this.create();
};
jsxComponents.Editor.Frame.prototype = new function(){
  this.allowTags = '|body|strong|b|em|i|ul|ol|li|p|br|div|';
  this.ignoreTags = '|style|script|meta|link|';
  this.create = function(){
    this.element = document.createElement('iframe');
    this.element.frameBorder = 'no';
    this.element.scrolling = 'auto';
  };
  this.getElement = function(){
    return this.element;
  };
  this.init = function(value){
    var html = '' +
    '<!DOCTYPE html PUBLIC "-//W3C//DTD XHTML 1.1//EN" "http://www.w3.org/TR/xhtml11/DTD/xhtml11.dtd">' +
    '<html>\n' +
    '  <head>\n' +
    '    <style>\n' +
    '      * {\n' +
    '        margin: 0;\n' +
    '        padding: 0;\n' +
    '      }' +
    '      li {\n' +
    '        margin-left: 2em;\n' +
    '      }' +
    '      body {\n' +
    '        margin: 0;\n' +
    '        padding: 3px;\n' +
    '        box-sizing: border-box;\n' +
    '        background: #fff;\n' +
    '        cursor: text;\n' +
    '        font-family: Arial;\n' +
    '        font-size: .8em;\n' +
    '      }\n' +
    '    </style>\n' +
    '  </head>\n' +
    '  <body>\n' +
    this.convertValue(value.replace(/&lt;/g, '<').replace(/&gt;/g, '>')) +
    '  </body>\n' +
    '</html>';
    
    this.document = this.element.contentWindow.document;
    this.document.open();
    this.document.write(html);
    this.document.close();
    this.document.designMode = 'On';
    
    try {
      // Переключаю firefox в режим рендеринга тегами а не стилями
      this.document.execCommand('useCSS', false, true);
    }catch(e){}
    
    
    window.setTimeout(jsx.bind(this, this.clearCode), 500);
    jsx.Dom.addClassName(this.element, 'jsxComponents-Editor-Frame');
  };
  
  this.execCom = function(command, userInterface, value){
    userInterface = userInterface || false;
    value = value || null;
    try {
      this.element.contentWindow.focus();
      this.document.execCommand(command, userInterface, value);
      this.element.contentWindow.focus();
    } 
    catch (e) {
      jsx.Console.log(e, ['Editor']);
    }
  };
  
  this.clearCode = function(){
    if (this.timer){
      window.clearTimeout(this.timer);
    }
    if (this.html == this.document.body.innerHTML){
      this.timer = window.setTimeout(jsx.bind(this, this.clearCode), 500);
      return;
    }
    
    this.clearNode(this.document.body);
    
    this.html = this.document.body.innerHTML;
    this.timer = window.setTimeout(jsx.bind(this, this.clearCode), 500);
    jsx.CallBacks.dispatch('jsxComponents-Editor-ChangeHTML', this,
      this.html
        .replace(/<b>/ig, '<strong>')
        .replace(/<\/b>/ig, '</strong>')
        .replace(/<i>/ig, '<em>')
        .replace(/<\/i>/ig, '</em>')
        .replace(/<br>/ig, '<br/>')
        .replace(/^\n+/ig, '')
    );
  };
  
  this.clearNode = function(node){
    if (node.nodeType == 3) {
      return;
    }
    if (node.nodeType != 1){
      node.parentNode.removeChild(node);
      return;
    }
    var name = '|' + node.nodeName.toLowerCase() + '|';
    if (this.ignoreTags.indexOf(name) >= 0) {
      node.parentNode.removeChild(node);
      return;
    }
    if (this.allowTags.indexOf(name) == -1) {
      node.parentNode.replaceChild(this.document.createTextNode(this.getText(node)), node);
      return;
    }
    
    jsx.toArray(node.attributes).forEach(jsx.bind(this, this.clearAttributes, node));
    jsx.toArray(node.childNodes).forEach(jsx.bind(this, this.clearNode));
    
    return node;
  };
  
  this.clearAttributes = function(node, attribute){
    node.removeAttribute(attribute.nodeName);
  };
  
  this.getText = function(node){
    if (node.nodeType == 3) {
      return node.nodeVaue || node.data || '';
    }
    return jsx.toArray(node.childNodes || []).map(jsx.bind(this, this.getText)).join('');
  };
  this.hide = function(){
    window.clearTimeout(this.timer);
    this.element.style.display = 'none';
  };
  this.show = function(){
    this.element.style.display = 'block';
    this.clearCode();
    try {
      // Переключаю firefox в режим рендеринга тегами а не стилями.
      // После скрытия дива свойство сбрасывается!
      this.document.execCommand('useCSS', false, true);
    }catch(e){}
  };
  this.setValue = function(value){
    this.document.body.innerHTML = this.convertValue(value);
  };
  this.convertValue = function(value){
    if (jsx.Vars.msie) {
      return value;
    }
    return value
      .replace(/<strong>/ig, '<b>')
      .replace(/<\/strong>/ig, '</b>')
      .replace(/<em>/ig, '<i>')
      .replace(/<\/em>/ig, '</i>');
  };
};
jsx.loaded('{jsxComponents}.Editor.Frame');

