const convert = (d: Date) => {
    if (String(d).toLowerCase() === 'invalid date') return ''

    const now = new Date()

    const sec = Math.floor((now.getTime() - d.getTime()) / 1000)
    if (sec < 10) return 'Just Now'
    if (sec < 60) return `${sec} second${sec === 1 ? '' : 's'} ago`

    const min = Math.floor(sec / 60)
    if (min < 60) return `${min} minute${min === 1 ? '' : 's'} ago`
    
    const hrs = Math.floor(min / 60)
    if (hrs < 24) return `${hrs} hour${hrs === 1 ? '' : 's'} ago`
    
    const days = Math.floor(min / 24)
    if (days < 30) return `${days} day${days === 1 ? '' : 's'} ago`
    
    const months = Math.floor(days / 30.4375)
    if (months < 12) return `${months} month${months === 1 ? '' : 's'} ago`
    
    const yrs = Math.floor(months / 12)
    return `${yrs} year${yrs === 1 ? '' : 's'} ago`
}

export default convert