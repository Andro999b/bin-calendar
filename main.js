"use strict";
const RED_DATES = {// month starts from 0
    8: new Set([9, 13])
}

class MonthData {
    constructor(year, month) {
        this.month = month % 12;

        let firstDay = new Date(year, this.month, 1)

        this.firstDayOfWeek = firstDay.getDay() - 1
        if (this.firstDayOfWeek < 0)
            this.firstDayOfWeek = 7 + this.firstDayOfWeek
    }
    getFirstDayOfWeek() {
        return this.firstDayOfWeek;
    }
    getMonth() {
        return this.month
    }
}

function getCalendarModel() {
    let year = new Date().getFullYear()
    let monthes = Array.from(new Array(12), (v, i) => new MonthData(year, i))
    let daysInMonths = [31, (year % 4 == 0 ? 29 : 28), 31, 30, 31, 30, 31, 31, 30, 31, 30, 31]; 

    return {
        year,
        monthes,
        getDaysInMonth(month) {
            return daysInMonths[month]
        }
    }
}

function isRedDate(model, month, day) {
    if(RED_DATES[month]) {
        return RED_DATES[month].has(day);
    }

    return false;
}

function render(model, mode = 10) {
    let now = new Date();
    let nowMonth = now.getMonth();
    let nowDay = now.getDate();
    //form header
    let header = Array.from(
        new Array(7),
        (v, x) => `<div class="month__weak-header-day-num">${toStr(1 + x, mode)}</div>`
    ).join('');
    //set year
    document.getElementById("year").textContent = toStr(model.year, mode)
    //clear grid
    let grid = document.getElementById("month-grid")
    while (grid.firstChild) grid.removeChild(grid.firstChild)

    for (let monthData of model.monthes) {
        grid.appendChild(createMonthNode(monthData))
    }

    function createMonthNode(monthData) {
        //form days
        let days = Array.from(
            new Array(monthData.getFirstDayOfWeek()),
            (v, x) => '<div class="month__day"></div>'
        ).join('');

        days += Array.from(
            new Array(model.getDaysInMonth(monthData.getMonth())),
            (v, x) => {
                let day = x + 1;
                let classes = monthData.getMonth() == nowMonth && day == nowDay ? 'month__day_current' : '';
                if(isRedDate(model, monthData.getMonth(), day))
                    classes += ' month__day_red'
                return `<div class="month__day ${classes}">${toStr(day, mode)}</div>`
            }
        ).join('');

        //create el
        let el = document.createElement("div")
        el.className = "month mode-" + mode
        el.innerHTML = `
        <div class="month__title">${toStr(monthData.getMonth() + 1, mode)}</div>
        <div class="month__weak-header">${header}</div>
        <div class="month__days">${days}</div>`

        return el;
    }
}

function toStr(num, mode) {
    let str = num.toString(mode);

    if(str.length < 2)
        str = 0 + str;

    if(mode == 16)
        str = "0x" + str;

    return str;
}

const model = getCalendarModel();

document.getElementById("bin").addEventListener("click", e => render(model, 2))
document.getElementById("oct").addEventListener("click", e => render(model, 8))
document.getElementById("dec").addEventListener("click", e => render(model, 10))
document.getElementById("hex").addEventListener("click", e => render(model, 16))

switch (window.location.hash) {
    case "#dec": render(model, 10); break;
    case "#hex": render(model, 16); break;
    case "#oct": render(model, 8); break;
    case "#bin":
    default:
        render(model, 2);
}
