<template>
  <div>
    <top-right-btn v-has2father="['用户绑定']" :to="`add/`">用户绑定</top-right-btn>
    <main>
        <div class="text-c" style="color: #909399;padding-top:.5rem" v-if="tableData.length===0" >暂无数据</div>

        <list-card v-for="(item, index) in tableData" :key="index">
            <van-cell-group :border="isShowColumn2Father(['删除'])">
                <van-cell title="通道名称" :value="item.localName" />
                <van-cell title="用户名称" :value="item.userName" />
            </van-cell-group>
            <template v-slot:footer>
              <van-button v-has2father="['删除']" type="danger" size="small" round @click="handleDelete(item.id)">删除</van-button>
            </template>
        </list-card>

        <van-pagination
        v-if="tableData.length!==0"
        v-model="listQuery.offset"
        :page-count="Math.ceil(total/listQuery.limit)"
        :items-per-page="listQuery.limit"
        mode="simple"
        @change="changePage"/>
    </main>
  </div>
</template>

<script>
import { Pagination, Field, Button, Cell, CellGroup, Dialog } from 'vant'
import listCard from '@/components/listCard'
import topRightBtn from '@/components/topRightBtn'
import { isShowColumn2Father } from '@/utils/formatter.js'
import { getSmallProCharge, SmallProChargeDeleteUser } from '@/api/url'
import { httpGet, httpDelete } from '@/utils/restful'
export default {
  components: {
    [Pagination.name]: Pagination,
    [Button.name]: Button,
    [Cell.name]: Cell,
    [CellGroup.name]: CellGroup,
    [Field.name]: Field,
    listCard,
    topRightBtn
  },
  data () {
    return {
      isShowColumn2Father,
      listQuery: {
        offset: 1,
        limit: 10
      },
      tableData: [],
      total: null
    }
  },
  created () {
    this.fetchData()
  },
  methods: {
    fetchData () {
      const ToastLoading = this.$toast.loading({ message: '加载中...', position: 'middle', duration: 0 })
      this.listQuery = Object.assign(this.listQuery, {departmentId: this.$store.getters.departmentId})
      httpGet(getSmallProCharge, this.listQuery).then(res => {
        if (res.data === null || res.data.rows === null) {
          this.tableData = []
          this.total = 0
        } else {
          this.tableData = res.data.rows
          this.total = res.data.total
        }
        ToastLoading.clear()
      }).catch(() => {
        ToastLoading.clear()
      })
    },
    // 分页
    changePage (val) {
      this.listQuery.offset = val
      this.fetchData()
      document.body.scrollTop = 0
    },
    // 删除选中
    handleDelete (id) {
      Dialog.confirm({
        title: '提示',
        message: '确认删除吗？'
      }).then(() => {
        const ToastLoading = this.$toast.loading({ message: '加载中...', position: 'middle', duration: 0 })
        httpDelete(SmallProChargeDeleteUser, {ids: [id]}).then(res => {
          ToastLoading.clear()
          this.fetchData()
          this.$notify({
            message: res.message,
            type: 'success'
          })
        }).catch(() => {
          ToastLoading.clear()
        })
      }).catch(() => {})
    }
  }
}
</script>
