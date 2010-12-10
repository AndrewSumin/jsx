jsxComponents.Editor.Shortcuts = function(shortcuts, element){
  this.create(shortcuts, element);
};
jsxComponents.Editor.Shortcuts.prototype = new function(){
  this.create = function(shortcuts, frame){
    //jsx.ShortCuts.init(frame.contentWindow.document);
    
    shortcuts.forEach(jsx.bind(this, this.addShortcut, frame.contentWindow.document));
  };
  this.addShortcut = function(element, shortcut){
    jsx.ShortCuts.down([{key: jsx.ShortCuts['KEY_' + shortcut[0].toUpperCase()], ctrl: true}], jsx.bind(this, this.dispatch, shortcut[1]));
  };
  this.dispatch = function(action, e){
    jsx.CallBacks.dispatch('jsxComponents-Editor-Action', this, action);
  };
};
jsx.require(['Dom', 'Events', 'CallBacks', 'ShortCuts'], jsx.bind(jsx, jsx.loaded, '{jsxComponents}.Editor.Shortcuts'));

