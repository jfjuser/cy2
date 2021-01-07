// import introJs from 'intro.js'
// import 'intro.js/introjs.css'
// const intro = introJs()
// // 更多配置参数请到官方文档查看
// intro.setOptions({
//   nextLabel: '下一个', // 下一个按钮文字
//   prevLabel: '上一个', // 上一个按钮文字
//   skipLabel: '跳过', // 跳过按钮文字
//   doneLabel: '立即体验', // 完成按钮文字
//   highlightClass: 'introClass',
//   hidePrev: true, // 在第一步中是否隐藏上一个按钮
//   hideNext: true, // 在最后一步中是否隐藏下一个按钮
//   exitOnOverlayClick: false, // 点击叠加层时是否退出介绍
//   showStepNumbers: false, // 是否显示红色圆圈的步骤编号
//   disableInteraction: true, // 是否禁用与突出显示的框内的元素的交互，就是禁止点击
//   showBullets: false, // 是否显示面板指示点
//   steps: [
//     {
//       element: '.el-card__header .title',
//       intro: '所有级别点击后即可在右侧添加该级别',
//       path: '/cloudMaintain/cloudCategory/level'
//     },
//     {
//       element: '.el-card__header .el-button.el-button--text',
//       intro: '点击后即可展示所有',
//       path: '/cloudMaintain/cloudCategory/level'
//     },
//     {
//       element: '.el-button.filter-item.add.el-button--primary',
//       intro: '添加该级别',
//       path: '/cloudMaintain/cloudCategory/level'
//     },
//     {
//       element: '.table-main .el-button.person.el-button--primary.el-button--mini',
//       intro: '在这里可以添加一些页面或功能权限',
//       path: '/cloudMaintain/cloudCategory/level'
//     }
//   ]
// })
import Driver from 'driver.js'
import 'driver.js/dist/driver.min.css'
let intro = new Driver({
  allowClose: false,
  doneBtnText: '知道了',
  closeBtnText: '跳过',
  prevBtnText: '上一个',
  nextBtnText: '下一个',
  onNext: (Element) => {
    console.log(Element.options.popover)
  },
  onPrevious: (Element) => {
    console.log(Element.options.popover)
  },
  onReset: (Element) => {
    console.log(55555, Element.options.popover)
  }
})
export default intro
