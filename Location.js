/**
 * Object for works with Location.
 */
jsx.Location = new function(){
	/**
	 * This method returns right delimiter ("?" or "&amp;") for next url param.
	 * @param {String} URL.
	 * @return {String} Delimiter ("?" or "&amp;").
	 */

    // TODO: like places where I use it and use getDelimiter
    this.getDelimiter = function(url){
        var delimiter = '?';
        if ((url.indexOf('?') != -1)){
            delimiter = (url.lastIndexOf('?') == url.length - 1) ? '' : '&';
        }
        return delimiter;
    };

    /**
     * Returns parameter from search part of location.
     * @param {String} Parameter name.
     * @param {String} String like "http://foo.bar/?foo=bar&amp;bar=foo#foo" if empty gets window.location.search.
     * @return {String} Parameter value.
     */
    this.getParam = function(name, location){
        location = location || window.location.search;
        var params = location.match(new RegExp(name + '=[^&^$]*', 'ig'));
        if (!params || !params.length){
            return null;
        }
        for (var i = 0, l = params.length; i < l; i++){
          params[i] = params[i].replace(new RegExp(name + '=', ''), '');
        }
        return params.length == 1 ? params[0] : params;
    };

    this.setParam = function(name, value,  location){
        location = location || window.location.search;
        if (this.getParam(name, location)){
          location = location.replace(new RegExp(name + '=[^&^$]*', 'ig'), name + '=' + value);
        }else{
          location = location + this.getDelimiter(location) + name + '=' + encodeURIComponent(value);
        }
        return location;
    };

    /**
     * Return parameter the part of the URL that follows the # symbol.
     * @param {String} Parameter name.
     * @param {String} Sstring like "http://foo.bar/?foo=bar&amp;bar=foo#foo" if empty gets window.location.search.
     * @return {String} Hash.
     */
    this.getHash = function(location){
        location = location || window.location.hash;
        var hash = location.match(new RegExp('\#.*$', 'ig'));
        return hash && hash.length ? hash[0].replace('#', '') : '';
    };
}
jsx.loaded('Location');