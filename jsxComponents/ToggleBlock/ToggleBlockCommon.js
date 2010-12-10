if (jsx.base == 'prototype'){
    jsx.Events = Event;
    jsx.Events.pageX = Event.pointerX;
    jsx.Events.pageY = Event.pointerY;
}else if (jsx.base == 'jquery'){
	jsx.Events = {};
	jsx.Events.observe = jsx.bind(jQuery.event, jQuery.event.add);
	jsx.Events.stopObserving = jsx.bind(jQuery.event, jQuery.event.remove);
	jsx.Events.element = function(event){
		return  event.srcElement || event.target;
	}
	jsx.Events.isLeftClick = function(event){
		return jQuery.event.fix(event).which == 1;
	}
	jsx.Events.pageX = function(event){
		return jQuery.event.fix(event).pageX;
	}
    jsx.Events.pageY = function(event){
        return jQuery.event.fix(event).pageY;
    }	
}
jsx.Events.__observe = jsx.Events.observe;
jsx.Events.observe = function(element, name, observer, useCapture, observe){
    observe = (typeof(observe) == 'undefined' ? true : observe);
    return new jsx.Events.observer(element, name, observer, useCapture, observe);
};

jsx.Events.observer = function (element, name, observer, useCapture, observe){
    this.element = element;
    this.name = name;
    this.observer = observer;
    this.useCapture = useCapture;
    observe ? this.start() : this.stop();

    /* prevent memory leaks in IE */
    if (document.attachEvent){
        jsx.Events.__observe(window, 'unload', jsx.bind(jsx.Events.unloadObserver, jsx.Events, this));
    }
};

jsx.Events.unloadObserver = function(observer){
    observer.element = null;
    observer.observer = null;
};

jsx.Events.observer.prototype = new function(){
    this.stop = function(){
        if (typeof this.observe != 'undefined' && !this.observe){
            return;
        }
        jsx.Events.stopObserving(this.element, this.name, this.observer, this.useCapture);
        this.observe = false;
    };
    this.start = function(){
        if (typeof this.observe != 'undefined' && this.observe){
            return;
        }
        jsx.Events.__observe(this.element, this.name, this.observer, this.useCapture);
        this.observe = true;
    };
};

jsx.Events.stop = function(event){
    jsx.Events.preventDefault(event);
    jsx.Events.stopPropagation(event);	
}

jsx.Events.preventDefault = function(event){
    if (event.preventDefault) {
        event.preventDefault();
    } else {
        event.returnValue = false;
    }
};

jsx.Events.stopPropagation = function(event){
    if (event.preventDefault) {
        event.stopPropagation();
    } else {
        event.cancelBubble = true;
    }
};
jsx.loaded('Events');

/**
 * Some functions for uniqID
 */
jsx.Utils = {
    /**
     * Generates unique string with prefix.
     * @param {String} Prefix.
     * @return {String} Uniq ID.
     */
    generateId: function (prefix){
          return (prefix || '') + ((new Date()).getTime() + Math.round(Math.random() * 10000));
    },

    /**
     * Generates unique ID for DOM node for IE returns native uniqID.
     * @param {Object} DOM node.
     * @return {String} Uniq ID.
     * @deprecated
     */
    getUniqueID: function(object){
        return this.getUniqueId(object);
    },

    /**
     * Generates unique ID for DOM node for IE returns native uniqID.
     * @param {Object} DOM node.
     * @return {String} Uniq ID.
     */
    getUniqueId: function(object){
        return object.uniqueID || (object.uniqueID = this.generateId());
    },

    /**
     * Compares two links DOM nodes.
     * @param {Object} DOM node.
     * @param {Object} DOM node.
     */
    isEqual: function(first, second){
        return (this.getUniqueId(first) == this.getUniqueId(second));
    }
};
jsx.loaded('Utils');

jsx.Dom = {}
if (jsx.base == 'prototype'){
	jsx.Dom.hasClassName = Element.Methods.hasClassName;
	jsx.Dom.removeClassName = Element.Methods.removeClassName;
	jsx.Dom.addClassName = Element.Methods.addClassName;
	jsx.Dom.switchClassName = Element.Methods.switchClassName;
	jsx.Dom.toggleClassName = Element.Methods.toggleClassName;
	
	jsx.Dom.getElementsBySelector = Element.Methods.getElementsBySelector;
	jsx.Dom.offset = function(element){
		var offset = Position.cumulativeOffset(element);
		return {left: offset[0], top: offset[1]};
	}
}else if (jsx.base == 'jquery'){
	jsx.Dom.hasClassName = jQuery.className.has;
	jsx.Dom.removeClassName = jQuery.className.remove;
	jsx.Dom.addClassName = jQuery.className.add;
	jsx.Dom.switchClassName = function(element, classOne, classTwo){
	  if (jQuery.className.has(element, classOne)){
	    jQuery.className.remove(element, classOne);
	    jQuery.className.add(element, classTwo);
	  }else if(jQuery.className.has(element, classTwo)){
	    jQuery.className.remove(element, classTwo);
	    jQuery.className.add(element, classOne);
	  }
	};
	jsx.Dom.toggleClassName = function(element, className){
	  if(jQuery.className.has(element, className)){
	    jQuery.className.remove(element, className);
	  }else{
	    jQuery.className.add(element, className);
	  }
	};
	
	function unArray(item){
		return item.length ? item[0] : item; 
	}
	jsx.Dom.getElementsBySelector = function(context, selector){
		return jsx.toArray(jQuery(selector, context)).map(unArray);
	}
	jsx.Dom.offset = function (element){
		return jQuery(element).offset();
	}
}

jsx.loaded('Dom');


/**
 * This object allows you to make soft links between objects (any objects DOM node or JS).
 */

jsx.CallBacks = new function (){
    this.srcload = false;
    this.listeners = {};
    this.eventHistory = {};

    /**
     * Returns object id.
     * @param {Object} DOM node or string "*"
     * @return {String} DOM node id or "*"
     * @private
     */
    this.getId = function(object){
        return (object === '*' ? '*' : jsx.Utils.getUniqueId(object));
    };

    /**
     * Allows to listen for object event.
     * @param {String} Type of event.
     * @param {Funtion} Listener for event.
     * @param {Object} Which object to listen.
     * @param {Boolean} Start listen immediately by default is "true".
     * @param {Object} This object will be in "this" variable for listener, not obligatory.
     * @return {Object} Listener jsx.CallBacks.Listener.
     */
    this.add = function (type, listener, object, execute) {
        object = object || this;
        var id = this.getId(object);

        if (id == this.uniqueID && type == 'srcload' && this.srcload){
            this.execListener(listener);
        }

        var key = id + type;
        if (typeof(this.listeners[key]) == 'undefined') {
            this.listeners[key] = [];
        }
        var listeners = this.listeners[key];
        return (listeners[listeners.length] = new jsx.CallBacks.Listener(listener, execute, key));
    };

    /**
     * Allows to dispatch object event.
     * @param {String} Type of event.
     * @param {Object} Object that is dispatch event.
     * @param {Object} Event object, any data for listeners.
     */
    this._dispatch = function(type, object, event){
        object = object || this;
        var id = this.getId(object);

        if (id == this.uniqueID && type == 'srcload' && !this.srcload && !this.srcLoad()){
            return;
        }

        this.execListeners(id, type, event);
        this.execListeners('*', type, event);
        this.execListeners(id, '*', event);
        this.execListeners('*', '*', event);


        // add event to history
        var key = id + type;
        if (typeof(this.eventHistory[key]) == 'undefined'){
            this.eventHistory[key] = [];
        }
        this.eventHistory[key].push(event);
    }

    if(jsx.Vars.DEBUG) {
        this.dispatch = function (type, object, event) {
            jsx.Console.group('Type: ', type + ', object: ', object, this.execListener.tags.concat(type));
            this._dispatch(type, object, event);
            jsx.Console.groupEnd();
        };
    }else{
        this.dispatch = this._dispatch;
    }

    /**
     * Runs list of listeners by key.
     * @param {String} Object id (from jsx.CallBacks.getId method).
     * @param {String} Type of event.
     * @param {Object} Event object, any data for listeners.
     * @private
     */
    this.execListeners = function (id, type, event) {
        var key = id + type;
        var listeners = this.listeners[key];
        if (typeof(listeners) == 'undefined') {
            return;
        }
        // create local copy of array
        var listenersCopy = [];
        for(var i = 0, l = listeners.length; i < l; i++) {
          listenersCopy[i] = listeners[i];
        }
        for (var i = 0, l = listenersCopy.length; i < l; i++) {
            var listener = listenersCopy[i];
            // if don't need to execute execute == false, if deleted execute == null
            if (listener.execute) {
                this.execListener(listener.listener, event, id, type);
            }
        }
    };

    /**
     * Runs listener.
     * @param {Function} Listener.
     * @param {Object} This object will be in "this" variable for listener.
     * @param {Object} Event object, data for listener.
     * @private
     */
    this._execListener = function (listener, event) {
        listener(event);
    };

    if(jsx.Vars.DEBUG) {
        this.execListener = function (listener, event, id, type) {
            jsx.Console.log('Listener: ', listener, this.execListener.tags.concat(type));
            jsx.Console.log('Event: ', event, this.execListener.tags.concat(type));
            this._execListener(listener, event);
        };
        this.execListener.tags = ['jsx', 'CallBacks', 'Dispatch'];
    } else {
        this.execListener = this._execListener;
    }

    /**
     * Removes listener.
     * @param {Object} listener.
     */
    this.remove = function (listener) {
        var listenersByKey = this.listeners[listener.key];
        var i = listenersByKey.indexOf(listener);
        if (i != -1) {
          listenersByKey.splice(i, 1);
        }
        listener = listener.listener = listener.execute = null;
    };

    /**
     * Code for IE. This code doesn't allow to dispatch event "scrLoad" before body node closes in IE.
     * For all browsers create jsx.CallBacks.Destroer object.
     * @private
     */
    this.srcLoad = function(){
        var _this = this;
        if (!jsx.Vars.is_ie || document.readyState == 'interactive' || document.readyState == 'complete'){
            return srcLoaded();
        }

        function srcLoaded(){
            return _this.srcload = true;
        }

        function srcLoad(){
            if (document.readyState == 'interactive' || document.readyState == 'complete'){
                srcLoaded();
                _this.dispatch('srcload');
            }
        }
        document.onreadystatechange = srcLoad;
        return false;
    };
};

/**
 * Listener object. When you add function listener you will receive this object.
 * This object allows you to manipulate with function listener.
 */
jsx.CallBacks.Listener = function (listener, execute, key) {
    this.listener = listener;
    this.key = key;
    this.execute = (typeof(execute) != 'undefined' ? execute : true);
};
jsx.CallBacks.Listener.prototype = {
    /**
     * Starts listen for event.
     */
    start: function () {
        this.execute = true;
    },

    /**
     * Stops listen for event.
     */
    stop: function () {
        this.execute = false;
    }
};
jsx.require(['Utils'], jsx.bind(jsx, jsx.loaded, 'CallBacks'));


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
            var componentName = params.types[i]
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
        if (Component == null){
            return;
        }
        if (typeof(Component.init) != 'function'){
            jsx.Console.error('"init" method in %s is not peresnt or not a function', location, ['jsx', 'Components']);
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
            jsx.Console.error('No such namespace "' + nameSpace + '"', 'getComponent', 'Componemts', ['jsx', 'Components']);
            return null;
        }
        var path = nameSpace;
        for (var i = 0, l = name.length; i < l; i++){
            path += '.' + name[i];
            Component = Component[name[i]];
            if (typeof(Component) == 'undefined'){
                jsx.Console.error('No such compoment"' + path + '"', 'getComponent', 'Componemts', ['jsx', 'Components']);
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
};

jsx.require(['CallBacks', 'Dom'], jsx.bind(jsx, jsx.loaded, 'Components'));

jsxComponents.ToggleBlock = new function(){
  this.init = function(element, params){
    new jsxComponents.ToggleBlock.Constructor(element, params);
    element = null;
  };
};

jsxComponents.ToggleBlock.Constructor = function (element, params){
  this.element = element;
  this.collapseClass = params.collapseClass || '';
  this.expandClass = params.expandClass || '';
  this.init();
  element = null;
};

jsxComponents.ToggleBlock.Constructor.prototype = new function(){
  this.init = function(){
    this.switchers = jsx.Dom.getElementsBySelector(this.element, '.jsxComponents-ToggleBlock-Switcher');
    this.switchers.map(jsx.bind(this, this.observeSwitcher));

    jsx.CallBacks.add('ToggleBlockClick', jsx.bind(this, this.click), this.element);

  };
  this.click = function(event){
    switch (event){
      case 'expand':
        jsx.Dom.removeClassName(this.element, this.collapseClass);
        jsx.Dom.addClassName(this.element, this.expandClass);        
        break;
      case 'collapse':
        jsx.Dom.removeClassName(this.element, this.expandClass);
        jsx.Dom.addClassName(this.element, this.collapseClass);        
        break;
    }
  }
  this.observeSwitcher = function(switcher){
    jsx.Events.observe(switcher, 'click', jsx.bind(this, this.switchBlock));
  };
  this.switchBlock = function(e){
    jsx.Events.stop(e);
    if (this.collapseClass && this.expandClass){
      jsx.Dom.switchClassName(this.element, this.collapseClass, this.expandClass);
      return;
    }
    if (this.expandClass){
      jsx.Dom.toggleClassName(this.element, this.expandClass);
    }
    if (this.collapseClass){
      jsx.Dom.toggleClassName(this.element, this.collapseClass);
    }
  };
  this.garbageCollector = function(){
    this.element = null;
    this.switchers = null;
  };
};

jsx.require(['Dom', 'Events', 'CallBacks'], jsx.bind(jsx, jsx.loaded, '{jsxComponents}.ToggleBlock'));