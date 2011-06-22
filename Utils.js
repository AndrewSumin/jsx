/**
 * Some functions for uniqID
 */
jsx.Utils = {
    count: 0,
    /**
     * Generates unique string with prefix.
     * @param {String} Prefix.
     * @return {String} Uniq ID.
     */
    generateId: function (prefix){
          return (prefix || 'uid') + (this.count++);
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
     * Remove unique ID for DOM node.
     * @param {Object} DOM node.
     */
    removeUniqueId: function(object){
        try {
            object.uniqueID = null;
        } catch (e) {}
    },

    /**
     * Compares two links DOM nodes.
     * @param {Object} DOM node.
     * @param {Object} DOM node.
     */
    isEqual: function(first, second){
        return (this.getUniqueId(first) == this.getUniqueId(second));
    },
    
    /**
     * LOL
     */
    toQueryString: function(obj) {
      var result = [];
      for (i in obj) {
          var key = encodeURIComponent(i), value = obj[i];
          result.push(key+'='+value);
      }
      return result.join('&');
    },

    hash2hash: function (thisObject, callback) {
        thisObject = thisObject || window;
        var i, map = {}, current;
        for (i in thisObject) {
            if(Object.prototype.hasOwnProperty.call(thisObject, i)){
                current = callback(i, thisObject[i]);
                map[current[0]] = current[1];
            }
        }
        return map;
    },

    hash2array: function (thisObject, callback) {
        thisObject = thisObject || window;
        var i, map = [];
        for (i in thisObject) {
            if(Object.prototype.hasOwnProperty.call(thisObject, i)){
                map.push(callback(i, thisObject[i]));
            }
        }
        return map;
    },

    forEach: function (thisObject, callback) {
        thisObject = thisObject || window;
        var i;
        for (i in thisObject) {
            if(Object.prototype.hasOwnProperty.call(thisObject, i)){
                callback(i, thisObject[i]);
            }
        }
    },


    keys: function (thisObject) {
        var i, map = [];
        for (i in thisObject) {
            if(Object.prototype.hasOwnProperty.call(thisObject, i)){
                map.push(i);
            }
        }
        return map;
    },

    values: function (thisObject) {
        var i, map = [];
        for (i in thisObject) {
            if(Object.prototype.hasOwnProperty.call(thisObject, i)){
                map.push(thisObject[i]);
            }
        }
        return map;
    },

    contains: function (value, list) {
        if ( typeof list != 'string' && !jsx.isArray(list)) {
            return false;
        }
        return (list).indexOf(value) != -1;
    }
};
jsx.loaded('Utils');
