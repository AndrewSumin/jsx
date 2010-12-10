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
      };
      return result.join('&');
    }
    
};
jsx.loaded('Utils');
