import dayjs from "dayjs";

export const generateData = (
    month = dayjs().month(), 
    year = dayjs().year()
) => {
    const firstDateOfMonth = dayjs().year(year).month(month).startOf("month");
    const lastDateOfMonth = dayjs().year(year).month(month).endOf("month");

    const arrayOfDate = [];

    // CREATE PREFIX DATE

    for (let i = firstDateOfMonth.day() - 1; i >= 0; i--) {
        const prevDate = firstDateOfMonth.subtract(i + 1, 'day');
        arrayOfDate.push({
            currentMonth: false,
            date: prevDate,
        });
    }

    // Current Month Dates
    for (let i = 1; i <= lastDateOfMonth.date(); i++) {
        const currentDay = firstDateOfMonth.date(i);
        arrayOfDate.push({
            currentMonth: true,
            date: currentDay,
            today: currentDay.isSame(dayjs(), 'day')
        });
    }

    // Suffix Dates (days from the next month)
    const remaining = 42 - arrayOfDate.length;
    for (let i = 1; i <= remaining; i++) {
        const nextDate = lastDateOfMonth.add(i, 'day');
        arrayOfDate.push({
            currentMonth: false,
            date: nextDate,
        });
    }

    return arrayOfDate;

};

export const months = [
    "January",
    "February",
    "March",
    "April",
    "May",
    "June",
    "July",
    "August",
    "September",
    "October",
    "November",
    "December",
]