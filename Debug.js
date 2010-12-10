jsx.require(['Location', 'Cookies'], function(){

    var filter = jsx.Location.getParam('jsxdebug') || jsx.Cookies.get('jsxdebug') || jsx.DebugMode || 'off';
    if (filter == 'off'){
        jsx.Cookies.del('jsxdebug');
        jsx.loaded('Debug');
        return;
    }

    jsx.Cookies.set('jsxdebug', filter);

    /**
     * Provides firebug interface for Firefox if firebug is installed
     * and do nothing for all other cases.
     */
    if (typeof(console) != 'undefined'){
        function constructor(filter){
            this.PLUS = '';     // sign of anabled tag
            this.MINUS = '-';   // sign of disabled tag
            this.NONE = 'none'; // tag is not present in filter
            this.DELIM = '|';   // delimeter
            this.METHODS = 'info'+ this.DELIM +'log'+ this.DELIM +'warn'+ this.DELIM +'error'+ this.DELIM +'dir'+ this.DELIM +'dirxml' + this.DELIM +'group' + this.DELIM +'groupEnd'; // methods of object console

            this.filter = function(tags){
                var access = true;
                if (!tags){
                    return access;
                }
                if (this.allowTags.length > 0){
                    access = false;
                    for (var i = 0, l = tags.length; i < l; i++){
                        var tag = tags[i];
                        if (this.allowTags.indexOf(tag) != -1){
                            access = true;
                            break;
                        }
                    }
                }
                if (this.denyTags.length > 0){
                    for (var i = 0, l = tags.length; i < l; i++){
                        var tag = tags[i];
                        if (this.denyTags.indexOf(tag) != -1){
                            access = false;
                            break;
                        }
                    };
                }
                return access;
            };

            this.findTagInFilter = function(filter, tag){
                var result = this.NONE;
                if (filter.indexOf(this.PLUS + tag) != -1){
                    result = this.PLUS;
                }
                if (filter.indexOf(this.MINUS + tag) != -1){
                    result = this.MINUS;
                }
                return result;
            };

            this.clearFilterFromMethods = function(filter){
                var methods = this.METHODS.split(this.DELIM);
                for (var i = 0, l = methods.length; i < l; i++){
                    var re = new RegExp('[' + this.MINUS + this.PLUS + ']?' + methods[i], '');
                    filter = filter.replace(re, '');
                }
                return this.clearDELIMs(filter);
            };

            this.clearDELIMs = function(string){
                var re = new RegExp('\\' + this.DELIM + '\\' + this.DELIM, 'g');
                string = string.replace(re, this.DELIM);
                var re = new RegExp('\\' + this.DELIM + '$', 'g');
                string = string.replace(re, '');
                var re = new RegExp('^\\' + this.DELIM , 'g');
                string = string.replace(re, '');
                return string;
            };

            this.findEnabledMethods = function(filter){
                var methods = this.METHODS.split(this.DELIM);
                var enabled = [], disabled= [];
                for (var i = 0, l = methods.length; i < l; i++){
                    var method = methods[i];
                    var fmethod = this.findTagInFilter(filter, method);
                    if (fmethod == this.PLUS){
                        enabled[enabled.length] = method;
                    }
                    if (fmethod == this.MINUS){
                        disabled[disabled.length] = method;
                    }
                }
                if (enabled.length){
                    methods = enabled;
                }else if(disabled.length){
                    methods = this.DELIM + methods.join(this.DELIM);
                    for (var i = 0, l = disabled.length; i < l; i++){
                        var re = new RegExp('\\'+ this.DELIM + disabled[i], '');
                        methods = methods.replace(re, '');
                    }
                    return methods.substr(this.DELIM.length);
                }
                return methods.join(this.DELIM);
            };

            this.getAllowDenyList = function(filter){
                var allow = [];
                var deny = [];
                if (filter.length == 0){
                    return [allow, deny];
                };
                var tags = filter.split(this.DELIM);
                for (var i = 0, l = tags.length; i < l; i++){
                    var tag = tags[i];
                    if (tag.substr(0, this.MINUS.length) == this.MINUS){
                        deny[deny.length] = tag.substr(this.MINUS.length);
                        continue;
                    }
                    allow[allow.length] = tag.substr(this.PLUS.length);
                }
                return [allow, deny];
            };

            this.doMethod = function(method){
                function doMethod (/*message [, message [, ...]],  tags*/) {
                    var tags = arguments[arguments.length - 1];
                    if (!this.filter(tags)){
                        return;
                    }

                    var args = [];
                    for (var i = 0, l = arguments.length - 1; i < l; i++){
                        args[args.length] = arguments[i];
                    }
                    method = typeof console[method] == 'function' ? method : 'log';
                    console[method].apply(console, args);
                }
                return doMethod;
            };

            this.init = function(filter){
                this.enableMethods = this.DELIM + this.findEnabledMethods(filter) + this.DELIM;
                filter = (filter == 'all' || filter == 'on' || filter == 'yes' ? '' : filter);
                filter = this.clearFilterFromMethods(filter);
                var allowDenyTags = this.getAllowDenyList(filter);
                this.allowTags = allowDenyTags[0];
                this.denyTags = allowDenyTags[1];

                var methods = this.METHODS.split(this.DELIM);
                function doMethod(){
                }
                for (var i = 0, l = methods.length; i < l; i++){
                    var method = methods[i];
                    if (this.enableMethods.indexOf(this.DELIM + method + this.DELIM) != -1){
                        this[method] = this.doMethod(method);
                    }else{
                        this[method] = jsx.Vars.NULL;
                    }
                }
            };

            this.init(filter);
        };
        constructor.prototype = console;
        jsx.Console = new constructor(filter);
        console.warn('Debug mode! filter: ', filter);
    }


    /**
     * Sends JavaScript errors to jsx.Console.
     */
    jsx.Debug = new function() {
        function fnErrorTrap(sMsg, sUrl, sLine) {
            var str  = 'Error:\t' + sMsg + '\n';
                str += 'Line:\t' + sLine + '\n';
                str += 'URL:\t' + sUrl + '\n';

            jsx.Console.error('%1.o', str, ['jsx']);
            return false;//false;
        }

        //window.onerror = fnErrorTrap;
    };

    jsx.Vars.DEBUG = true;

    jsx.loaded('Debug');
});
