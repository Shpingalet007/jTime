class JTime {
    constructor(time) {
        this._milliseconds = {
            second: 1000,
        };
        this._seconds = {
            day: 86400,
            hour: 3600,
            minute: 60,
        };
        this._minutes = {
            day: 1440,
            hour: 60,
        };

        /*if(time === undefined) {
            this._daySeconds = JTime._currentUnix();
            return;
        }*/

        if(typeof time === 'object') {
            this._daySeconds = this._fromJTime(time);
            return;
        }

        this._daySeconds = time;
    }

    _fromDaySeconds(daySeconds) {
        let hours = Math.floor(daySeconds / this._seconds.hour);
        let minutes = Math.floor((daySeconds % this._seconds.hour) / this._seconds.minute);
        let seconds = Math.floor(daySeconds % this._seconds.minute);

        let jTime = {};
        jTime[hours] = minutes + parseFloat(`0.${seconds}`);    // FIXME: Don't use string here

        return jTime;
    }
    _fromJTime(time) {
        let hours = Object.keys(time)[0];
        let minutes = Math.floor(time[hours]);
        let seconds = time[hours] % 1;
        seconds = Math.round(seconds * 100) / 100;
        seconds = seconds.toString().substring(2);  // FIXME: Don't use string here
        seconds = parseInt(seconds);

        if(seconds < 10) seconds *= 10;

        // FIXME: Errors need to be throwed by a method
        if(hours < 0 || hours > 23) throw "TypeError: Invalid hours provided";
        if(minutes < 0 || minutes > 59) throw "TypeError: Invalid minutes provided";
        if(seconds < 0 || seconds > 59) throw "TypeError: Invalid seconds provided";

        return hours * this._seconds.hour + minutes * this._seconds.minute + seconds;
    }
    _fromJDate(date) {
        return Date.UTC(date[2], date[1], date[0]) / this._milliseconds.second;
    }
    _fromDateSeconds(date) {
        let date = new Date(date * 1000);

        let year = date.getUTCFullYear();
        let month = date.getUTCMonth();
        let day = date.getUTCDay();

        return [month, day, year];
    }
    _currentUnix() {
        return Math.floor(Date.now() / 1000);
    }

    set timepiece(time) {
        this._daySeconds = JTime._fromJTime(time);
    }
    get timepiece() {
        return this._fromDaySeconds(this._daySeconds);
    }

    set datepiece(date) {
        this._dateSeconds = this._fromJDate(date);
    }
    get datepiece() {
        return this._fromDateSeconds(this._dateSeconds);
    }

    get o() {
        if(this._dateSeconds === undefined) return this._daySeconds;

        return this._dateSeconds + this._daySeconds;
    }
}
