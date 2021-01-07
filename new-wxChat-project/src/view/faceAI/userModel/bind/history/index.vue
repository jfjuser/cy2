<!--
 * @Author: your name
 * @Date: 2020-05-10 00:00:51
 * @LastEditTime: 2020-05-20 06:45:36
 * @LastEditors: your name
 * @Description: In User Settings Edit
 * @FilePath: \weChat-project\src\view\faceAI\userModel\bind\history\index.vue
 -->
<template>
  <div>
    <x-button style="color:#ee9900;font-size:1rem">历史录入</x-button>
     <x-table :cell-bordered="false" style="background-color:#fff;">
        <thead>
          <tr>
            <th>姓名</th>
            <th>电话</th>
            <th>类型</th>
            <th>状态</th>
          </tr>
        </thead>
        <tbody>
          <tr v-for="(item, index) in userData" :key=index>
            <td>{{item.userName}}</td>
            <td>{{item.phone}}</td>
            <td>{{forType(item.type)}}</td>
            <td>{{forStatus(item.isCheck)}}</td>
          </tr>
        </tbody>
      </x-table>
      <div style="margin-top:50px;" v-show="userData.length < 1">
        暂无数据
      </div>
      <x-button style="background-color:#ee9900;margin-top:50px;color:#fff;border-radius: 0;" @click.native="backTo">返回继续添加</x-button>
      <p style="font-size:0.7rem;color:#3399ee;margin-top:1.5rem">注：该表格只做展示效果且最多十条，不可进行修改</p>
      <p style="font-size:0.7rem;color:#ee9900;margin-top:1.5rem">添加的访客不在该表中显示</p>
  </div>
</template>
<script>
import { XButton, XTable } from 'vux'
import { addHistory } from '@/api/url'
import { httpPost } from '@/utils/restful'
import { getDepInfo, getFaceInfo } from '@/utils/userInfo'
export default {
  name: '',
  components: {
    XButton,
    XTable
  },
  data () {
    return {
      listQuery: {
        offset: 1,
        limit: 10
      },
      userData: []
    }
  },
  created () {
    this.getInformation()
  },
  methods: {
    forType (type) {
      if (type === 0) return '非访客'
      if (type === 1) return '访客'
      if (type === 2) return '黑名单'
    },
    forSex (type) {
      if (type === 1) return '男'
      if (type === 2) return '女'
    },
    forStatus (type) {
      if (type === 0) return '失败'
      if (type === 1) return '审核成功'
      if (type === 2) return '审核中'
    },
    getInformation () {
      console.log(getFaceInfo())
      httpPost(addHistory, Object.assign(this.listQuery, {departmentId: Number(getDepInfo().departmentId), dutyCompanyId: Number(localStorage.getItem('dutyCompanyId'))}))
        .then((res) => {
          // console.log(res)
          this.userData = res.data.rows
        }).catch(() => {})
    },
    backTo () {
      // this.$router.push({path: '/faceAI/userModel/bind/addUser'})
      this.$router.go(-1)
    }
  }
}
</script>

<style lang="scss" scoped>

</style>
