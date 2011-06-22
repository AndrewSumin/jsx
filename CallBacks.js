/**
 * This object allows you to make soft links between objects (any objects DOM node or JS).
 */

jsx.CallBacks = new function () {
    this.srcload = false;
    this.listeners = {};
    this.eventHistory = {};
    this.readyComponents = [];
    this.neededComponents = [];

    /**
     * Returns object id.
     * @param {Object} DOM node or string "*"
     * @return {String} DOM node id or "*"
     * @private
     */
    this.getId = function(object) {
        return (object === '*' ? '*' : jsx.Utils.getUniqueId(object));
    };

    /**
     * Allows to listen for object event.
     * @param {String} Type of event.
     * @param {Function} Listener for event.
     * @param {Object} Which object to listen.
     * @param {Boolean} Start listen immediately by default is "true".
     * @param {Object} This object will be in "this" variable for listener, not obligatory.
     * @return {Object} Listener jsx.CallBacks.Listener.
     */
    this.add = function (type, listener, object, execute) {
        object = object || this;
        var id = this.getId(object);

        if (id == this.uniqueID && type == 'srcload' && this.srcload) {
            this.execListener(listener);
        }

        var key = id + type;
        if (typeof(this.listeners[key]) == 'undefined') {
            this.listeners[key] = [];
        }
        var listeners = this.listeners[key];

        var result = (listeners[listeners.length] = new jsx.CallBacks.Listener(listener, execute, key));

        this.execHistory(id, type);

        return result;
    };

    /**
     * Allows to dispatch object event.
     * @param {String} Type of event.
     * @param {Object} Object that is dispatch event.
     * @param {Object} Event object, any data for listeners.
     */
    this._dispatch = function(type, object, event, query) {
        object = object || this;
        var id = this.getId(object);

        query = query || 0;

        if (id == this.uniqueID && type == 'srcload' && !this.srcload && !this.srcLoad()) {
            return;
        }

        this.execListeners(id + type, event);
        this.execListeners('*' + type, event);
        this.execListeners(id + '*', event);
        this.execListeners('*' + '*', event);


        // add event to history
        var key = id + type;

        if (typeof(this.eventHistory[key]) == 'undefined') {
            this.eventHistory[key] = [];
        }

        this.eventHistory[key].push(event);
        if (this.eventHistory[key].length > query) {
            this.eventHistory[key].shift();
        }
    };

    if (jsx.Vars.DEBUG) {
        this.dispatch = function (type, object, event, query) {
            jsx.Console.group('Type: ', type + ', object: ', object, ['CallBacks', type]);
            this._dispatch(type, object, event, query);
            jsx.Console.groupEnd();
        };
    } else {
        this.dispatch = this._dispatch;
    }

    this.execHistory = function(id, type) {
        var key = id + type;
        if (this.eventHistory[key]) {
            this.eventHistory[key].forEach(jsx.bind(this, this.execListeners, key));
        }
        if (id === '*'){
            for (var i in this.eventHistory){
                // try to find events with type in keys on the end of key
                if (type == i.substr(i.length - type.length)){
                    this.eventHistory[i].forEach(jsx.bind(this, this.execListeners, key));
                }
            }
        }
    };

    /**
     * Runs list of listeners by key.
     * @param {String} Object id (from jsx.CallBacks.getId method).
     * @param {String} Type of event.
     * @param {Object} Event object, any data for listeners.
     * @private
     */
    this.execListeners = function (key, event) {
        var i, l;
        var listeners = this.listeners[key];
        if (typeof(listeners) == 'undefined') {
            return;
        }
        // create local copy of array
        var listenersCopy = [];
        for (i = 0, l = listeners.length; i < l; i++) {
            listenersCopy[i] = listeners[i];
        }
        for (i = 0, l = listenersCopy.length; i < l; i++) {
            var listener = listenersCopy[i];
            // if don't need to execute execute == false, if deleted execute == null
            if (listener.execute) {
                this.execListener(listener.listener, event);
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
    this.execListener = function (listener, event) {
        listener(event);
    };

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
    this.srcLoad = function() {
        var _this = this;
        if (!jsx.Vars.is_ie || document.readyState == 'interactive' || document.readyState == 'complete') {
            return srcLoaded();
        }

        function srcLoaded() {
            return (_this.srcload = true);
        }

        function srcLoad() {
            if (document.readyState == 'interactive' || document.readyState == 'complete') {
                srcLoaded();
                _this.dispatch('srcload');
            }
        }

        document.onreadystatechange = srcLoad;
        return false;
    };

    /*
     A component says that he is ready
     */
    this.ready = function(obj) {
        var c = {};
        c.name = obj.__name;
        c.data = obj || false;
        this.readyComponents.push(c);
        this.checkNeeded();
    };

    /*
     A component says that he needs to know when another component(s) is ready
     */
    this.need = function(which, listener, who) {
        for (var i = 0; i < which.length; i++) {
            var n = {};
            n.name = which[i];
            n.listener = listener;
            n.called = [];
            n.who = who.__name;
            this.neededComponents.push(n);
        }
    };

    /*
     Check if needed components are ready and fire corresponding listeners
     */
    this.checkNeeded = function() {

        if (!this.neededComponents.length)
            return;

        for (var n = 0, ln = this.neededComponents.length; n < ln; n++) {
            for (var r = 0, lr = this.readyComponents.length; r < lr; r++) {
                if (this.neededComponents[n].name == this.readyComponents[r].name) {
                    var requester = this.neededComponents[n];
                    var requested = this.readyComponents[r];
                    if (requester.called.indexOf(r) == -1) {
                        requester.listener(requested.name, requested.data);
                        requester.called.push(r);
                    }
                }
            }
        }
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
     * Starts listening for event.
     */
    start: function () {
        this.execute = true;
    },

    /**
     * Stops listening for event.
     */
    stop: function () {
        this.execute = false;
    },

    remove: function() {
        jsx.CallBacks.remove(this);
    }
};
jsx.require(['Utils'], jsx.bind(jsx, jsx.loaded, 'CallBacks'));
