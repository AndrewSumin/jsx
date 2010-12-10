jsx.require(['Events', '{jsxComponents}.Calendar', 'CallBacks', 'Dates'], function(){
  jsxComponents.Calendar.Inputs = new function(){
    jsx.Links.createLink({href: jsx.ConstructURL.construct('{jsxComponents}.Calendar.inputsstyle', 'css')});
    this.init = function(element, params){
      new jsxComponents.Calendar.Inputs.Constructor(element, params);
    };
  };
  
  jsxComponents.Calendar.Inputs.Constructor = function(element, params){
    this.element = element;
    this.inputsContainer = jsx.Dom.getElementBySelector(this.element, '.jsxComponents-Calendar-Inputs');
    this.text = jsx.Dom.getElementBySelector(this.element, '.jsxComponents-Calendar-Inputs-Text');
    this.date = jsx.Dom.getElementBySelector(this.element, '.jsxComponents-Calendar-Inputs-Date');
    this.month = jsx.Dom.getElementBySelector(this.element, '.jsxComponents-Calendar-Inputs-Month');
    this.year = jsx.Dom.getElementBySelector(this.element, '.jsxComponents-Calendar-Inputs-Year');
    this.hidden = jsx.Dom.getElementBySelector(this.element, '.jsxComponents-Calendar-Inputs-Hidden') || {};
    this.saveHidden = jsx.Dom.getElementBySelector(this.element, '.jsxComponents-Calendar-Inputs-Save') || {};
    this.button = jsx.Dom.getElementBySelector(this.element, '.jsxComponents-Calendar-Inputs-Button') || this.emulateButton();
    this.init(params || {});
    element = null;
  };
  
  jsxComponents.Calendar.Inputs.Constructor.prototype = new function(){
    this.init = function(params){
      this.format = params.format || '%Y.%m.%e';
      this.textDateFormat = params.textDateFormat || '%e %B %Y';
      params.date = params.date || this.getDate() || new Date();
      this.createCalendarContainer();
      this.createCalendar(params);
      this.fillInputsAndText();
      this.addEvents();
      jsx.Dom.removeClassName(this.button, 'g-hidden');
      jsx.Dom.addClassName(this.inputsContainer, 'g-hidden');
      this.dispatchDate();
    };
    this.emulateButton = function(){
      jsx.Dom.addClassName(this.text, 'b-jsxComponents-calendarInputs-clickedText');
      return this.text;
    };
    this.createCalendarContainer = function(){
      this.calendarContainer = document.createElement('div');
      jsx.Dom.addClassName(this.element, 'b-jsxComponents-calendarInputs');
      jsx.Dom.addClassName(this.calendarContainer, 'b-jsxComponents-calendar');
      jsx.Dom.addClassName(this.calendarContainer, 'b-jsxComponents-calendarInputs-popup');
      jsx.Dom.addClassName(this.calendarContainer, 'g-hidden');
      this.element.appendChild(this.calendarContainer);
      this.calendarIframe = document.createElement('iframe');
      jsx.Dom.addClassName(this.calendarIframe, 'b-jsxComponents-iframe');
      this.calendarIframe.frameBorder = 'no';
      this.calendarContainer.appendChild(this.calendarIframe);      
    };
    this.createCalendar = function(params){
      this.calendar = jsxComponents.Calendar.init(this.calendarContainer, params);
      this.createProxyEvent('jsxComponents-Calendar-ChangeYear');
      this.createProxyEvent('jsxComponents-Calendar-ChangeMonth');
      this.createProxyEvent('jsxComponents-Calendar-ClickDate');
      this.createProxyEvent('jsxComponents-Calendar-ChangeDate');
      this.createProxyEvent('jsxComponents-Calendar-AfterChangeYear');
      this.createProxyEvent('jsxComponents-Calendar-AfterChangeMonth');
    };
    this.createProxyEvent = function(name){
      jsx.CallBacks.add(name, jsx.bind(this, this.proxyEvent, name), this.calendarContainer);
    };
    this.proxyEvent = function(name, event){
      jsx.CallBacks.dispatch(name, this.element, event);
    }
    this.setPosition = function(){
      var offset = jsx.Dom.offset(this.element);
      this.calendarContainer.style.left = offset.left + 'px';
      this.calendarContainer.style.top = offset.top + this.element.offsetHeight + 'px';
    };
    this.fillInputsAndText = function(){
      var date = new Date();
      if (!this.date.value){
        this.date.value = date.getDate();
      }else{
        date.setDate(this.date.value);
      }
      if (!this.month.value){
        this.month.value = date.getMonth() + 1;
      }else{
        date.setMonth(this.month.value - 1);
      }
      if (!this.year.value){
        this.year.value = date.getFullYear();
      }else{
        date.setFullYear(this.year.value);
      }
      this.setText(date);
    };
    this.setText = function(date){
      this.text.innerHTML = this.calendar.dates.toFormat(date, this.textDateFormat);
    };
    this.getDate = function(){
      var date = new Date();
      if (parseInt(this.month.value, 10)){
        date.setMonth(parseInt(this.month.value, 10) - 1);
      }
      if (parseInt(this.date.value, 10)){
        date.setDate(parseInt(this.date.value, 10));
      }
      if (parseInt(this.year.value, 10)){
       date.setFullYear(parseInt(this.year.value, 10));
      }
      if (this.hidden.value){
        date = new Date(this.hidden.value);
      }
      return date;
    };
    this.setDate = function(date){
      this.date.value = date.getDate();
      this.month.value = date.getMonth() + 1;
      this.year.value = date.getFullYear();
      this.hidden.value = date.toString();
      this.saveHidden.value = jsx.Dates.toFormat(date, this.format);
      this.setText(date);
      jsx.CallBacks.dispatch('jsxComponents-Calendar-Inputs-ChangeDate', this.element, date);
      this.close();
    };
    this.dispatchDate = function(){
      //jsx.CallBacks.dispatch('jsxComponents-Calendar-Inputs-ChangeDate', this.element, this.getDate());
      this.setDate(this.getDate());
    };
    this.addEvents = function(){
      jsx.Events.observe(this.button, 'click', jsx.bind(this, this.toggle));
      jsx.CallBacks.add('jsxComponents-Calendar-Inputs-DispatchDate', jsx.bind(this, this.dispatchDate), this.element);
      
      jsx.CallBacks.add('jsxComponents-Calendar-ChangeMonth', jsx.bind(this, this.changeMonthOrYear), this.calendarContainer);
      jsx.CallBacks.add('jsxComponents-Calendar-AfterChangeMonth', jsx.bind(this, this.afterChangeMonthOrYear), this.calendarContainer);
      jsx.CallBacks.add('jsxComponents-Calendar-ChangeYear', jsx.bind(this, this.changeMonthOrYear), this.calendarContainer);
      jsx.CallBacks.add('jsxComponents-Calendar-AfterChangeYear', jsx.bind(this, this.afterChangeMonthOrYear), this.calendarContainer);      
      this.changeDateEvent = jsx.CallBacks.add('jsxComponents-Calendar-ClickDate', jsx.bind(this, this.setDate), this.calendarContainer);

      this.closeClick = jsx.Events.observe(document.body, 'click', jsx.bind(this, this.closeClick));
      this.closeClick.stop();      
    };
    this.changeMonth = function(){
      this.changeDateEvent.stop();
    };
    this.changeMonthOrYear = jsx.Vars.NULL;
    this.afterChangeMonthOrYear = function(){
      this.changeDateEvent.start();
    };
    this.close = function(){
      this.calendar.close();
      this.closeClick.stop();
    };
    this.toggle = function(){
      //this.setPosition();
      var open = this.calendar.toggle(this.getDate());
      if (open){
        window.setTimeout(jsx.bind(this.closeClick, this.closeClick.start), 0);
      }else{
        this.closeClick.stop();
      }       
    };
    this.closeClick = function(e){
      if (!jsx.Dom.descendantOf(jsx.Events.element(e), this.element)){
        this.close();
      }
    };    
    this.garbageCollector = function(){
      this.element = null;
    };
  };
  
  jsx.loaded('{jsxComponents}.Calendar.Inputs');
});