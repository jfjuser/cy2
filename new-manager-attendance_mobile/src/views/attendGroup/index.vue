<template>
    <div class="bgc-grey full-height">
        <van-notice-bar color="#1989fa" background="#ecf9ff" left-icon="info-o">
          <router-link to="/helpCenter/?type=2" >如何邀请人进入公司？点击查看</router-link>
        </van-notice-bar>
        <section class="list">
          <van-list
          v-model="listLoading"
          :finished="finished"
          finished-text="无更多数据"
          :error.sync="error"
          error-text="请求失败，点击重新加载"
          @load="fetchData"
          >
            <template v-for="(item, index) in listData" >
                <van-panel :title="`组名称: ${item.name}`" class="panel" :key="index">
                    <van-cell title="人数" :value="`${item.userNum}人`" />
                    <van-cell title="类型" :value="attendTypeFormatter(item.type)" />
                    <div slot="footer" class="text-r">
                        <van-button size="small" type="info" round  :to="`/wxShare/?id=${item.id}`">邀请</van-button>
                        <van-button size="small" plain type="info"  round :to="`/addGroup/?id=${item.id}`" class="mar-l-10" >编辑</van-button>
                        <van-button size="small" type="danger" round class="mar-l-10" @click="del(item.id, index)">删除</van-button>
                    </div>
                </van-panel>
            </template>
          </van-list>
        </section>

        <div class="btnbox box-sizing"><van-button type="info" block round  to="/addGroup/" >添加</van-button></div>
    </div>
</template>

<script>
import { Panel, NoticeBar } from 'vant'
import { checkDataArr, attendTypeFormatter } from '@/utils/formatter'
import { AIAttendGroup } from '@/api/url'
export default {
  components: {
    'van-panel': Panel,
    'van-notice-bar': NoticeBar
  },
  data () {
    return {
      attendTypeFormatter,
      showInvitation: false,
      listData: [],
      listQuery: {
        offset: 1,
        limit: 10,
        departmentId: this.$store.getters.departmentId
      },
      finished: false,
      listLoading: false,
      error: false,
      showShare: false
      // editorLoading: false,
      // addLoading: false
    }
  },
  computed: {
    isData () {
      return checkDataArr(this.listData)
    }
  },
  methods: {
    fetchData () {
      this.$http.get(AIAttendGroup, {params: this.listQuery}).then(res => {
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
    del (id, i) {
      this.$dialog.confirm({
        closeOnPopstate: true,
        message: '确定删除吗？'
      }).then(() => {
        const ToastLoading = this.$toast.loading({ forbidClick: true, message: '加载中...', position: 'middle', duration: 0 })
        this.$http.delete(AIAttendGroup, {data: {ids: [id]}}).then(res => {
          ToastLoading.clear()
          this.listData.splice(i, 1)
          this.$toast('删除成功')
        }).catch(() => {
          ToastLoading.clear()
        })
      }).catch(() => {})
    }
  }
}
</script>

<style lang="scss" scoped>
.list {
    padding: 0px 0px 75px;
    .panel {
        margin-top: 15px;
        // border-radius: 10px;
        // overflow: hidden;
        &:first-child {
            margin-top: 0
        }
    }
}
.share {
  color: #fff;
  width: 100%;
  position: absolute;
  top: 0;
  left: 0;
  z-index: 2;
  .text {
    font-size: 14px;
    // padding-top: 20px;
    // padding-right: 20px;
    letter-spacing: 2px;
  }
  .icon {
    padding-top: 50px;
    padding-right: 40px;
    .img {
      object-fit: contain;
      height: 100px;
    }
  }
}
.btnbox {
    width: 100%;
    padding: 0 15px 15px;
    position: fixed;
    bottom: 0;
    left: 0;
}
</style>
