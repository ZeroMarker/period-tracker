const App = {
    currentPeriodId: null,

    init() {
        Calendar.init();
        this.bindEvents();
        this.updateUI();
        this.updateStats();
    },

    bindEvents() {
        document.getElementById('startPeriod').addEventListener('click', () => {
            this.startPeriod();
        });

        document.getElementById('endPeriod').addEventListener('click', () => {
            this.endPeriod();
        });
    },

    startPeriod() {
        const today = Calendar.formatDate(new Date());
        const lastPeriod = Storage.getLastPeriod();

        if (lastPeriod && !lastPeriod.endDate) {
            alert('请先结束当前经期记录');
            return;
        }

        const period = Storage.addPeriod(today);
        this.currentPeriodId = period.id;
        this.updateUI();
        Calendar.render();
    },

    endPeriod() {
        if (!this.currentPeriodId) return;

        const today = Calendar.formatDate(new Date());
        Storage.updatePeriod(this.currentPeriodId, { endDate: today });
        this.currentPeriodId = null;
        this.updateUI();
        this.updateStats();
        Calendar.render();
    },

    updateUI() {
        const lastPeriod = Storage.getLastPeriod();
        const statusText = document.getElementById('statusText');
        const startBtn = document.getElementById('startPeriod');
        const endBtn = document.getElementById('endPeriod');

        if (!lastPeriod) {
            statusText.textContent = '未记录';
            startBtn.disabled = false;
            endBtn.disabled = true;
            this.currentPeriodId = null;
        } else if (!lastPeriod.endDate) {
            statusText.textContent = '经期中';
            statusText.style.color = 'var(--primary-color)';
            startBtn.disabled = true;
            endBtn.disabled = false;
            this.currentPeriodId = lastPeriod.id;
        } else {
            statusText.textContent = '已结束';
            statusText.style.color = 'var(--success-color)';
            startBtn.disabled = false;
            endBtn.disabled = true;
            this.currentPeriodId = null;
        }
    },

    updateStats() {
        const periods = Storage.getPeriods().filter(p => p.endDate);

        if (periods.length < 2) {
            document.getElementById('avgCycle').textContent = '--';
            document.getElementById('avgPeriod').textContent = '--';
            document.getElementById('nextPrediction').textContent = '--';
            return;
        }

        const sortedPeriods = periods.sort((a, b) =>
            new Date(b.startDate) - new Date(a.startDate)
        );

        let totalCycleDays = 0;
        let cycleCount = 0;

        for (let i = 0; i < sortedPeriods.length - 1; i++) {
            const current = new Date(sortedPeriods[i].startDate);
            const previous = new Date(sortedPeriods[i + 1].startDate);
            const diffDays = Math.floor((current - previous) / (1000 * 60 * 60 * 24));

            if (diffDays > 0 && diffDays < 60) {
                totalCycleDays += diffDays;
                cycleCount++;
            }
        }

        let totalPeriodDays = 0;
        sortedPeriods.forEach(period => {
            const start = new Date(period.startDate);
            const end = new Date(period.endDate);
            const days = Math.floor((end - start) / (1000 * 60 * 60 * 24)) + 1;
            totalPeriodDays += days;
        });

        const avgCycle = cycleCount > 0 ? Math.round(totalCycleDays / cycleCount) : 28;
        const avgPeriod = Math.round(totalPeriodDays / sortedPeriods.length);

        document.getElementById('avgCycle').textContent = avgCycle;
        document.getElementById('avgPeriod').textContent = avgPeriod;

        const prediction = this.getNextPrediction();
        if (prediction) {
            document.getElementById('nextPrediction').textContent =
                this.formatDisplayDate(prediction.startDate);
        }
    },

    getNextPrediction() {
        const lastPeriod = Storage.getLastPeriod();
        if (!lastPeriod) return null;

        const settings = Storage.getSettings();
        const startDate = new Date(lastPeriod.startDate);
        const nextStart = new Date(startDate);
        nextStart.setDate(nextStart.getDate() + settings.avgCycleLength);

        const nextEnd = new Date(nextStart);
        nextEnd.setDate(nextEnd.getDate() + settings.avgPeriodLength - 1);

        return {
            startDate: Calendar.formatDate(nextStart),
            endDate: Calendar.formatDate(nextEnd)
        };
    },

    formatDisplayDate(dateStr) {
        const date = new Date(dateStr);
        const month = date.getMonth() + 1;
        const day = date.getDate();
        return `${month}月${day}日`;
    },

    onDateSelect(date) {
        console.log('Selected date:', Calendar.formatDate(date));
    }
};

document.addEventListener('DOMContentLoaded', () => {
    App.init();
});
