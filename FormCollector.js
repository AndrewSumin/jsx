/**
 * Allows to collect form fields to request string like "foo=bar&amp;bar=foo".
 * @alias jsx.FormCollector
 */
jsx.FormCollector = new function(){

    this.formTags = ['input', 'textarea', 'select'];

    this.createParam = function(name, value){
      return name + '=' + encodeURIComponent(value);
    };

    /**
     * Collects form fields to request string like "foo=bar&amp;bar=foo".
     * @alias jsx.FormCollector.collectTags
     * @param {Object} DOM node (usually form).
     * @return {String} String like "foo=bar&amp;bar=foo".
     */
    this.collectTags = function(tags, json){
      return this.getTagsValue(jsx.isArray(tags) ? tags : this.getDefaultTags(tags), json);
    };
    
    this.getDefaultTags = function(container){
      var tags = [];
      for (var i = 0, l = this.formTags.length; i < l; i++){
        tags = tags.concat(jsx.toArray(container.getElementsByTagName(this.formTags[i])).filter(this.notButton));
      }
      return tags;
    };

    this.notButton = function(tag){
      return !(tag.type && (tag.type == 'button' || tag.type == 'submit'));
    };

    /**
     * Collects fields with tag name and value and return string like "foo=bar&amp;bar=foo".
     * @alias jsx.FormCollector.getTagsValue
     * @param {Object} DOM node (usually form).
     * @param {String} Tag name.
     * @return {String} String like "foo=bar&amp;bar=foo".
     */
    this.getTagsValue = function(elements, json){
        //var elements = jsx.toArray(container.getElementsByTagName(tag));
        var len = elements.length;
        var body = [];
        for(var i = 0; i < len; i++){
            var element = elements[i];
            if (element.disabled || !element.name.length){
                continue;
            }
            switch (element.tagName.toLowerCase()){
                case 'input':
                case 'textarea':
                    var param = this.getInputValue(element);
                    if (param) {
                        body.push(param);
                    }
                    break;
                case 'select':
                    if(element.selectedIndex < 0){
                        continue;
                    }
                    if(element.multiple){
                        for(var j = 0, lj = element.options.length; j < lj; j++){
                            if (element.options[j].selected){
                                body.push(this.createParam(element.name, element.options[j].value));
                            }
                        }
                    } else {
                        body.push(this.createParam(element.name, element.options[element.selectedIndex].value));
                    }
                    break;
            }
        }
        return json ? this.tojson(body) : body.join('&');
    };
    
    this.tojson = function(body){
      var json = {};
      for (var i = 0, l = body.length; i < l ; i++){
        var param = body[i].split('=');
        json[param[0]] = param[1];
      }
      return json;
    };

    /**
     * Converts element name and value to string like "foo=bar".
     * @alias jsx.FormCollector.getInputValue
     * @param {Object} DOM node.
     * @return {String} String like "foo=bar".
     */
    this.getInputValue = function(element){
        switch (element.type){
            case 'radio':
            case 'checkbox':
                if (element.checked){
                    return this.createParam(element.name, element.value);
                }
                break;
            default :
                return this.createParam(element.name, element.value);
        }
        return '';
    };

    /**
     * Collects tags from DOM node children.
     * @alias jsx.FormCollector.getTagsArray
     * @param {Object} DOM node.
     * @return {Arrya} Array of DOM nodes.
     */
    this.getTagsArray = function(container) {
        var result = [];
        for(var i = 0, li = this.formTags.length; i < li; i++){
            var elements = container.getElementsByTagName(this.formTags[i]);
            for (var j = 0, lj = elements.length; j < lj; j++){
                result[result.length] = elements[j];
            }
        }
        return result;
    };
};

jsx.loaded('FormCollector');
