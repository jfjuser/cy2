<template>
    <div class="page bgc-grey full-height">
      <van-notice-bar color="#1989fa" background="#ecf9ff" left-icon="info-o">
        左滑可删除，点击更多查看更多
      </van-notice-bar>
        <form action="/"><van-search placeholder="请输入姓名" v-model="listQuery.userName" @search="onSearch" /></form>
                    <van-sticky>
                      <div v-show="ifBatchDeletion" class="batchDeletion" @click="ifBatchDeletion = false">  <van-button type="info" size="small">点击批量删除</van-button></div>
                      <div v-show="!ifBatchDeletion" class="batchDeletion" >
                        <van-button type="default" size="small" @click="ifBatchDeletionFalse">取消</van-button>
                        <van-button style="margin-left:10px" type="danger" size="small" @click="batchDeletion">删除</van-button>
                        </div>
 </van-sticky>
        <section class="list">

            <van-checkbox-group v-model="result">
            <van-cell-group>
              <template v-for="(item, index) in listData">
                <van-swipe-cell :key="index">
                  <van-cell is-link @click="showInfo(item,index)" center >
                    <div slot="title" class="flex-align-items">
                      <van-image :src="'data:image/jpeg;base64,' + item.file" class="head" width="40" height="40" round >
                          <!-- <template v-slot:loading>{{item.userName?item.userName.slice(-1):''}}</template> -->
                      </van-image>
                      {{item.userName}}
                    </div>
                          <template #right-icon >
        <van-checkbox :name="item" ref="checkboxes" v-if="!ifBatchDeletion" />
      </template>
                  </van-cell>
                  <template slot="right" >
                    <van-button  square type="danger" text="删除" style="height: 100%;" @click="handleDel(item.userId, index)" />
                  </template>
                </van-swipe-cell>
              </template>
            </van-cell-group>
            </van-checkbox-group>
        </section>
    </div>
</template>

<script>
import { SwipeCell, NoticeBar, Search, Field, Sticky, Checkbox, CheckboxGroup } from 'vant'
import { delApproveUser, adaptNewInfo, listApproveUser } from '@/api/url'
import { checkDataArr, toNull } from '@/utils/formatter'
export default {
  components: {
    'van-swipe-cell': SwipeCell,
    'van-notice-bar': NoticeBar,
    'van-search': Search,
    'van-fied': Field,
    'vanSticky': Sticky,
    'vanCheckboxGroup': CheckboxGroup,
    'vanCheckbox': Checkbox
  },
  data () {
    return {
      result: [], // 选中的结果
      ifBatchDeletion: true, // 是否批量删除
      show: false,
      isAda: false,
      isShow: false,
      listData: [],
      item: {},
      listQuery: {
        offset: 1,
        limit: 999,
        departmentId: this.$store.getters.departmentId
      },
      finished: false,
      listLoading: false,
      error: false,
      infoData: {}
    }
  },
  computed: {
    isData () {
      return checkDataArr(this.listData)
    }
  },
  created () {
    this.fetchData()
  },
  methods: {
    // 批量删除审批员
    ifBatchDeletionFalse () {
      this.ifBatchDeletion = true
      this.$forceUpdate()
    },
    batchDeletion () {
      let list = []
      this.result.forEach(ele => {
        list.push(ele.userId)
      })
      const ToastLoading = this.$toast.loading({ forbidClick: true, message: '加载中...', position: 'middle', duration: 0 })
      this.$http.post(delApproveUser, {departmentId: this.$store.getters.departmentId, list: list})
        .then(res => {
          ToastLoading.clear()
          this.listQuery.offset = 1
          this.listData = []
          this.fetchData()
        }).catch(() => { ToastLoading.clear() })
    },
    showInfo (item, index) {
      this.infoData = item
      this.show = true
    },
    saveUpdate () {
      this.$http.put(adaptNewInfo, this.item).then((res) => {
        console.log(res)
        this.$toast.success(res.message)
        this.isAda = false
        this.show = false
      }).catch(() => {})
    },
    adaptInfo () {
      this.item = JSON.parse(JSON.stringify(this.infoData))
      this.isShow = true
    },
    fetchData () {
      this.listQuery.userName = toNull(this.listQuery.userName)
      // console.log('检测需要的参数： ', this.listQuery)
      this.$http.post(listApproveUser, this.listQuery).then(res => {
        this.listData = this.listData.concat(res.data.rows)
      }).catch(() => {
      })
    },
    onSearch () {
      this.listQuery.offset = 1
      this.listData = []
      this.fetchData()
    },
    handleDel (id, index) {
      this.$dialog.confirm({
        closeOnPopstate: true,
        message: '确定删除吗？'
      }).then(() => {
        const ToastLoading = this.$toast.loading({ forbidClick: true, message: '加载中...', position: 'middle', duration: 0 })
        this.$http.post(delApproveUser, {departmentId: this.$store.getters.departmentId, list: [id]})
          .then(res => {
            ToastLoading.clear()
            this.listData.splice(index, 1)
            this.$toast.success('删除成功')
          }).catch(() => { ToastLoading.clear() })
      }).catch(() => {})
    }
  }
}
</script>

<style lang="scss" scoped>
.infobox {
  width: 300px;
}
.page /deep/ .van-popup {
  border-radius: 5px;
}
.list {
  .head {
    margin-right: 10px;
  }
}
.batchDeletion{
  display: flex;
  width: 100vw;
  justify-content: flex-end;
}
</style>
