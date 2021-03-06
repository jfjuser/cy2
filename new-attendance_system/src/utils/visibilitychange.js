import store from '@/store'
import { getUserId } from '@/utils/cookie'
import { MessageBox } from 'element-ui'

const visProp = getHiddenProp()
if (visProp) {
  let evtname = visProp.replace(/[H|h]idden/, '') + 'visibilitychange'
  // 监测浏览器窗口发生变化时执行
  window.addEventListener(evtname, function () {
    if (document[visProp] === false) {
      const cookieUserId = getUserId()
      const storeUserId = store.getters.userId
      if (cookieUserId && storeUserId) {
        if (Number(cookieUserId) !== Number(storeUserId)) {
          // location.reload()
          MessageBox.alert('检测到您已切换账号,请刷新或点击确定', '提示', {
            type: 'warning',
            showClose: false,
            confirmButtonText: '确定',
            beforeClose: () => {
              location.reload()
            }
          })
        }
      }
    }
  })
}
// 兼容处理
function getHiddenProp () {
  const prefixes = ['webkit', 'moz', 'ms', 'o']
  if ('hidden' in document) return 'hidden'
  for (let i = 0; i < prefixes.length; i++) {
    if ((prefixes[i] + 'Hidden') in document) {
      return prefixes[i] + 'Hidden'
    }
  }
  return null
}
