export const formateDate = function (date) {
    let theDate = new Date(date)
    let year = theDate.getFullYear()
    let month = theDate.getMonth() + 1
    let day = theDate.getDate()
    // let hour = theDate.getHours()
    // let minute = theDate.getMinutes()
    // let second = theDate.getSeconds()
    return year + '-' + formatTen(month) + '-' + formatTen(day)
    // return year + '-' + this.formatTen(month) + '-' + this.formatTen(day) + ' ' + this.formatTen(hour) + ':' + this.formatTen(minute) + ':' + this.formatTen(second)
}
const formatTen = function (num) {
  return num > 9 ? (num + '') : ('0' + num)
}