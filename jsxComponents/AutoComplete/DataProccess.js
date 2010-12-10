jsxComponents.AutoComplete.DataProccess = function(){
  
};
jsxComponents.AutoComplete.DataProccess.prototype = new function(){
  this.match = function(string, substr, type){
    return string.match(this.getRegExp(substr, type));
  };
  this.getRegExp = function(substr, type){
    substr = jsx.Strings.trim(substr);
    switch (type){
      case 'full':
        return new RegExp('<[^>]*>' + jsx.Strings.escapeRegexp(substr) + '</[^>]*>', 'ig');
      case 'value':
       return new RegExp('<[^v]*v="'+ jsx.Strings.escapeRegexp(substr) +'"[^>]*>[^<]*</[^>]*>', 'i');
      case 'parent':
        return new RegExp('<[^p]*p="'+ jsx.Strings.escapeRegexp(substr) +'"[^>]*>[^<]*</[^>]*>', 'ig');
      case 'gettext':
        return new RegExp('<[^>]*>([^<]*)</[^>]*>', 'i');
      case 'getvalue':
        return new RegExp('<[^v]*v="([^"]*)[^>]*>[^<]*</[^>]*>', 'i');
      case 'getstyle':
        return new RegExp('<[^s]*s="([^"]*)[^>]*>[^<]*</[^>]*>', 'i');
      case 'getparent':
        return new RegExp('<[^p]*p="([^"]*)[^>]*>[^<]*</[^>]*>', 'i');
      case 'node':
        return new RegExp('<[^v]*v="([^"]*)[^p]*p="([^"]*)[^>]*>([^<]*)</[^>]*>', 'i');
      case 'split':
        return new RegExp('<[^>]*>[^<]*</[^>]*>', 'ig');
      default :
        return new RegExp('<[^>]*>' + jsx.Strings.escapeRegexp(substr) + '[^<]*</[^>]*>', 'ig');
    }
    return new RegExp('', '');
  };
  this.getText = function(string){
    return string.match(this.getRegExp('', 'gettext'))[1];
  };
  this.getValue = function(string){
    var valueList = string.match(this.getRegExp('', 'getvalue'))
    return valueList ? valueList[1] : '';
  };
  this.getParent = function(string){
    var parent = string.match(this.getRegExp('', 'getparent'));
    return parent ? parent[1] : '';
  };
  this.getStyle = function(string){
    var style = string.match(this.getRegExp('', 'getstyle'));
    return style ? style[1] : '';
  };
  this.createDataForNode = function(source){
    return {value: this.getValue(source), text: this.getText(source), parent: this.getParent(source), style: this.getStyle(source)};
  };
};
jsx.require(['Strings'], jsx.bind(jsx, jsx.loaded, '{jsxComponents}.AutoComplete.DataProccess'));