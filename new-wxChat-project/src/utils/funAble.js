import SearchImg from '@/assets/icon/wx/fun/icon-search.png'
import MyInfoImg from '@/assets/icon/wx/fun/icon-myinfo.png'
import MsgImg from '@/assets/icon/wx/fun/icon-msg.png'
import BindImg from '@/assets/icon/wx/fun/icon-bind.png'
import AddImg from '@/assets/icon/wx/fun/icon-add.png'
import UserImg from '@/assets/icon/wx/fun/icon-user.png'
import AttestImg from '@/assets/icon/wx/fun/icon-attestation.png'
import SynergyImg from '@/assets/icon/wx/fun/icon-synergy.png'
import PrivacyImg from '@/assets/icon/wx/fun/icon-privacy.png'
import FunTipImg from '@/assets/icon/wx/fun/icon-fun-tip.png'
import Instruction from '@/assets/icon/wx/fun/icon-message.png'

// 0是无效菜单
const type = [
  {id: 1, title: '记录查询', type: 2, img: SearchImg, feeValue: 0, tip: '查看使用记录'},
  {id: 0, title: '个人信息', type: 2, img: MyInfoImg, feeValue: 0, tip: '查看个人基本信息'},
  {id: 3, title: '消息中心', type: 3, img: MsgImg, feeValue: 0, tip: '查看消息通知'},
  // {id: 4, title: '人脸绑定', type: 2, img: BindImg, feeValue: 0, tip: '用于绑定认证'}, //删除人口录制
  {id: 4, title: '账户管理', type: 1, img: BindImg, feeValue: 0, tip: '用于账户管理操作功能'}, // 删除人口录制
  {id: 5, title: '定制功能', type: 3, img: AddImg, fee: 0, isDefault: 1, tip: '自定义功能菜单'},
  {id: 6, title: '人脸注册', type: 1, img: UserImg, feeValue: 0, tip: '录入非访客信息'},
  {id: 7, title: '账户认证', type: 1, img: AttestImg, feeValue: 0, isDefault: 1, tip: '用于申请账户'},
  {id: 8, title: '添加访客', type: 2, img: SynergyImg, feeValue: 0, isDefault: 1, tip: '用于访客申请'},
  {id: 9, title: '绑定管理', type: 2, img: PrivacyImg, feeValue: 0, tip: '管理绑定账户'},
  {id: 10, title: '功能介绍', type: 3, img: FunTipImg, feeValue: 0, tip: '查看对应功能的介绍'},
  {id: 11, title: '操作说明', type: 3, img: Instruction, fee: 0, tip: '查看操作流程'}
]

export const funBlock = type

export const funType = [{type: 1, name: '账户'}, {type: 2, name: '人员'}, {type: 3, name: '更多'}]

export function getDefaultFun () {
  console.log(type)
  let arr = []
  for (let i = 0; i < type.length; i++) {
    if (type[i].isDefault === 1) {
      arr.push(type[i])
    }
  }
  console.log(arr)
  return arr
}
