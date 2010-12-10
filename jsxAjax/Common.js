/**
 * Base class for AJAX requests.
 * @alias jsxAjax.Common
 * @constructor
 * @param {Object} AJAX object (AjaxIframe, AjaxJS ...)
 * @param {String} request URL
 * @param {Function} function handler for success
 * @param {Function} function handler for error
 * @param {Object} trace
 * @param {String} request method (POST, GET)
 * @param {Object} request body (for POST method only)
 */
jsxAjax.Common = function (ajax, url, responseSuccess, responseError, trace, method, body){
    this.method = method || this.GET;
    this.body = body || '';
    this.url = url;
    try {
        this._checkCreation(ajax, responseSuccess, responseError);
    }catch(e){
        jsx.Console.error(e, trace, ['jsx', 'Ajax']);
        return;
    }
    this.trace = trace || null;
    this._prepareAjax();

    /**
     * Default Time to wait for ajax response is 10s.
     * @alias jsxAjax.Common.waitTime
     * @constant
     */
    this.waitTime = 90 * 1000;
    this.wait = null;
};
jsxAjax.Common.prototype = {

    /* Constants */

    GET: 'GET',

    /* Public methods */

    /**
     * Send request.
     * @alias jsxAjax.Common.send
     */
    send: function(){
        var _this = this;
        function abort(){
            _this.abort();
        };
        this.wait = window.setTimeout(abort, this.waitTime);
        this.ajax.open(this.method, this.url);
        this.ajax.send(this.body);
        return this;
    },

    /**
     * Abort request.
     * @alias jsxAjax.Common.abort
     */
    abort: function(){
        if (!this.ajax){
          return;
        }
        this.ajax.abort();
        if (typeof(this.error) == 'function'){
            this.error('Failed to connect, timeout limit.', this.trace);
        }
    },

    /* Private methods */

    /**
     * Prepare all listeners.
     * @alias jsxAjax.Common._prepareAjax
     * @private
     */
    _prepareAjax: function(){
        var _this = this;
        this.ajax.onreadystatechange = function(){
            _this._onreadystatechange();
        }
    },

    /**
     * Check readystatechange and do actions if needed.
     * @alias jsxAjax.Common._onreadystatechange
     * @private
     */
    _onreadystatechange: function(){
        if (this.ajax.readyState != 4){
            return;
        }
        if (this.wait){
            window.clearTimeout(this.wait);
            this.wait = null;
        }
        if (typeof(this.response) == 'function'){
            this.response(this.ajax.responseText, this.trace);
        }
        // cleanup
        this.ajax = null;
    },

    /**
     * Check ajax creation.
     * @alias jsxAjax.Common._checkCreation
     * @param {Object} ajax
     * @param {Function} responseSuccess
     * @param {Function} responseError
     * @private
     */
    _checkCreation: function(ajax, responseSuccess, responseError){
        try{
            if (ajax.open && ajax.send && ajax.onreadystatechange){
                this.ajax = ajax;
            }else{
                throw '';
            }
        }catch(e){
            throw 'Ajax object is not defined';
        }
        try{
            if (typeof(responseSuccess) == 'function'){
                this.response = responseSuccess;
            }else{
                throw 'Function for success response is not defined';
            }
        }catch(e){
            throw e;
        }
        if (typeof(responseError) == 'function'){
            this.error = responseError;
        }else{
            this.error = jsx.Vars.NULL;
        }
    }
};

jsx.loaded('{jsxAjax}.Common');