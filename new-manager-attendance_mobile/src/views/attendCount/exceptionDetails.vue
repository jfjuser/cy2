<template>
  <div>
    <NavBar
      :title="type"
      left-text="返回"
      left-arrow
      @click-left="onClickLeft"
    />
    <van-cell-group>
      <!-- <van-cell value="详情" is-link> -->
       <van-cell v-for="item in listData" :key="item.id">
     <!-- 使用 title 插槽来自定义标题 -->
        <template #title>
          <span class="custom-title">{{item.userName}}</span>
        </template>
      </van-cell>
    </van-cell-group>
  </div>
</template>
<script>
import {NavBar, Cell, CellGroup} from 'vant'
import {Exception} from '@/api/url'
export default {
  name: '',
  data () {
    return {
      status: {boolean: {1: '缺卡', 2: '迟到', 3: '早退', 4: '旷工'}}, // 审核状态
      type: '',
      listData: []
    }
  },
  created () {
    this.type = this.status.boolean[Number(this.$route.query.type)]
    this.getDate()
  },
  methods: {
    onClickLeft () { // 返回按钮
      this.$router.go(-1)
    },
    getDate () {
      let beginTime = this.$route.query.date + ' 00:00:00'
      let endTime = this.$route.query.date + ' 23:59:59'
      let departmentId = this.$store.getters.departmentId
      let type = this.$route.query.type
      this.$http.get(Exception, {params: {
        beginTime: beginTime,
        endTime: endTime,
        departmentId: departmentId,
        type: type
      }}).then(res => {
        let list = []
        res.data.rows.forEach(ele => {
          if (ele !== null) {
            list.push(ele)
          }
        })
        this.listData = list
      })
    }
  },
  components: {
    NavBar,
    vanCell: Cell,
    vanCellGroup: CellGroup
  }
}
</script>
<style lang='scss' scoped>
</style>
