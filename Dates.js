/**
 * Dates extensions
 * @alias jsx.Dates
 */
jsx.Dates = new function () {
  this.days = {Sunday: 0, Monday: 1, Tuesday: 2, Wednesday: 3, Thursday: 4, Friday: 5, Saturday: 6};
  this.firstDay = 'Monday';
  this.lang = 'ru';

	this.getDay = function (currentDay, firstDay) {
	  firstDay = firstDay || this.firstDay;
	  currentDay = currentDay instanceof Date ? currentDay.getDay() : currentDay;	  
    firstDay = this.days[firstDay];
		if (currentDay < firstDay) {
			return 7 - firstDay + currentDay;
		} else {
			return currentDay - firstDay;
		}
	};

	/**
     * This method creates tag formatted string from date.
     * String like "%Y.%m.%d %H:%M:%S".
     *   Y - year (four digits)
     *   m - month (two digits)
     *   n - month without leading zeros
     *   B - month (full name, ex. January)
     *   d - day of month (two digits)
     *   e - day of the month without leading zeros
     *   H - hours (two digits from 00 to 23)
     *   M - minutes (two digits)
     *   S - seconds (two digits)
     * IMPORTANT: pattern like "%e %B" will type month name in partitive genitive. Example "1 january" but not "1 January".
     * @alias jsx.Dates.toFormat
     * @param {Object} Date
     * @param {String} Format for output
     * @return {String} String like "2006.07.13 12:34:42".
	 */
	this.toFormat = function (date, dateFormat) {
    var month = (/\%e[^\%]*\%B/.test(dateFormat) ? this[this.lang].monthNamesPartitive : this[this.lang].monthNames);
		var formats = [
			[/\%Y/g,    '%04d', date.getFullYear()],
			[/\%m/g,    '%02d', date.getMonth() + 1],
      [/\%n/g,      '%d', date.getMonth() + 1],
			[/\%d/g,    '%02d', date.getDate()],
			[/\%e/g,      '%d', date.getDate()],
			[/\%EEEE/g,   '%d', this[this.lang].dayNamesPartitive[this.getDay(date.getDay(), 'Monday')]],			
			[/\%H/g,    '%02d', date.getHours()],
			[/\%M/g,    '%02d', date.getMinutes()],
			[/\%S/g,    '%02d', date.getSeconds()],
      [/\%B/g,      '%s', month[date.getMonth()]]
		];
		for (var i = 0, l = formats.length, format = null; i < l; i++){
			format = formats[i];
			dateFormat = dateFormat.replace(format[0], jsx.Strings.printf(format[1], [format[2]]));
		}
		formats = null;
		return dateFormat;
	};

    /**
     * Changes month, if month had 31 day but new month has only 30 days date will be changed to 30.
     * Don't change year.
     * @alias jsx.Dates.changeMonth
     * @param {Object} Date.
     * @param {Number} Shift.
     * @return {Object} Shifted date.
     */
    this.changeMonth = function (date, shift) {
        var month = date.getMonth() + shift;
        month = month == 12 ? 0 : month;
        month = month == -1 ? 11 : month;
        date.setMonth(month);
        if (month != date.getMonth()) {
            date.setDate(0);
        }
        return date;
    };

    /**
     * Changes month, if month had 31 day but new month has only 30 days date will be changed to 30.
     * @alias jsx.Dates.changeMonthAndYear
     * @param {Object} Date.
     * @param {Number} Shift.
     * @return {Object} Shifted date.
     */
    this.changeMonthAndYear = function (date, shift) {
        var month = date.getMonth() + shift;
        date.setMonth(month);
        month = month == 12 ? 0 : month;
        month = month == -1 ? 11 : month;
        if (month != date.getMonth()) {
            date.setDate(0);
        }
        return date;
    };


    /**
     * Change year, if was 31 date but new month has only 30 date date will be changed to 30.
     * @alias jsx.Dates.changeYear
     * @param {Object} Date.
     * @param {Number} Shift.
     * @return {Object} Shifted date.
     */
    this.changeYear = function (date, shift) {
        var month = date.getMonth();
        date.setFullYear(date.getFullYear() + shift);
        if (month != date.getMonth()) {
            date.setDate(0);
        }
        return date;
    };
    
    this.equal = function(dateOne, dateTwo, format){
        format = format || '%Y%n%e';
        return this.toFormat(dateOne, format) == this.toFormat(dateTwo, format);
    };

    this.compare = function(dateOne, dateTwo, format){
        format = format || '%Y%m%d';
        return parseInt(this.toFormat(dateOne, format)) - parseInt(this.toFormat(dateTwo, format));
    };
    
    this.getDays = function(date){
        var tmpDate = new Date(date);
        tmpDate.setMilliseconds(0);
        tmpDate.setSeconds(0);
        tmpDate.setMinutes(0);
        tmpDate.setHours(0);
        return Math.round(tmpDate.getTime() / (1000 * 60 * 60 * 24));
    };    

    this.diffInDays = function(dateOne, dateTwo){
        return Math.round((dateOne.getTime() - dateTwo.getTime()) / (1000 * 60 * 60 * 24));
    };
    
    this.isToday = function(date){
      var today = new Date();
      return (date.getFullYear() == today.getFullYear() && date.getMonth() == today.getMonth() && date.getDate() == today.getDate());
    };
    
    this.isTomorrow = function(date){
      var tomorrow = new Date();
      tomorrow.setDate(tomorrow.getDate() + 1);
      return (date.getFullYear() == tomorrow.getFullYear() && date.getMonth() == tomorrow.getMonth() && date.getDate() == tomorrow.getDate());
    };
};

jsx.Dates.en = new function(){
  this.dayNamesPartitive = ['monday', 'tuesday', 'wednesday', 'thursday', 'friday', 'saturday', 'sunday'];    
  this.monthNames = this.monthNamesPartitive = ['January', 'February', 'March', 'April', 'May', 'June', 'July', 'August', 'September', 'October', 'November', 'Desember'];
}

jsx.Dates.ru = {
  dayNamesPartitive: ['понедельник', 'вторник', 'среда', 'четверг', 'пятница', 'суббота', 'воскресенье'],    
  monthNames: ['Январь', 'Февраль', 'Март', 'Апрель', 'Май', 'Июнь', 'Июль', 'Август', 'Сентябрь', 'Октябрь', 'Ноябрь', 'Декабрь'],
  monthNamesPartitive: ['января', 'февраля', 'марта', 'апреля', 'мая', 'июня', 'июля', 'августа', 'сентября', 'октября', 'ноября', 'декабря']
}
jsx.require('Strings', function () { jsx.loaded('Dates') });

