const formatDate = (dateString) => {

    const months = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'];

    const days = ['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'];

    const date = new Date(dateString);
    const dayOfWeek = days[date.getDay()];
    const dayOfMonth = date.getDate();
    const month = months[date.getMonth()];
    const year = date.getFullYear();

    let daySuffix;
    switch (dayOfMonth) {
        case 1:
        case 21:
        case 31:
            daySuffix = 'st';
            break;
        case 2:
        case 22:
            daySuffix = 'nd';
            break;
        case 3:
        case 23:
            daySuffix = 'rd';
            break;
        default:
            daySuffix = 'th';
    }

    return `${dayOfWeek}, ${month} ${dayOfMonth}${daySuffix} ${year}`;

}

export default formatDate;