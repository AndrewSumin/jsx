jsxComponents.Editor.Actions = function(actions){
  this.create(actions);
};
jsxComponents.Editor.Actions.prototype = new function(){
  this.create = function(actions){
    this.element = document.createElement('div');
    jsx.Dom.addClassName(this.element, 'jsxComponents-Editor-Buttons');
    actions.forEach(jsx.bind(this, this.addAction, this.element));
  };
  this.getElement = function(){
    return this.element;
  };
  this.addAction = function(list, action){
    var container = list.appendChild(document.createElement('a'));
    container.href = '#';
    jsx.Dom.addClassName(container, 'jsxComponents-Editor-Button');
    jsx.Dom.addClassName(container, 'jsxComponents-Editor-Button-' + action);
    jsx.Events.observe(container, 'mousedown', jsx.bind(this, this.dispatch, action));
    jsx.Events.observe(container, 'click', jsx.bind(this, this.stop));
    switch (action){
      case 'Source':
        container.innerHTML = 'Код';
        container.title = 'Код';
        break;
      case 'Editor':
        container.innerHTML = 'Текст';
        container.title = 'Текст';
        break;
      default :
        container.innerHTML = '&nbsp;';
        container.title = action;
    }
  };
  this.stop = function(e){
    jsx.Events.stop(e);
  };
  this.dispatch = function(action, e){
    jsx.Events.stop(e);
    jsx.CallBacks.dispatch('jsxComponents-Editor-Action', this, action);
  };
};
jsx.require(['Dom', 'Events', 'CallBacks'], jsx.bind(jsx, jsx.loaded, '{jsxComponents}.Editor.Actions'));

