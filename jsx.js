/**
 * Copyright (c) 2007 Andrew Sumin (http://jsx.ru/)
 *
 * Licensed under Creative Commons Atribution 3.0 license
 * http://creativecommons.org/licenses/by/3.0/
 *
 * Permission is granted to modify this work as stated
 * in license given that this notice is preserved.
 */

/**
 * Core object contains methods for dynamic loading of scripts.
 */

var jsx = jsx || {};
(function () {
var A = Array.prototype;
if (!A.indexOf) {
  A.indexOf = function (searchElement, fromIndex) {
    fromIndex = fromIndex || 0;
    for (var length = this.length; fromIndex < length; fromIndex++) {
      if (this[fromIndex] == searchElement) {
        return fromIndex;
      }
    }
    return -1;
  };
}
if (!A.lastIndexOf) {
  A.lastIndexOf = function (searchElement, fromIndex) {
    var length = this.length;
    fromIndex = fromIndex || length - 1;
    if (fromIndex < 0) {
      fromIndex += length;
    }
    for (; fromIndex >= 0; fromIndex--) {
      if (this[fromIndex] == searchElement) {
        return fromIndex;
      }
    }
    return -1;
  };
}
if (!A.every) {
  A.every = function (callback, thisObject) {
    thisObject = thisObject || window;
    var index = 0, length = this.length;
    for (; index < length; index++) {
      if (!callback.apply(thisObject, [this[index], index, this])) {
        break;
      }
    }
    return (index == length);
  };
}
if (!A.filter) {
  A.filter = function (callback, thisObject) {
    thisObject = thisObject || window;
    var length = this.length, count = 0, filtered = [];
    for (var index = 0; index < length; index++) {
      if (callback.apply(thisObject, [this[index], index, this])) {
        filtered[count++] = this[index];
      }
    }
    filtered.length = count;
    return filtered;
  };
}
if (!A.forEach) {
  A.forEach = function (callback, thisObject) {
    thisObject = thisObject || window;
    for (var index = 0, length = this.length; index < length; index++) {
      callback.apply(thisObject, [this[index], index, this]);
    }
  };
}
if (!A.map) {
  A.map = function (callback, thisObject) {
    thisObject = thisObject || window;
    var length = this.length, map = [];
    for (var index = 0; index < length; index++) {
      map[index] = callback.apply(thisObject, [this[index], index, this]);
    }
    return map;
  };
}
if (!A.some) {
  A.some = function (callback, thisObject) {
    thisObject = thisObject || window;
    var index = 0, length = this.length;
    for (; index < length; index++) {
      if (callback.apply(thisObject, [this[index], index, this])) {
        break;
      }
    }
    return (index != length);
  };
}
if (!A.remove){
    // Array Remove - By John Resig (MIT Licensed)
    A.remove = function(from, to) {
      var rest = this.slice((to || from) + 1 || this.length);
      this.length = from < 0 ? this.length + from : from;
      return this.push.apply(this, rest);
    };
}

if (!Array.prototype.reduce) {
  Array.prototype.reduce = function(fun /*, initialValue */)
  {
    "use strict";
    if (this === void 0 || this === null)
      throw new TypeError();
    var t = Object(this);
    var len = t.length >>> 0;
    if (typeof fun !== "function")
      throw new TypeError();
    // no value to return if no initial value and an empty array
    if (len == 0 && arguments.length == 1)
      throw new TypeError();
    var k = 0;
    var accumulator;
    if (arguments.length >= 2){
      accumulator = arguments[1];
    } else {
      do {
        if (k in t) {
          accumulator = t[k++];
          break;
        }
        // if array contains no values, no initial value to return
        if (++k >= len)
          throw new TypeError();
      }
      while (true);
    }
    while (k < len) {
      if (k in t)
        accumulator = fun.call(undefined, accumulator, t[k], k, t);
      k++;
    }
    return accumulator;
  };
}


jsx.getReadyState = function(){
  return document.readyState || 'loading';
};
function setReadyState(){
  jsx.getReadyState = function(){return 'complete';};
}
/* for Mozilla/Opera9 */
if (document.addEventListener) {
  document.addEventListener("DOMContentLoaded", setReadyState, false);
}
/* for Safari */
if (/WebKit/i.test(navigator.userAgent)) {
  // sniff
  var _timer = setInterval(function() {
    if (/loaded|complete/.test(document.readyState)) {
      setReadyState(); // call the onload handler
    }
  }, 10);
}
})();

jsx.aliases = {};
jsx.expectedAliases = {};
jsx.charsets = {};
jsx.scriptsByFileName = [];
jsx._getAliasRegexp = /^\{[^\}]+\}/;
/**
 * This method loads script and executes listener after script loading.
 * @param {String} String like "foo.bar". This string means to load file bar.js from framework folder subfolder foo.
 * @param {Function} Function for execution after loading script.
 * @method
 */
jsx.require = function(url, listener){
  this.Loader.require(url, listener);
};
/**
 * This method is for scripts that are loaded. They must execute this method (jsx.loaded) after all initialization functions.
 * @param {String} String like "foo.bar". This string means to load file bar.js from framework folder subfolder foo.
 * @method
 */
jsx.loaded = function(url){
  this.Loader.loaded(url);
};

jsx.init = function(){
  function setParamsAndInitLocator(){
      function setParamsAndInitLocatorLocal(script){
        jsx.params = jsx.getScriptParams(script);
        if (jsx.params.base && jsx.preloaded != jsx.params.base){
          jsx.base = jsx.params.base;
          jsx.require(['{jsx}.' + jsx.base + '.' + jsx.base], jsx.bind(jsx, jsx.initLocator));
        }else if (jsx.base){
          jsx.initLocator();
        }
      }
    jsx.getScriptByFileName('jsx.js', setParamsAndInitLocatorLocal);
  }
  jsx.getBaseAndSetAlias('jsx', 'jsx.js', 'utf-8', setParamsAndInitLocator);
};

if ( !Function.prototype.bind ) {
  Function.prototype.bind = function( obj ) {
    var args = [].slice.call(arguments, 1),
        self = this,
        nop = function () {},
        bound = function () {
          return self.apply( this instanceof nop ? this : ( obj || {} ),
                              args.concat( [].slice.call(arguments) ) );
        };
    nop.prototype = self.prototype;
    bound.prototype = new nop();
    return bound;
  };
}


jsx.bind = function(){
  var args = jsx.toArray(arguments), object = args.shift(), executer = args.shift();
  return function() {
    return executer.apply(object, args.concat(jsx.toArray(arguments)));
  };
};

jsx.toArray = function(object){
  var result = [];
  for (var i = 0, l = object.length; i < l; i++){
    result.push(object[i]);
  }
  return result;
};

jsx.isArray = function(object){
  return (object && object.constructor == Array)
};

/**
 * Returns path to file in src attribute
 * @param {String} file name
 * @method
 */
jsx.getBase = function(file, listener){
  function returnBase(script){
    var src = script.getAttribute('src');
    listener(src.substring(0, src.indexOf(file)) || '.');
  }
  this.getScriptByFileName(file, returnBase);
};

/**
 * Returns tag "script" by file name or null if no such tag.
 * @param {String} file name
 * @param {Function} listener to call with founded file as parameter
 * @method
 */
jsx.getScriptByFileName = function(file, listener, /* private */ tries){
  if(this.scriptsByFileName[file]){
     listener(this.scriptsByFileName[file]);
     return;
  }
  tries = tries || 0;

  function findScript(script){
    var src = script.getAttribute('src');
    return src && src.indexOf(file) >= 0;
  }
  this.scriptsByFileName[file] = jsx.toArray(document.getElementsByTagName('script')).filter(findScript)[0];

  if(this.scriptsByFileName[file]){
    listener(this.scriptsByFileName[file]);
  }else if(tries < 1000){
    var _this = this;
    window.setTimeout(function (){_this.getScriptByFileName(file, listener, ++tries);}, 10);
  }
};

/**
 * Sets the alias as path to file
 * @param {String} alias
 * @param {String} file name
 * @param {String} charset
 */
jsx.getBaseAndSetAlias = function(alias, file, charset, listener){
  charset = charset || null;
  function setAlias(base){
    this.setAliasCharset(alias, charset);
    this.setAlias(alias, base);
    if (typeof listener == 'function'){
      listener();
    }
  }
  this.getBase(file, jsx.bind(this, setAlias));
};
/**
 * Sets the alias
 * @param {String} alias
 * @param {String} path
 * @method
 */
jsx.setAlias = function(name, value){
  this.aliases[name] = value;
  if (!this.expectedAliases[name]){
    return;
  }
  // maybe some scripts are waiting for this alias
  var listener;
  while ((listener = this.expectedAliases[name].shift())){
    listener();
  }
};
/**
 * Sets the charset for scripts with such alias
 * @param {String} alias
 * @param {String} charset
 * @method
 */
jsx.setAliasCharset = function(alias, charset){
  this.charsets[alias] = charset;
};
/**
 * Returns the alias
 * @param {String} location
 * @method
 */
jsx.getAlias = function(location){
  var alias = this._getAliasRegexp.exec(location);
  return (alias ? alias[0].substr(1, alias[0].length - 2) : null);
};

jsx.getScriptParams = function(script){
  var params;
  try {
    params = typeof(script.onload) == 'undefined'
      ? null
      : script.onload()
        ? script.onload()
        : (new Function (script.onload))();
  }catch(e){
    params = script.getAttribute('onload')
      ? (new Function (script.getAttribute('onload')))()
      : null;
  }
  return params || (new Function(script.innerHTML))() || {base:'jquery', autoinit:true, build:'1.1.0'};
};

/**
 * Contains all global vars like base to core (this) file browser type and version...
 */
jsx.Vars = new function(){
  this.DEBUG = false;

  this.FALSE = function() { return false;        };
  this.TRUE  = function() { return true;         };
  this.NULL  = function() { return null;         };
  this.EMPTY = function() { /* return nothing */ };

  var userAgent = navigator.userAgent.toLowerCase();
  this.version  = (userAgent.match(/.+(?:rv|it|ra|ie)[\/: ]([\d.]+)/) || [])[1];
  this.safari   = /webkit/.test(userAgent);
  this.opera    = /opera/.test(userAgent);
  this.msie     = /msie/.test(userAgent) && !(/opera/.test(userAgent));
  this.msie6    = /msie 6/.test(userAgent);
  this.msie7    = /msie 7/.test(userAgent);
  this.mozilla  = /mozilla/.test(userAgent) && !(/(compatible|webkit)/.test(userAgent));
};

/**
 * Creates tag script.
 * @alias jsx.Scripts
 */
jsx.Scripts = new function (){
  /**
   * This method creates tag SCRIPT.
   * @param {Object} Attrbites
   * @param {Function} Listerner for script creation.
   */
  this.createScript = function (attributes, listener, /*private*/ tries){
    tries = tries || 0;
    listener = typeof(listener) == 'function' ? listener : jsx.Vars.NULL;
    var script = this._createScript(attributes);
    if (script === null && tries < 10){
      window.setTimeout(jsx.bind(this, this.createScript, attributes, listener, ++tries), 10);
    }else{
      listener(script);
    }
  };

  this._createScript = function (attributes) {
    var script = document.createElement('script');
    script.setAttribute('type', 'text/javascript');
    for (var i in attributes){
      if (i == 'src') {
        attributes[i] = encodeURI(attributes[i]);
      }
      script.setAttribute(i, attributes[i]);
    }
    // InsertBefore for IE.
    // If head is not closed and use appendChild IE crashes.
    var head = document.getElementsByTagName('head').item(0);
    head.insertBefore(script, head.firstChild);
    return script;
  };
};

/**
 * Creates tag link.
 * @alias jsx.Links
 */
jsx.Links = new function (){
  /**
   * This method creates tag LINK.
   * @param {Object} Attrbites
   */
  this.createLink = function (attributes){
    var link = document.createElement('link');
    attributes.rel = attributes.rel || 'stylesheet';
    attributes.type = attributes.type || 'text/css';
    for (var i in attributes){
      link.setAttribute(i, attributes[i]);
    }
    // InsertBefore for IE.
    // If head is not closed and use appendChild IE crashes.
    var head = document.getElementsByTagName('head').item(0);
    head.insertBefore(link, head.firstChild);
  };
};

/**
 * Creates real URL from strings.
 */
jsx.ConstructURL = new function(){
  /**
   * Creates real URL from strings.
   * @param {String} String like "foo.bar"
   * @param {String} File extention like "js"
   * @return {String} URL like http://www.yandex.ru/foo/bar.js
   */
  this.construct = function(string, type){
    type = type || 'js';
    string = string.replace(/\./g, '/');
    function replacealias(match){
      var alias = match.substr(1, match.length - 2);
      return jsx.aliases[alias];
    }
    string = string.replace(/\{[^\}]+\}/ig, replacealias);
    var http = string.match(/^https?\:\/\//i) || '';
    string = string.replace(/^https?\:\/\//i, '');
    string = string.replace(/\/\//ig, '/');
    return http + string + '.' + type + '?build=' + jsx.params.build;
  };
};

/**
 * Alias locator. Contains information about files with aliases.
 */
jsx.Locator = new function(){
  this.aliases = {};
  this.get = function(alias){
    return this.aliases[alias] || null;
  };
  this.set = function(name, alias){
    this.aliases[name] = alias;
    if(jsx.expectedAliases[name]){
      this.load(name);
    }
  };
  this.load = function(alias){
    if (!this.get(alias) || this.get(alias).called){
      return;
    }
    this.get(alias).called = true;
    jsx.Console.log('Loading alias %s from %s', alias, this.get(alias).src, ['jsx', 'Loader']);
    jsx.Scripts.createScript({'src': this.get(alias).src, 'charset': this.get(alias).charset});
  };
};

/**
 * Dynamically loads scripts.
 */
jsx.Loader = new function() {
  this.scripts = {};

  /**
   * This method loads script and executes listener after script loading.
   * @param {String} String like "foo.bar". This string means to load file bar.js from framework folder subfolder foo.
   * @param {Function} Function for execution after loading script.
   */
  this.require = function(urls, listener){
    if (!urls || urls.length == 0) {
      (listener || jsx.Vars.EMPTY)();
      return;
    }
    urls = (typeof(urls) == 'string') ? [urls] : urls;
    this.requireList(urls, listener);
  };

  /**
   * This method is for scripts that are loaded. They must execute this method (jsx.loaded) after all initialization functions.
   * @param {String} String like "foo.bar". This string means to load file bar.js from framework folder subfolder foo.
   */
  this.loaded = function(url){
    jsx.Console.log('Loaded %s', url, ['jsx', 'Loader']);
    if (!jsx.getAlias(url)){
      url = '{jsx}.' + url;
    }
    jsx.Console.log('Loaded %s', url, ['jsx', 'Loader', 'Components']);
    if (!this.scripts[url]){
      this.scripts[url] = this.createScriptFake(jsx.Vars.NULL);
    }
    var listener;
    while ((listener = this.scripts[url].listeners.shift())){
      listener();
    }
    this.scripts[url].ready = true;
  };

  this.requireList = function(urls, listener){
    jsx.Console.log('Requires %s', urls, ['jsx', 'Loader']);
    var counter = 0, length = urls.length;
    // when JS file will be loaded listWatch will be called
    function listWatch() {
      // increase files counter
      counter++;
      // exec listener if all loaded
      if(counter == length){
        (listener || jsx.Vars.EMPTY)();
      }
    }
    urls.forEach(jsx.bind(this, this._require, listWatch));
  };

  this._require = function (listener, url){
    var alias = jsx.getAlias(url);
    if (!alias){
      url = '{jsx}.' + url;
      alias = 'jsx';
    }
    listener = listener || jsx.Vars.EMPTY;
    if (typeof jsx.aliases[alias] != 'undefined'){
      // if alas is defined start load
      this.startLoad(url, listener, jsx.charsets[alias]);
    }else{
      //jsx.Console.log('Wait for alias %s alias list %s', alias, jsx.aliases.toSource() || '{}', ['jsx', 'Loader']);
      jsx.Console.log('Wait for alias %s alias list %s', alias, jsx.aliases || '{}', ['jsx', 'Loader']);
      // another way may be it will appear later
      this.waitForAlias(alias, url, listener);
    }
  };

  this.startLoad = function(url, listener, charset){
    if (this.scripts[url]){
      jsx.Console.log('File %s already loaded', url, ['jsx', 'Loader']);
      this.putOnWaitingList(url, listener);
    }else{
      this.scripts[url] = this.createScriptFake(listener);
      jsx.Console.log('Start loading js file %s from %s', url, jsx.ConstructURL.construct(url), ['jsx', 'Loader']);
      jsx.Console.log('Start loading %s', url, ['Components']);
      jsx.Scripts.createScript({'src': jsx.ConstructURL.construct(url), 'charset': charset});
    }
  };

  this.waitForAlias = function (alias, url, listener){
    if(!jsx.expectedAliases[alias]){
      jsx.expectedAliases[alias] = [];
    }
    jsx.expectedAliases[alias].push(jsx.bind(this, this._require, listener, url));
    jsx.Locator.load(alias);
  };

  this.createScriptFake = function(listener){
    return {
      listeners: listener ? [listener] : [],
      ready: false
    };
  };

  this.putOnWaitingList = function (url, listener){
    if(this.scripts[url].ready){
      (listener || jsx.Vars.EMPTY)();
    }else{
      this.scripts[url].listeners.push(listener);
    }
  };
};

jsx.Console = new function(){
  this.log      = jsx.Vars.NULL;
  this.info     = jsx.Vars.NULL;
  this.warn     = jsx.Vars.NULL;
  this.error    = jsx.Vars.NULL;
  this.trace    = jsx.Vars.NULL;
  this.dir      = jsx.Vars.NULL;
  this.dirxml   = jsx.Vars.NULL;
  this.group    = jsx.Vars.NULL;
  this.groupEnd = jsx.Vars.NULL;
};

/*
window.onerror = function(){
  return !jsx.Vars.DEBUG;
};
*/

jsx.initLocator = function(){
  jsx.Locator.set('jsxComponents', {
    src: jsx.ConstructURL.construct('{jsx}.jsxComponents.jsxComponents'),
    charset: 'utf-8',
    called: false
  });
  jsx.Locator.set('jsxAjax', {
    src: jsx.ConstructURL.construct('{jsx}.jsxAjax.jsxAjax'),
    charset: 'utf-8',
    called: false
  });
  jsx.Locator.set('ZC', {
    src: jsx.ConstructURL.construct('{jsx}.ZC.ZC'),
    charset: 'utf-8',
    called: false
  });
  if (!jsx.params.autoinit){
    return;
  }
  if (jsx.getReadyState() == 'complete'){
    jsx.require('Components', function(){jsx.Components.init();});
    return;
  }
  function observe(element, name, observer, useCapture) {
    if (element.addEventListener) {
      element.addEventListener(name, observer, useCapture);
    } else if (element.attachEvent) {
      element.attachEvent('on' + name, observer);
    }
  }
  observe(window, 'load', function () {
    jsx.require('Components', function(){jsx.Components.init();});
  });
};

jsx.init();


// If you watn to debug something add parameter jsxdebug=on to location.
// To switch off debug mode add parameter jsxdebug=off to location.
if ((/jsxdebug/.test(window.location.search)) || (/jsxdebug/.test(document.cookie))){
  jsx.require('Debug');
}
