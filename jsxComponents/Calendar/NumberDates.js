jsxComponents.Calendar.NumberDates = {
  create: function(date, selectedDate, dates){
    this.dates = dates;
    var begin = this._getBeginDate(date);
    var end = this._getEndDate(date);
    var dates = [];
    while (begin.getTime() <= end.getTime()){
      dates[dates.length] = this._createDateObject(begin, date, selectedDate);
      begin.setDate(begin.getDate() + 1);
    }
    var calendar = [];
    for (var i = 0, l = dates.length / 7; i < l; i++){
      calendar[i] = [];
      for (var j = 0; j < 7; j++){
        calendar[i][j] = dates[i * 7 + j];
      }
    }
    calendar = {
      info: this._getInfo(date),
            weekDays: [0, 1, 2, 3, 4, 5, 6],
      dates: calendar,
      time: {
        hours: date.getHours(),
        minutes: date.getMinutes(),
        seconds: date.getSeconds()
      }
    };
    return calendar;
  },
  _getBeginDate: function(date){
    var begin = new Date(date);
    begin.setDate(1);
    while (this.dates.getDay(begin.getDay()) != 0){
      begin.setDate(begin.getDate() - 1);
    }
    return begin;
  },
  _getEndDate: function(date){
    var end = new Date(date);
    end.setDate(this._getLastDate(date));
    while (this.dates.getDay(end.getDay()) != 6){
      end.setDate(end.getDate() + 1);
    }
    return end;
  },
  _getLastDate: function(date){
    var last = new Date(date);
    last.setMonth(date.getMonth() + 1);
    last.setDate(1);
    last.setDate(last.getDate() - 1);
    return last.getDate();
  },
  _getInfo: function(date){
    return {
            date: new Date(date)
    }
  },
  _createDateObject: function(date, current, selected){
    var today = new Date();
    return {
      date: new Date(date),
      month: (date.getMonth() == current.getMonth() ? 'current' : (date.getMonth() > current.getMonth() ? 'after' : 'before') ),
      today: (date.getDate() == today.getDate() && date.getMonth() == today.getMonth() && date.getYear() == today.getYear()),
      selected: (date.getDate() == selected.getDate() && date.getMonth() == selected.getMonth() && date.getYear() == selected.getYear()),
      day: (this.dates.getDay(date.getDay())),
      holiday: (this.dates.getDay(date.getDay()) >= 5)
    }
  }
};

jsx.loaded('{jsxComponents}.Calendar.NumberDates');
