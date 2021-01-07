<template>
    <div class="bgc-grey full-height">
        <section class="list baseBox">
            <van-list
            v-model="listLoading"
            :finished="finished"
            finished-text="无更多数据"
            :error.sync="error"
            error-text="请求失败，点击重新加载"
            @load="fetchData"
            >
              <template v-for="(item, index) in listData" >
                  <van-panel :title="`班次名称: ${item.name}`" class="panel" :key="index">
                      <van-cell title="考勤时间" :value="item.workTimeAt" />
                      <div slot="footer" class="text-r">
                          <van-button size="small" plain type="info" round  :to="`/addShifts/?id=${item.id}`">编辑</van-button>
                          <van-button size="small" type="danger" round class="mar-l-10" @click="del(item.id, index)">删除</van-button>
                      </div>
                  </van-panel>
              </template>
            </van-list>
        </section>

        <div class="btnbox box-sizing"><van-button type="info" block  round to="/addShifts/">添加</van-button></div>
    </div>
</template>

<script>
import { Panel } from 'vant'
import { checkDataArr } from '@/utils/formatter'
import { AIShifts, getAIShifts } from '@/api/url'
export default {
  components: {
    'van-panel': Panel
  },
  data () {
    return {
      listData: [],
      listQuery: {
        name: undefined,
        offset: 1,
        limit: 10,
        departmentId: this.$store.getters.departmentId
      },
      finished: false,
      listLoading: false,
      error: false
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
      this.$http.get(getAIShifts, {params: this.listQuery}).then(res => {
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
        const from = {
          ids: [id],
          departmentId: this.$store.getters.departmentId
        }
        const ToastLoading = this.$toast.loading({ forbidClick: true, message: '加载中...', position: 'middle', duration: 0 })
        this.$http.delete(AIShifts, {data: from}).then(res => {
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
    // padding: 0 0 75px;
    .panel {
        margin-top: 15px;
        &:first-child {
            margin-top: 0
        }
    }
}
.box-sizing{
  border-top: 2px solid #eee;
  background: #ffffff;
  padding: 15px 15px;
}
.btnbox {
    width: 100%;

    position: fixed;
    bottom: 0;
    left: 0;
}
</style>
