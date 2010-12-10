/**
 * Base object for components.
 * Look for DOM nodes that have "jsx-component" class name and make components.
 */

jsx.Components = new function (){
  this.className = 'jsx-component';

  /**
   * Looks for DOM nodes that have "jsx-component" un class name and make components.
   * @param {Object} DOM node. Look for component nodes in this DOM node children.
   */
  this.init = function(element){
    element = element || document.body || document.getElementsByTagName('body')[0];
    var elements = [];
    if (jsx.Dom.hasClassName(element, this.className)) {
      elements.push(element);
    }
    elements = elements.concat(jsx.Dom.getElementsBySelector(element, '.' + this.className));
    this.createComponents(elements);
    element = elements = null;
  };

  /**
   * Creates components from DOM node by class.
   * @param {Object} DOM node.
   */
  this.createComponents = function(components){
    components.forEach(jsx.bind(this, this.processComponent));
    components = null;
  };

  this.processComponent = function(component){
    if (!component) {
      return;
    }
    var params = this.getParams(component);
    for (var i = 0, l = params.types.length; i < l; i++){
      var componentName = params.types[i];
      this.createComponent(componentName, component, typeof(params[componentName]) != 'undefined' ? params[componentName] : {} );
    }
    jsx.Dom.removeClassName(component, this.className);
    component = null;
  };

  /**
   * Creates component from DOM node by class.
   * @param {String} Location.
   * @param {Object} DOM node.
   * @param {Object} Params for initialization.
   */
  this.createComponent = function(location, component, params){
    jsx.Console.log('Start loading js files for %s', location, ['jsx', 'Components']);
    jsx.require(location, jsx.bind(this, this.initComponent, location, component, params));
    component = null;
  };

  /**
   * Call "init" method in component.
   * @param {String} Location.
   * @param {Object} DOM node.
   * @param {Object} Params for initialization.
   */
  this.initComponent = function(location, component, params){
    var Component = this.getComponent(location);
    if (Component === null){
      return;
    }
    if (typeof(Component.init) != 'function'){
      jsx.Console.error('"init" method in %s is not present or not a function', location, ['jsx', 'Components']);
      return;
    }
    jsx.Console.log('Call "init" in %s', location, ['jsx', 'Components']);
    Component.init(component, params);
    component = null;
  };

  /**
   * Returns component name from location omitting namespace (alias).
   * "{jsx}.Components.Component" converts to "Components.Component"
   * @param {String} Location.
   */
  this.getComponentName = function(location){
    return location.replace('{' + this.getNameSpace(location) + '}.', '');
  };

  /**
   * Returns component namespace from (alias) location.
   * "{jsx}.Components.Component" converts to "jsx"
   * @param {String} Location.
   * @return {String} Alias.
   */
  this.getNameSpace = function(location){
    return jsx.getAlias(location) || 'jsx';
  };

  /**
   * Returns component by location or null.
   * "{jsx}.Components.Component" return object "window.jsx.Components.Component"
   * @param {String} Location.
   * @return {Object} Object.
   */
  this.getComponent = function(location){
    if (!location){
      return null;
    }
    var nameSpace = this.getNameSpace(location);
    var name = this.getComponentName(location).split('.');
    var Component = window[nameSpace];
    if (typeof(Component) == 'undefined'){
      jsx.Console.error('No such namespace "' + nameSpace + '"', 'getComponent', 'Components', ['jsx', 'Components']);
      return null;
    }
    var path = nameSpace;
    for (var i = 0, l = name.length; i < l; i++){
      path += '.' + name[i];
      Component = Component[name[i]];
      if (typeof(Component) == 'undefined'){
        jsx.Console.error('No such compoment"' + path + '"', 'getComponent', 'Components', ['jsx', 'Components']);
        return null;
      }
    }
    return Component;
  };

  /**
   * Returns object after word "return" in attribute "onclick".
   * Attribute "onclick" will be removed during execution.
   * onclick="return {foo: 'bar'}" returns "{foo: 'bar'}"
   * @param {Object} DOM node.
   */
  this.getParams = function(object){
    try{
      var params = object.onclick ? object.onclick() : {};
    }catch(e){
      jsx.Console.error('Error getting params "' + object.onclick + '"', ['jsx', 'Components']);
    }
    object.removeAttribute('onclick');
    object.onclick = {};
    object = null;
    return params;
  };

  this.buildComponent = function(name, constructor, requireList){
    if (jsx.isArray(requireList)) {
      this._buildComponent(name, constructor, requireList);
    } else {
      jsx.require(requireList.before, jsx.bind(this, this._buildComponent, name, constructor, requireList.after));
    }
  };

  this._buildComponent = function(name, constructor, requireList){

    jsx.Console.log('Building %s requires %s', name, requireList, ['jsx', 'Components']);

    var nameSpace = this.getNameSpace(name);

    var Component = window[nameSpace];
    if (typeof(Component) == 'undefined'){
      jsx.Console.error('No such namespace "' + nameSpace + '"', 'buildComponent', 'Components', ['jsx', 'Components']);
      return null;
    }

    var path = this.getComponentName(name).split('.');
    for (var i = 0, l = path.length; i < l; i++){
      Component[path[i]] = Component[path[i]] || {};
      Component = Component[path[i]];
    }

    Component.init = function(element, params){
      new Component.Constructor(element, params);
    };

    Component.Constructor = function(element, params){
      this.__name = name;
      this.init(element, params);
    };

    Component.Constructor.prototype = new constructor;

    jsx.require(requireList, jsx.bind(jsx, jsx.loaded, name));

  };
};

jsx.require(['CallBacks', 'Dom'], jsx.bind(jsx, jsx.loaded, 'Components'));
