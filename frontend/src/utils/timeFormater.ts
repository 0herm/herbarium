import json from '@text'

export function timeToString(minutes: number, format: 'long' | 'short' = 'short') {
    const text = json.timeFormatter 

    const hour = Math.floor(minutes / 60)
    const minute = minutes % 60

    const hourString = hour > 0 ? `${hour}${format === 'long' ? ' ' + (hour > 1 ? text.hourLongPlural : text.hourLong) : text.hourShort}` : ''
    const minuteString = minute > 0 ? `${minute}${format === 'long' ? ' ' + (minute > 1 ? text.minuteLongPlural : text.minuteLong) : text.minuteShort}` : ''

    return `${hourString} ${minuteString}`
}

export function dateToString(dateString: string) {
    const text = json.timeFormatter 

    const date = new Date(dateString)
    const now = new Date()
    const diffMs = Math.abs(now.getTime() - date.getTime())
    const diffDays = Math.floor(diffMs / (1000 * 60 * 60 * 24))

    if (diffDays < 7) {
        return `${diffDays} ${diffDays !== 1 ? text.days : text.day}`
    } else if (diffDays < 30) {
        const weeks = Math.floor(diffDays / 7)
        return `${weeks} ${weeks !== 1 ? text.weeks : text.week}`
    } else if (diffDays < 365) {
        const months = Math.floor(diffDays / 30)
        return `${months} ${months !== 1 ? text.months : text.month}`
    } else {
        const years = Math.floor(diffDays / 365)
        return `${years} ${years !== 1 ? text.years : text.year}`
    }
}