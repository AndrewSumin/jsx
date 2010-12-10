jsxAjax.XmlHttp = {};
if (jsx.base == 'prototype'){
  jsxAjax.XmlHttp.Request = Ajax.Request;
}else if (jsx.base == 'jquery'){
  jsxAjax.XmlHttp.Request = function(url, options){
    jQuery.ajax({
        url: url,
        data: options.parameters,
        type: options.method,
        dataType: 'text',
        success: function (data) {
            ( options.onSuccess || jsx.Vars.NULL ) ({responseText: data});
        },
        error: function (XMLHttpRequest) {
            ( options.onFailure || jsx.Vars.NULL ) ({request:XMLHttpRequest});
        },
        async: options.async || true
    });
  };
}else{
  jsxAjax.XmlHttp.Request = function (url, params){
    this.synch = params.synch || false;
    this.readyState = 0;
    this.responseText = '';
    this._createAjaxObject();
    this.onSuccess = params.onSuccess;
    var method = params.method || 'GET';
    url += method.toUpperCase() == 'GET' ? '?' + this._toQuery(params.parameters) : '';
    this.open(method, url);
    this.send(this._toQuery(params.parameters) || null);
  };

  jsxAjax.XmlHttp.Request.prototype = {
      /* Constants */
      GET: 'GET',
      POST: 'POST',

      /* Public methods */

      open: function(method, url){
          if (!this.ajax){
              return;
          }
          this.ajax.open(method, url, !this.synch);
          if (method.toUpperCase() == this.POST){
              this.ajax.setRequestHeader('Content-Type', 'application/x-www-form-urlencoded');
              this.ajax.setRequestHeader('Connection', 'close');
          }
      },

      send: function(body){
          if (!this.ajax){
              return;
          }
          try{
              this.ajax.send(body);
              if (this.synch){
                  this.responseText = this.ajax.responseText;
              }
          }catch(e){}
      },

      abort: function(){
          if (!this.ajax){
              return;
          }
          this.ajax.abort();
      },

      /* Private methods */

     _toQuery:function(object){
       if (typeof object === 'string'){
         return object;
       }
       var result = [];
       for (i in object){
         result.push(i + '=' + encodeURIComponent(object[i]));
       }
       return result.join('&');
     },

      _onreadystatechange: function(){
          this.readyState = this.ajax.readyState;
          if (this.readyState == 4){
              this.responseText = this.ajax.responseText;
              (this.onSuccess || jsx.VARS.NULL)({responseText: this.responseText});
          }
          return false;
      },

      _createAjaxObject: function(){
          this.ajax = this._getAjaxObject();
          if (!this.ajax){
              return null;
          }
          var _this = this;
          this.ajax.onreadystatechange = function(){
              _this._onreadystatechange();
          };
          return true;
      },

      _getAjaxObject: function(){
          try{
              return new XMLHttpRequest();
          }catch(e){
              var objects = ['MSXML2.XMLHTTP.5.0','MSXML2.XMLHTTP.4.0','MSXML2.XMLHTTP.3.0','MSXML2.XMLHTTP','Microsoft.XMLHTTP'];
              for(var i = 0; i < objects.length; i++){
                  try{
                      return new ActiveXObject(objects[i]);
                  }catch(e){
                      continue;
                  }
              }
              return false;
          }
      }
  };
}

jsx.loaded('{jsxAjax}.XmlHttp');