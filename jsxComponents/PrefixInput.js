jsx.Components.buildComponent('{jsxComponents}.PrefixInput',
    function() {
        this.init = function(element, params) {
            this.element = element;
            this.prefix = params.prefix;
            this.cssclass = params.cssclass || 'undefined';
            jsx.Events.observe(this.element, 'focus', jsx.bind(this, this.onfocus));
            jsx.Events.observe(this.element, 'blur', jsx.bind(this, this.onblur));
            this.check();
            jsx.Events.observe(this.element, 'keypress', jsx.bind(this, this.doCheck));
        };

        this.onfocus = function(){
            this.isfocus = true;
        };

        this.onblur = function(){
            this.isfocus = false;
        };

        this.doCheck = function(e){
            if (this.element.value.indexOf(this.prefix) != 0) {
                if (e) {jsx.Events.stop(e)};
                this.element.value = this.prefix;
            }
            if (this.element.value == this.prefix && !this.isfocus){
                jsx.Dom.addClassName(this.element,this.cssclass);
            } else {
                jsx.Dom.removeClassName(this.element,this.cssclass);
            }
        }

        this.check = function(){
            if (this.timer){
                window.clearTimeout(this.timer);
            }
            this.doCheck();
            this.timer = window.setTimeout(jsx.bind(this, this.check), 100);
        };
    },
    ['Dom', 'Events']
);
