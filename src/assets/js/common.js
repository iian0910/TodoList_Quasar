export function weekdayToString (weekday) {
  let getDay = ''

  switch (weekday) {
    case 1:
      getDay = '一'
      break
    case 2:
      getDay = '二'
      break
    case 3:
      getDay = '三'
      break
    case 4:
      getDay = '四'
      break
    case 5:
      getDay = '五'
      break
    case 6:
      getDay = '六'
      break
    case 0:
      getDay = '日'
      break
  }

  return getDay
}
