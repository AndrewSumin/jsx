if(!jsx){
  var jsx = {loaded:function(){}};
}
/**
 * Get, set and delete cookies methods.
 */
jsx.Cookies = new function(){

    /**
     * Set cookie.
     * @param {String} Name.
     * @param {String} Value.
     * @param {Date} Expire.
     */
    this.set = function(name, value, time){

      var cookie = name + '=' + (value || '') + ';path=/';

      // set expire time if defined
      if (typeof(time) != 'undefined') {
          var expire = new Date();

          // set expire time
          expire.setTime(expire.getTime() + time * 3600000);
          cookie += ';expires=' + expire.toGMTString();
      }

      // save cookie
      document.cookie = cookie;
    };

    /**
     * Get cookie value.
     * @param {String} Name.
     * @return {String} Value.
     */
    this.get = function(name){
        var kukki = document.cookie;

        // like cookie entry
        var index = kukki.indexOf(name + '=');

        if (index == -1) {
            return null;
        }

        index = kukki.indexOf('=', index) + 1;
        var endstr = kukki.indexOf(';', index);
        if (endstr == -1) {
            endstr = kukki.length;
        }

        return decodeURIComponent(kukki.substring(index, endstr));
    };

    /**
     * Returns an array of all cookies
     */
    this.getAll = function() {
      var cookies = [];
      var pairs = document.cookie.split(';');
      for (i in pairs) {
        var pair = pairs[i];
        var cookie = {
          'name':pair.split('=')[0].replace(' ',''),
          'value':pair.split('=')[1]
        };
        cookies.push(cookie);
      }
      return cookies;
    };

    /**
     * Delete cookie.
     * @param {String} Name.
     */
    this.del = function(name){

        this.set(name,'',-1);
        /*
        var expire = new Date();

        // set expire time to one year later
        expire.setTime(expire.getTime() - 3600000 * 24 * 365);

        // save cookie
        document.cookie = name + '=' + 'value=;expires=' + expire.toGMTString() + ';path=/';
        */
    };
};

jsx.loaded('Cookies');