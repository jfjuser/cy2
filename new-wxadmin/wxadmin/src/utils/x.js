// 格式化获取日期天数和星期几
export function DayAndWeekFormatter (value) {
  if (value) {
    let year = parseInt(value.split('-')[0])
    let month = parseInt(value.split('-')[1])
    let now = new Date(year, month, 0)
    let num = now.getDate()
    const week = ['日', '一', '二', '三', '四', '五', '六']
    let data = []
    for (let i = 1; i <= num; i++) {
      data.push({
        date: i + `(${week[new Date(year, month - 1, i).getDay()]})`,
        name: 'name' + i
      })
    }
    return data
  } else {
    return []
  }
}
