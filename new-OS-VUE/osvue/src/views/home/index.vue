<template>
  <div >
    <component :is="current"></component>
  </div>
</template>

<script>

import { mapGetters } from 'vuex'
import CloudHome from './cloudHome/index'
import ParkHome from './parkHome/index'
import AgentHome from './agentHome/index'
import BusinessHome from './BusinessHome/index'
import MuckHome from './MuckHome/index'
import Workbench from './workbench/index'
import { getLoginType, getLoginDepId } from '@/utils/cookie'
export default {
  name: 'home',
  components: {
    CloudHome,
    ParkHome,
    AgentHome,
    BusinessHome,
    MuckHome,
    Workbench
  },
  computed: {
    ...mapGetters([
      'level',
      'type',
      'departmentTypeId'
    ])
  },
  data () {
    return {
      current: ''
    }
  },
  created () {
    // type = 0 车场级别
    // console.log('级别类型： ', this.type)
    if (this.type === 0) {
      // 判断是不是渣土的 100044车场 100071代理商
      if (this.departmentTypeId === 100044 || this.departmentTypeId === 100071) {
        this.current = 'MuckHome'
      } else {
        this.level === 1 ? this.current = 'CloudHome' : (this.level === 2 ? this.current = 'CloudHome' : this.level === 3 ? this.current = 'ParkHome' : this.current = 'BusinessHome')
      }
      // 人脸级别
    } else if (this.type === 1) {
      // 有没欠费
      let loginType = getLoginType()
      // 登录的部门
      let loginDepId = getLoginDepId()
      // 当前部门
      let depId = this.$store.getters.departmentId
      // console.log(loginType + '-' + loginDepId + '-' + depId)
      if (loginType) {
        if (Number(loginType) === 99 && Number(loginDepId) === Number(depId)) {
          // 完全欠费且和登录的部门id是一样的
          // console.log('完全欠费且进入部门和登录的部门一样')
          this.$router.push({path: '/agentHome'})
          return
        }
      }
      this.current = 'Workbench'
      // this.current = 'agentHome'
    }
  }
}
</script>
