const Calendar = {
    currentDate: new Date(),
    selectedDate: null,

    init() {
        this.render();
        this.bindEvents();
    },

    bindEvents() {
        document.getElementById('prevMonth').addEventListener('click', () => {
            this.currentDate.setMonth(this.currentDate.getMonth() - 1);
            this.render();
        });

        document.getElementById('nextMonth').addEventListener('click', () => {
            this.currentDate.setMonth(this.currentDate.getMonth() + 1);
            this.render();
        });
    },

    render() {
        const year = this.currentDate.getFullYear();
        const month = this.currentDate.getMonth();

        document.getElementById('currentMonth').textContent =
            `${year}年${month + 1}月`;

        const grid = document.getElementById('calendarGrid');
        grid.innerHTML = '';

        const dayNames = ['日', '一', '二', '三', '四', '五', '六'];
        dayNames.forEach(day => {
            const header = document.createElement('div');
            header.className = 'calendar-day header';
            header.textContent = day;
            grid.appendChild(header);
        });

        const firstDay = new Date(year, month, 1).getDay();
        const daysInMonth = new Date(year, month + 1, 0).getDate();
        const today = new Date();

        for (let i = 0; i < firstDay; i++) {
            const empty = document.createElement('div');
            empty.className = 'calendar-day empty';
            grid.appendChild(empty);
        }

        const periods = Storage.getPeriods();

        for (let day = 1; day <= daysInMonth; day++) {
            const date = new Date(year, month, day);
            const dateStr = this.formatDate(date);
            const dayElement = document.createElement('div');
            dayElement.className = 'calendar-day';
            dayElement.textContent = day;

            if (this.isSameDay(date, today)) {
                dayElement.classList.add('today');
            }

            const periodInfo = this.getPeriodInfo(dateStr, periods);
            if (periodInfo) {
                dayElement.classList.add(periodInfo.type);
            }

            dayElement.addEventListener('click', () => {
                this.selectedDate = date;
                App.onDateSelect(date);
            });

            grid.appendChild(dayElement);
        }
    },

    formatDate(date) {
        const year = date.getFullYear();
        const month = String(date.getMonth() + 1).padStart(2, '0');
        const day = String(date.getDate()).padStart(2, '0');
        return `${year}-${month}-${day}`;
    },

    isSameDay(date1, date2) {
        return date1.getFullYear() === date2.getFullYear() &&
               date1.getMonth() === date2.getMonth() &&
               date1.getDate() === date2.getDate();
    },

    getPeriodInfo(dateStr, periods) {
        for (const period of periods) {
            if (!period.endDate) {
                if (dateStr === period.startDate) {
                    return { type: 'period-start' };
                }
            } else {
                if (dateStr === period.startDate) {
                    return { type: 'period-start' };
                }
                if (dateStr === period.endDate) {
                    return { type: 'period-end' };
                }
                if (dateStr > period.startDate && dateStr < period.endDate) {
                    return { type: 'period' };
                }
            }
        }

        const prediction = App.getNextPrediction();
        if (prediction) {
            const predStart = new Date(prediction.startDate);
            const predEnd = new Date(prediction.endDate);
            const checkDate = new Date(dateStr);

            if (checkDate >= predStart && checkDate <= predEnd) {
                return { type: 'predicted' };
            }
        }

        return null;
    }
};
