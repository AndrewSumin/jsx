jsxComponents.Calendar = new function(){
    jsx.Links.createLink({href: jsx.ConstructURL.construct('{jsxComponents}.Calendar.style', 'css')});
    this.init = function(element, params){
        return new jsxComponents.Calendar.Constructor(element, params);
    };
};

jsxComponents.Calendar.Constructor = function(element, params){
    this.element = element;
    this.dates = this.createDates(params.lang);
    this.init();
    this.beginFrom = params.beginFrom || null;
    this.endTo = params.endTo || null;
    this.date = (params.date || new Date());
    this.selectedDate = this.date;
    this.draw(this.date);
    jsx.CallBacks.dispatch('jsxComponents-Calendar-Init', this.element, this.selectedDate);
    element = null;
};

jsxComponents.Calendar.Constructor.prototype = new function(){
    this.init = function(){
      this.drawHeaderAndBody();
      jsx.Dom.addClassName(this.element, 'b-jsxComponents-calendar');  
      jsx.Events.observe(this.element, 'click', jsx.bind(this, this.onClick));
      jsx.CallBacks.add('jsxComponents-Calendar-Dispatch', jsx.bind(this, this.dispatch), this.element);
      jsx.CallBacks.add('jsxComponents-Calendar-Set', jsx.bind(this, this.setDate), this.element);
    };
    
    this.setDate = function(date){
      this.date = date;
      this.selectedDate = this.date;
      this.draw(this.date);
      this.dispatch();
    };
    
    this.createDates = function(lang){
      function dates(lang){
        if (lang){
          this.lang = lang;
        }
        if (lang == 'en'){
          this.firstDay = 'Sunday';
        }
      }
      dates.prototype = jsx.Dates;
      return new dates(lang);
    };
    
    this.open = function(date){
      if (date instanceof Date && this.dates.getDays(this.date) != this.dates.getDays(date)){
        this.selectedDate = date;
        this.draw(date);
      }
      jsx.Dom.removeClassName(this.element, 'g-hidden');
    };

    this.close = function(){
      jsx.Dom.addClassName(this.element, 'g-hidden');
    };
    
    this.toggle = function(date){
      if (jsx.Dom.hasClassName(this.element, 'g-hidden')){
        this.open(date);
        return true;
      }else{
        this.close();
        return false;
      }
    };
    
    this.onClick = function(event){
      jsx.Events.stop(event);
      var dateStr = jsx.Events.element(event).getAttribute('abbr');
      if (!dateStr || dateStr.length == 0){
        return;
      }
      var date = new Date(dateStr);
      if(this.date.getYear() != date.getYear()){
        var yearChanged = true;
        jsx.CallBacks.dispatch('jsxComponents-Calendar-ChangeYear', this.element, date);
      }      
      if(this.date.getMonth() != date.getMonth()){
        var monthChanged = true;
        jsx.CallBacks.dispatch('jsxComponents-Calendar-ChangeMonth', this.element, date);
      }
      if (!monthChanged && !yearChanged){
        jsx.CallBacks.dispatch('jsxComponents-Calendar-ClickDate', this.element, date);
      }
      if (!monthChanged && !yearChanged && this.dates.getDays(date) != this.dates.getDays(this.selectedDate)){
        this.selectedDate = date;
        this.dispatch();
      }
      if (this.dates.getDays(date) != this.dates.getDays(this.date)){
        this.draw(date);
      }
      if(yearChanged){
        jsx.CallBacks.dispatch('jsxComponents-Calendar-AfterChangeYear', this.element, date);
      }      
      if(monthChanged){
        jsx.CallBacks.dispatch('jsxComponents-Calendar-AfterChangeMonth', this.element, date);
      }
    };
    
    this.dispatch = function(){
      jsx.CallBacks.dispatch('jsxComponents-Calendar-ChangeDate', this.element, this.selectedDate);
    };
    
    this.drawHeaderAndBody = function(){
        var tmpDiv = document.createElement('div');
        var headerClass = 'b-jsxComponents-calendar-header';
        var bodyClass = 'b-jsxComponents-calendar-body';        
        tmpDiv.innerHTML = '<div class="' + headerClass + '"></div><div class="' + bodyClass + '">';

        this.header = jsx.Dom.getElementsBySelector(tmpDiv, '.' + headerClass)[0];
        this.body = jsx.Dom.getElementsBySelector(tmpDiv, '.' + bodyClass)[0];
        this.element.appendChild(this.header);
        this.element.appendChild(this.body);
    };
    this.draw = function(date){
        this.date = date;
        this.matrix = jsxComponents.Calendar.NumberDates.create(date, this.selectedDate, this.dates);
        this.result  = '<table class="b-jsxComponents-calendar-body-dates" cellpadding="0" cellspacing="0"><tbody>';
        jsx.toArray(this.matrix.dates).map(jsx.bind(this, this.drawWeek));
        this.result += '</tbody></table>';
        this.body.innerHTML = this.result;
/*
        this.result  = '<div>';
        var prevYear = this.dates.changeYear(new Date(this.matrix.info.date), -1);
        this.result += '<a href="#" abbr="' + prevYear.toString() + '" class="b-jsxComponents-calendar-yearswitch b-jsxComponents-calendar-prevyear">&#8592;</a>';
        var nextYear = this.dates.changeYear(new Date(this.matrix.info.date), +1);
        this.result += '<a href="#" abbr="' + nextYear.toString() + '" class="b-jsxComponents-calendar-yearswitch b-jsxComponents-calendar-nextyear">&#8594;</a>';
        this.result += this.dates.toFormat(this.matrix.info.date, '%Y');
        this.result += '</div>';
*/
        this.result = '<div>';
        var prevMonth = this.dates.changeMonthAndYear(new Date(this.matrix.info.date), -1);
        if (!this.beginFrom || this.dates.getDays(this.beginFrom) <= this.dates.getDays(prevMonth)) {
          this.result += '<a href="#" abbr="' + prevMonth.toString() + '" class="b-jsxComponents-calendar-monthswitch b-jsxComponents-calendar-prevmonth">&#8592;</a>';
        }else{
          this.result += '<span class="b-jsxComponents-calendar-monthswitch b-jsxComponents-calendar-prevmonth">&#160;</span>';
        }
        var nextMonth = this.dates.changeMonthAndYear(new Date(this.matrix.info.date), +1);
        if (!this.endTo || this.dates.getDays(this.endTo) >= this.dates.getDays(nextMonth)) {
          this.result += '<a href="#" abbr="' + nextMonth.toString() + '" class="b-jsxComponents-calendar-monthswitch b-jsxComponents-calendar-nextmonth">&#8594;</a>';
        }else{
          this.result += '<span class="b-jsxComponents-calendar-monthswitch b-jsxComponents-calendar-nextmonth">&#160;</span>';
        }
        this.result += this.dates.toFormat(this.matrix.info.date, '%B, %Y');
        this.result += '</div>';

        this.header.innerHTML = this.result;
        jsx.CallBacks.dispatch('jsxComponents-Calendar-Redraw', this.element);
    };
    this.drawWeek = function(week){
        this.result += '<tr>';
        jsx.toArray(week).map(jsx.bind(this, this.drawDate));
        this.result += '</tr>';
    };
    this.drawDate = function(date){
        var prefix = 'b-jsxComponents-calendar-date-';
        var className = 'b-jsxComponents-calendar-date';
        className += date.month != 'current' ? ' ' + prefix + 'anothermonth ' : '';
        className += date.today ? ' ' + prefix + 'today ' : '';
        className += date.selected ? ' ' + prefix + 'selected ' : '';
        className += date.holiday ? ' ' + prefix + 'holiday ' : '';
        className += (this.beginFrom && this.dates.getDays(this.beginFrom) > this.dates.getDays(date.date) || this.endTo && this.dates.getDays(this.endTo) < this.dates.getDays(date.date)) ? ' ' + prefix + 'disabled' : '';

        this.result += '<td class="' + className + '">';
        this.result += this.drawDateHref(date.date);
        this.result += '</td>';
    };
    this.drawDateHref = function(date){
        date.setHours(0);
        date.setMinutes(0);
        date.setSeconds(0);
        if(this.beginFrom && this.dates.getDays(this.beginFrom) > this.dates.getDays(date) || this.endTo && this.dates.getDays(this.endTo) < this.dates.getDays(date)){
          return '<span class="b-jsxComponents-calendar-date-text-disabled">' + this.dates.toFormat(date, '%e') + '</span>';
        }
        return '<a href="#" abbr="' + date.toString() + '">' + this.dates.toFormat(date, '%e') + '</a>';
    };

    this.garbageCollector = function(){
        this.element = null;
        this.header = null;
        this.body = null;
    };
};

jsx.require(['Dom', 'Events', 'Dates', 'CallBacks', '{jsxComponents}.Calendar.NumberDates'], jsx.bind(jsx, jsx.loaded, '{jsxComponents}.Calendar'));