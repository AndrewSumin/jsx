jsx.Styles = new function (){
    this.styles = [];
    this.createStyle = function (href, charset){
      this.styles[href] = this.styles[href] || this._createStyle(href, charset);
    };
    this._createStyle = function (charset, src) {
        var style = document.createElement('link');
        style.setAttribute('rel', 'stylesheet');
        style.setAttribute('type', 'text/css');
        if (charset){
            style.setAttribute('charset', charset);
        }
        style.setAttribute('href', src);
        // InsertBefore for IE.
        // If head is not closed and use appendChild IE crashes.
        container.insertBefore(style, document.getElementsByTagName('head').item(0).firstChild);
    }
};

jsx.loaded('Styles');