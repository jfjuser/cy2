<template>
  <div class="box">
    <div class="box-body body" @click="handleUser">
      <div class="box-img"><img class="img1" src="@/assets/icon/wx/bind/icon_people_1.png"/></div>
      <div class="box-title">非访客</div>
      <div class="box-remark">长期有效</div>
    </div>
    <div class="box-body body2" @click="handleVisitor">
      <div class="box-img"><img class="img2" src="@/assets/icon/wx/bind/icon_people_2.png"/></div>
      <div class="box-title">访客</div>
      <div class="box-remark">临时性来访人员添加</div>
    </div>
  </div>
</template>
<script>
import { getFaceInfo, getDepInfo } from '@/utils/userInfo.js'
import { formatterTime2, timeFormatterDayEnd } from '@/utils/formatter.js'
export default {
  components: {
  },
  data () {
    return {
    }
  },
  mounted () {
  },
  methods: {
    handleUser () {
      this.$router.push({path: '/faceAI/userModel/bind/zhLogin/'})
      // this.$router.push({path: '/faceAI/userManage/', query: {id: getFaceInfo().faceUserId, depId: getDepInfo().departmentId, type: 0}})
    },
    handleVisitor () {
      let enableTime = new Date()
      let overdueTime = new Date(enableTime.getTime() + 1 * 24 * 60 * 60 * 1000)
      this.$router.push({path: '/faceAI/userModel/bind/addUser/', query: {id: getFaceInfo().faceUserId, depId: getDepInfo().departmentId, type: 1, ot: timeFormatterDayEnd(overdueTime), et: formatterTime2(enableTime)}})
    }
  }
}
</script>
<style lang='scss' scoped>
.box {
  position: relative;
  width: 100%;
  height: 100%;
}
.box-body{
  height: 30%;
  width: 80%;
  border: 1px solid #c9cacc;
  cursor: pointer;
}
.body{
  position: absolute;
  top: 10%;
  left: 10%;
}
.body2{
  position: absolute;
  top: 45%;
  left: 10%;
}
.box-img{
  border: 1px solid #c9cacc;
  padding: 5px;
  border-radius: 48px;
  width: 48px;
  height: 48px;
  margin: 1.25rem auto .75rem;
  position: relative;
  .img1{
    position: absolute;
    top: 11px;
    left: 15px;
  }
  .img2{
    position: absolute;
    top: 12px;
    left: 14px;
  }
}
.box-title{
  font-size: 1.25rem;
  font-weight: bold;
  margin: .625rem 0;
}
.box-remark{
  font-size: .875rem;
  color: rgb(110, 110, 110);
}
</style>
