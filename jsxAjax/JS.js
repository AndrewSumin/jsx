/**
 * Hash for awaiting ajax responses
 * @alias jsxAjax.JSResponse
 */
jsxAjax.JSResponse = {};

/**
 * AJAX through Script.
 * @alias jsxAjax.JS
 * @constructor
 * @param {Object} id.
 */
jsxAjax.JS = function(id){
    this.key = id || this._getKey();
    this.src = null;
    this.method = this.GET;
    this.responseText = '';
    this.readyState = this.UNINITIALIZED;
    this.script = null;
    this.responseBody = null;
    this.responseStream = null;
    this.responseXML = null;
    this.status = 200;
    this.statusText = '';
    this.charset = jsx.charsets['jsx'];
};

/**
 * Method for calling in the loaded js files.
 * @alias jsxAjax.JS.onload
 * @param {Object} Key.
 * @param {Object} Data.
 */
jsxAjax.JS.onload = function(key, data){
    var response = jsxAjax.JSResponse[key];
    if (!response){
        jsx.Console.warn('Nobody is waiting for response.\n   requestid:\t' + key + '\n   data:\t' + data, ['Ajax', 'AjaxJS']);
        return;
    }
    response._onload(key, data);
    delete jsxAjax.JSResponse[key];
    delete response;
};

jsxAjax.JS.prototype = {

    /* Constants */

    GET: 'GET',
    UNINITIALIZED: 0,
    LOADING: 1,
    LOADED: 2,
    INTERACTIVE: 3,
    COMPLETED: 4,
    KEY_NAME: 'requestid',

    /* Public methods */

    /**
     * Prepare ajax connection.
     * @alias jsxAjax.JS.open
     * @param {Object} method
     * @param {Object} src
     */
    open: function(method, src){
        this.src = src || null;
    },

    /**
     * Send Request.
     * @alias jsxAjax.JS.send
     */
    send: function(){
        if (!this.src){
            return;
        }
        this._readyStateChange(this.LOADING);
        this._registerResponseWaiting(this.key);
        var delimiter = '?';
        if ((this.src.indexOf('?') != -1)){
            delimiter = (this.src.lastIndexOf('?') == this.src.length - 1) ? '' : '&';
        }
        this.src += delimiter + this.KEY_NAME + '=' + this.key;

        var _this = this;
        function getScript(script){
            _this.script = script;
        }
        jsx.Scripts.createScript({src:this.src, charset:this.charset}, getScript);
    },

    /**
     * Abort request.
     * @alias jsxAjax.JS.abort
     */
    abort: function(){
        this._deleteScript();
        this._readyStateChange(this.UNINITIALIZED);
        if (this.key){
            delete (jsxAjax.JSResponse[this.key]);
        }
    },

    /**
     * Should be redefined to look for ready state change.
     * @alias jsxAjax.JS.onreadystatechange
     */
    onreadystatechange: function(){
        return true;
    },

    /**
     * Do nothing is needed for XmlHttpRequset compatibility.
     * @alias jsxAjax.JS.getAllResponseHeaders
     */
    getAllResponseHeaders: function(){
        return null;
    },

    /**
     * Do nothing is needed for XmlHttpRequset compatibility.
     * @alias jsxAjax.JS.getResponseHeader
     * @param {String} Header name.
     */
    getResponseHeader: function(name){
        return null;
    },

    /**
     * Do nothing is needed for XmlHttpRequset compatibility.
     * @alias jsxAjax.JS.setRequestHeader
     * @param {String} Header name.
     * @param {String} Header value.
     */
    setRequestHeader: function(name, value){
    },

    /* Private methods */

    /**
     * Delete Script.
     * @alias jsxAjax.JS._deleteScript
     * @private
     */
    _deleteScript: function(){
        return;
        if (this.script){
            this.script.src = '';
            try{document.getElementsByTagName('head').item(0).removeChild(this.script)}catch(e){};
            this.script = null;
        }
    },

    /**
     * Check readystatechange and do actions if needs.
     * @alias jsxAjax.JS._readyStateChange
     * @param {Object} readyState
     * @private
     */
    _readyStateChange: function(readyState){
        this.readyState = readyState;
        if (typeof(this.onreadystatechange) == 'function'){
            return this.onreadystatechange();
        }
        return false;
    },

    /**
     * Put responce to waiting list.
     * @memberOf jsxAjax.JS._registerResponseWaiting
     * @param {Object} key
     * @private
     */
    _registerResponseWaiting: function(key){
        jsxAjax.JSResponse[this.key] = this;
    },

    /**
     * Process request.
     * @alias jsxAjax.JS._onload
     * @param {Object} key
     * @param {Object} data
     * @private
     */
    _onload: function(key, data){
        this._readyStateChange(this.LOADED);
        this._readyStateChange(this.INTERACTIVE);
        this.responseText = data;
        this._readyStateChange(this.COMPLETED);

        jsx.Console.group(key, ['Ajax', 'AjaxJS']);
        jsx.Console.dirxml(this.script, ['Ajax', 'AjaxJS']);
        jsx.Console.log(data, ['Ajax', 'AjaxJS']);
        jsx.Console.groupEnd(key, ['Ajax', 'AjaxJS']);

        this._deleteScript();
    },

    /**
     * Return uniq key.
     * @alias jsxAjax.JS._getKey
     * @private
     */
    _getKey: function(){
        return (new Date().getTime() + '' + Math.round(Math.random() * 1000000));
    }
};

jsx.loaded('{jsxAjax}.JS');
