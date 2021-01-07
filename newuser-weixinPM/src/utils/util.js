function isObjectValueEqual (a, b) {
  var aProps = Object.getOwnPropertyNames(a)
  var bProps = Object.getOwnPropertyNames(b)
  if (aProps.length != bProps.length) {
    return false
  }
  for (var i = 0; i < aProps.length; i++) {
    var propName = aProps[i]
    if (a[propName] != b[propName]) {
      return false
    }
  }
  return true
}
// 删除数组对象中指定的对象
function removeArray (_arr, _obj) {
  var length = _arr.length
  for (var i = 0; i < length; i++) {
    if (isObjectValueEqual(_arr[i], _obj)) {
      if (i == 0) {
        _arr.shift() // 删除并返回数组的第一个元素
        return _arr
      } else if (i == length - 1) {
        _arr.pop()// 删除并返回数组的最后一个元素
        return _arr
      } else {
        _arr.splice(i, 1) // 删除下标为i的元素
        return _arr
      }
    }
  }
}
export {
  removeArray
}
