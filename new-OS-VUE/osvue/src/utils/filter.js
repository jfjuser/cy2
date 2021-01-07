import Vue from 'vue'

Vue.filter('hiddenPhone', function (value) {
  if (value) {
    return value.replace(/^(\d{3})\d{4}(\d{4})$/, '$1****$2')
  } else {
    return ''
  }
})
