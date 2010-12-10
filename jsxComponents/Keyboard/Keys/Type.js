jsxComponents.Keyboard.Keys.Type = function(key, capitalize){
  this.init(key, capitalize);
};
jsxComponents.Keyboard.Keys.Type.prototype = jsxComponents.Keyboard.Keys;
jsx.require(['Dom', 'Events'], jsx.bind(jsx, jsx.loaded, '{jsxComponents}.Keyboard.Keys.Type'));
