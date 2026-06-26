const Storage = {
    KEYS: {
        PERIODS: 'period_tracker_periods',
        SETTINGS: 'period_tracker_settings'
    },

    getPeriods() {
        const data = localStorage.getItem(this.KEYS.PERIODS);
        return data ? JSON.parse(data) : [];
    },

    savePeriods(periods) {
        localStorage.setItem(this.KEYS.PERIODS, JSON.stringify(periods));
    },

    addPeriod(startDate, endDate = null) {
        const periods = this.getPeriods();
        const newPeriod = {
            id: Date.now(),
            startDate: startDate,
            endDate: endDate,
            createdAt: new Date().toISOString()
        };
        periods.push(newPeriod);
        this.savePeriods(periods);
        return newPeriod;
    },

    updatePeriod(id, updates) {
        const periods = this.getPeriods();
        const index = periods.findIndex(p => p.id === id);
        if (index !== -1) {
            periods[index] = { ...periods[index], ...updates };
            this.savePeriods(periods);
            return periods[index];
        }
        return null;
    },

    getLastPeriod() {
        const periods = this.getPeriods();
        if (periods.length === 0) return null;
        return periods.sort((a, b) => new Date(b.startDate) - new Date(a.startDate))[0];
    },

    getSettings() {
        const data = localStorage.getItem(this.KEYS.SETTINGS);
        return data ? JSON.parse(data) : {
            avgCycleLength: 28,
            avgPeriodLength: 5
        };
    },

    saveSettings(settings) {
        localStorage.setItem(this.KEYS.SETTINGS, JSON.stringify(settings));
    },

    clearAll() {
        localStorage.removeItem(this.KEYS.PERIODS);
        localStorage.removeItem(this.KEYS.SETTINGS);
    }
};
