export class Period {
    constructor(
        private readonly startDate: Date,
        private readonly endDate: Date
    ) {
        if (startDate > endDate) {
            throw new Error('Start date cannot be after end date');
        }
    }

    getStartDate(): Date {
        return this.startDate;
    }

    getEndDate(): Date {
        return this.endDate;
    }

    getDays(): number {
        const diffTime = Math.abs(this.endDate.getTime() - this.startDate.getTime());
        return Math.ceil(diffTime / (1000 * 60 * 60 * 24));
    }

    contains(date: Date): boolean {
        return date >= this.startDate && date <= this.endDate;
    }
}