<template>
    <div class="page bgc-grey full-height">
      <van-notice-bar color="#1989fa" background="#ecf9ff" left-icon="info-o">
        左滑可删除，点击更多查看更多
      </van-notice-bar>
        <form action="/"><van-search placeholder="请输入姓名" v-model="listQuery.userName" @search="onSearch" /></form>
        <!-- <p style="text-align: right;"><van-button type="info" size="small">人员同步</van-button></p> -->
        <section class="list">
          <van-list
            v-model="listLoading"
            :finished="finished"
            finished-text="无更多数据"
            :error.sync="error"
            error-text="请求失败，点击重新加载"
            @load="fetchData"
            >
            <van-cell-group>
              <template v-for="(item, index) in listData">
                <van-swipe-cell :key="index">
                  <van-cell is-link @click="showInfo(item)" center value="更多">
                    <div slot="title" class="flex-align-items">
                      <van-image class="full-img head" width="40" height="40" round :src="'data:image/jpeg;base64,' + item.file">
                          <!-- <template v-slot:loading>{{item.userName?item.userName.slice(-1):''}}</template> -->
                      </van-image>
                      {{item.userName}}
                    </div>
                    <!-- <van-icon slot="right-icon" name="more-o" style="line-height: inherit;"/> -->
                  </van-cell>

                  <template slot="right">
                    <van-button square type="danger" text="删除" style="height: 100%;" @click="handleDel(item.id, index)" />
                  </template>
                </van-swipe-cell>
              </template>
            </van-cell-group>
          </van-list>
        </section>

        <van-popup v-model="show">
          <div class="infobox">
            <van-cell-group>
                <van-cell title="姓名" :value="infoData.userName" />
                <!-- <van-cell title="部门" value="xx部" /> -->
                <van-cell title="手机号" :value="infoData.phone" />
                <van-cell title="同步状态" :value="infoData.aiPower" />
            </van-cell-group>
            <div style="text-align:center">
              <van-button style="width:100%;" @click="isAda = true" type="info">操作</van-button>
            </div>
          </div>
        </van-popup>
        <van-popup v-model="isAda" posinset="bottom">
          <div class="infobox">
            <van-button size=large @click="adaptInfo">修改信息</van-button>
            <van-button size=large  @click="setAdmin">设为审批员</van-button>
            <van-button size=large  @click="toModifyChannel">修改通道</van-button>
          </div>
        </van-popup>
        <van-popup v-model="isShow">
          <div class="infobox" style="height:150px">
            <van-fied label="姓名" v-model="item.userName"/>
            <van-fied label="手机号" :maxlength=11 typy="number" v-model="item.phone"/>
          </div>
          <div style="text-align:center">
            <van-button style="width:100%" @click="saveUpdate" type="info">保存</van-button>
          </div>
        </van-popup>
        <div class="height"></div>
        <div class="btnbox box-sizing"><van-button type="info" block  round >人员同步</van-button></div>
    </div>
</template>

<script>
import { SwipeCell, NoticeBar, Search, Field } from 'vant'
import { lookMember, adaptNewInfo, insert } from '@/api/url'
import { checkDataArr, toNull } from '@/utils/formatter'
export default {
  components: {
    'van-swipe-cell': SwipeCell,
    'van-notice-bar': NoticeBar,
    'van-search': Search,
    'van-fied': Field
  },
  data () {
    return {
      show: false,
      isAda: false,
      isShow: false,
      listData: [],
      item: {},
      listQuery: {
        isCheck: 1,
        userName: '',
        offset: 1,
        limit: 15,
        type: 0,
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
  methods: {
    toModifyChannel () {
      this.$router.push({ path: '/modifyChannel', query: { aiUserId: this.infoData.id } })
    },
    showInfo (data) {
      this.infoData = data
      console.log(data)
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

      this.$http.post(`${lookMember}?offset=${this.listQuery.offset}&limit=${this.listQuery.limit}`, this.listQuery).then(res => {
        this.listQuery.offset = this.listQuery.offset + 1
        this.error = false
        if (res.data && res.data.rows) {
          this.listData = this.listData.concat(res.data.rows)

          this.listLoading = false
          if (res.data.rows.length < this.listQuery.limit) {
            this.finished = true
          }
        } else {
          this.listLoading = false
          this.finished = true
        }
      }).catch(() => {
        this.listLoading = false
        this.error = true
      })
    },
    onSearch () {
      this.listQuery.offset = 1
      this.listData = []
      this.fetchData()
    },
    setAdmin () {
      this.$dialog.confirm({
        closeOnPopstate: true,
        message: '确定将该用户设为审批员吗？'
      }).then(() => {
        // let config = {
        //   baseURL: 'http://192.168.0.227:9000/pb/pv'
        // }
        this.$http.post(insert, {
          list: [this.infoData.id],
          departmentId: this.$store.getters.departmentId
        }).then((res) => {
          this.$toast.success(res.message)
          this.isShow = false
          this.isShow = false
        }).catch(() => {})
      }).catch(() => {})
    },
    handleDel (id, index) {
      this.$dialog.confirm({
        closeOnPopstate: true,
        message: '确定删除吗？'
      }).then(() => {
        const from = {
          ids: [id],
          departmentId: this.$store.getters.departmentId
        }
        const ToastLoading = this.$toast.loading({ forbidClick: true, message: '加载中...', position: 'middle', duration: 0 })
        this.$http.delete(lookMember, {data: from})
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
.height {
  height: 75px;
}
.btnbox {
    width: 100%;
    padding: 0 15px 15px;
    position: fixed;
    bottom: 0;
    left: 0;
}
.box-sizing{
  border-top: 2px solid #eee;
  background: #ffffff;
  padding: 15px 15px;
}
</style>
