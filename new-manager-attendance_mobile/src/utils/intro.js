import introJs from 'intro.js'
import 'intro.js/introjs.css'

const intro = introJs()
intro.setOptions({
  nextLabel: '下一个',
  prevLabel: '上一个',
  skipLabel: '跳过',
  doneLabel: '立即体验',
  hidePrev: true,
  hideNext: true,
  exitOnOverlayClick: false,
  showStepNumbers: false,
  disableInteraction: true,
  showBullets: false
})

export const homeSteps = {
  cameraManage: {
    step: '9',
    intro: '设备管理，可在这里添加设备，查看已绑定设备的状态及其他信息和设置wifi功能。',
    position: 'top'
  },
  shifts: {
    step: '1',
    intro: '班次管理，配置上下班时间及各种人性化设置。',
    position: 'top'
  },
  attendGroup: {
    step: '2',
    intro: '考勤组管理，设置考勤方式、考勤时间等考勤规则。邀请人功能在这里。',
    position: 'top'
  },
  attendCount: {
    step: '3',
    intro: '考勤统计，随时可查看团队每日/月出勤情况。支持修改打卡结果。',
    position: 'top'
  },
  writeOff: {
    step: '4',
    intro: '审批记录，可查看审批的历史记录',
    position: 'top'
  },
  punchIn: {
    step: '5',
    intro: '申请管理，支持查看员工的补卡申请和审核功能',
    position: 'top'
  },
  department: {
    step: '6',
    intro: '部门管理，可查看和管理部门。',
    position: 'top'
  },
  user: {
    step: '7',
    intro: '成员管理，可查看加入此团队的所有成员。',
    position: 'top'
  },
  visitor: {
    step: '8',
    intro: '访客管理，可为来访人员生成临时通行链接。',
    position: 'top'
  },
  accessRecords: {
    step: '10',
    intro: '进出记录，可以查看人员出入的记录。',
    position: 'top'
  },
  attendanceAbnormal: {
    step: '11',
    intro: '设备解绑',
    position: 'top'
  }

}

export default intro
