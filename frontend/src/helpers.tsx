import { format, subDays } from 'date-fns'

export const getWeekDayslabels = (): string[] => {
    const dayNumbers = [0, 1, 2, 3, 4, 5, 6]
    return dayNumbers.map((dayNumber) => {
        const day = subDays(new Date(), dayNumber)
        return formatDateLabel(day)}
    )
}

const formatDateLabel = (date: Date): string => {
    return format(date, 'yyyy-MM-dd')
}