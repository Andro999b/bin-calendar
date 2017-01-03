"use strict";
class MonthData {
    constructor(year, month) {
        this.month = month % 12;
        this.year = year;

        let firstDay = new Date(year, this.month, 1)

        this.firstDayOfWeek = firstDay.getDay() - 1
        if (this.firstDayOfWeek < 0)
            this.firstDayOfWeek = 7 + this.firstDayOfWeek
    }
    getDaysInMonth() {
        return [31, (this.year % 4 == 0 ? 29 : 28), 31, 30, 31, 30, 31, 31, 30, 31, 30, 31][this.month]
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

    return {
        year,
        monthes
    }
}

function render(model, mode = 10) {
    let now = new Date();
    let nowMonth = now.getMonth();
    let nowDay = now.getDate();
    //form header
    let header = Array.from(
        new Array(7),
        (v, x) => `<div class="month__weak-header-day-num">${(1+x).toString(mode)}</div>`
        ).join('');
    //set year
    document.getElementById("year").textContent = model.year.toString(mode)
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
            new Array(monthData.getDaysInMonth()),
            (v, x) => {
                let day = x + 1;
                let curDay = monthData.getMonth() == nowMonth && day == nowDay ? 'month__day_current' : '';
                return `<div class="month__day ${curDay}">${day.toString(mode)}</div>`
            }
            ).join('');
        
        //create el
        let el = document.createElement("div")
        el.className = "month"
        el.innerHTML = `
        <div class="month__title">${(monthData.getMonth() + 1).toString(mode)}</div>
        <div class="month__weak-header">${header}</div>
        <div class="month__days">${days}</div>`

        return el;
    }
}

const model = getCalendarModel();

document.getElementById("bin").addEventListener("click", e => render(model, 2))
document.getElementById("oct").addEventListener("click", e => render(model, 8))
document.getElementById("dec").addEventListener("click", e => render(model, 10))
document.getElementById("hex").addEventListener("click", e => render(model, 16))

render(model)
