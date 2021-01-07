<template>
  <div>
    <topRightBtn @click.native="fetchData">刷新</topRightBtn>
    <main>
      <div class="text-c" style="color: #909399;padding-top:.5rem" v-if="tableData.length===0" >暂无数据</div>
      <list-card v-for="(item, index) in tableData" :key="index">
          <van-cell-group :border="false">
              <van-cell title="通道名称" :value="item.localName" />
              <van-cell title="车道ID" :value="item.point" />
              <van-cell title="车道编码" :value="item.localId" />
              <van-cell title="状态">
                <span style="color:#67c23a" v-if="item.status === 1">在线</span>
                <span style="color:#f56c6c" v-if="item.status === 0">离线</span>
              </van-cell>
              <van-cell title="最近在线时间" :value="timeFormatter(item.loginAt)" />
              <van-cell title="最近离线时间" :value="timeFormatter(item.loginOutAt)" />
              <van-cell title="出/入口" :value="inOutFormatter(item.type)" />
              <van-cell title="MAC地址" :value="item.mac" />
              <van-cell title="配置状态" :value="initFormatter(item.init)" />
          </van-cell-group>
          <template v-slot:footer>
            <van-button v-has="['编辑']" type="info" size="small" round @click="handleUpdate(item)">编辑</van-button>
            <van-button v-has="['删除']" type="danger" size="small" round @click="handleDelete(item.id)">删除</van-button>
            <van-button v-has="['校时']" type="info" size="small" round @click="handleTimeUp(item.id)">校时</van-button>
            <van-button v-has="['重启']" type="info" size="small" round @click="handleReBoot(item.id)">重启</van-button>
            <van-button v-has="['开闸']" type="info" size="small" round @click="switchEd(item.id)">开闸</van-button>
          </template>
      </list-card>
      <van-popup v-model="dialogVisible" style="width:90vw">
        <div>
          <van-field label="通道名称" clearable v-model="form.localName"/>
          <van-field label="唯一标识" v-model="form.unicode"/>
        </div>
         <div style="text-align:center">
          <van-button style="margin:0.5rem;border-radius:0.35rem" @click="dialogVisible = false">取消</van-button>
          <van-button type="info" :loading="updateLoading" @click="createData" style="margin:0.5rem;border-radius:0.35rem">确定</van-button>
        </div>
      </van-popup>
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
import topRightBtn from '@/components/topRightBtn'
import listCard from '@/components/listCard'
import { Pagination, Button, Cell, Notify, Popup, Field, Dialog, CellGroup } from 'vant'
import { inOutFormatter, initFormatter, timeFormatter } from '@/utils/formatter'
import { httpGet, httpPost, httpDelete, httpPut } from '@/utils/restful'
import { getDeviceStatus, updateDeviceStatus, switchById, timeUp, reboot, deleteDeviceStatus } from '@/api/url'
export default {
  data () {
    return {
      tableData: [],
      inOutFormatter: inOutFormatter,
      timeFormatter: timeFormatter,
      initFormatter: initFormatter,
      dialogVisible: false,
      updateLoading: false,
      listQuery: {
        offset: 1,
        limit: 10
      },
      total: null,
      form: {
        id: undefined,
        localName: undefined,
        unicode: undefined
      }
    }
  },
  components: {
    topRightBtn,
    listCard,
    [Field.name]: Field,
    [Popup.name]: Popup,
    [Button.name]: Button,
    [Pagination.name]: Pagination,
    [Cell.name]: Cell,
    [CellGroup.name]: CellGroup
  },
  methods: {
    changePage (val) {
      this.listQuery.offset = val
      this.fetchData()
      document.body.scrollTop = 0
    },
    // 重启
    handleReBoot (id) {
      Dialog.confirm({
        title: '提示',
        message: '确认重启相机吗？'
      }).then(() => {
        httpPost(reboot + id).then(res => {
          Notify({
            message: res.message,
            type: 'success',
            duration: 4 * 1000
          })
        }).catch(() => {})
      }).catch(() => {})
    },
    createData () {
      this.updateLoading = true
      const updateFormData = Object.assign({}, this.form)
      httpPut(updateDeviceStatus, updateFormData).then(res => {
        this.fetchData()
        this.dialogVisible = false
        setTimeout(() => { this.updateLoading = false }, 300)
        Notify({
          message: res.message,
          type: 'success',
          duration: 4 * 1000
        })
      }).catch(() => {
        this.updateLoading = false
      })
    },
    // 校时
    handleTimeUp (id) {
      Dialog.confirm({
        title: '提示',
        message: '确认对相机进行校时吗？'
      }).then(() => {
        httpPost(timeUp + id).then(res => {
          Notify({
            message: res.message,
            type: 'success',
            duration: 4 * 1000
          })
        }).catch(() => {})
      }).catch(() => {})
    },
    // 编辑
    handleUpdate (row) {
      this.form = Object.assign({}, row)
      this.dialogVisible = true
    },
    // 删除
    handleDelete (id) {
      Dialog.confirm({
        title: '提示',
        message: '确定删除吗？'
      }).then(() => {
        const ToastLoading = this.$toast.loading({ message: '加载中...', position: 'middle', duration: 0 })
        httpDelete(deleteDeviceStatus, {ids: [id]}).then(res => {
          ToastLoading.clear()
          this.fetchData()
          Notify({
            type: 'success',
            message: res.message,
            duration: 4 * 1000
          })
        }).catch(() => {
          ToastLoading.clear()
        })
      }).catch(() => {})
    },
    // 开闸
    switchEd (id) {
      Dialog.confirm({
        title: '提示',
        message: '确定开闸吗？'
      }).then(() => {
        httpPost(switchById + id).then(res => {
          Notify({
            message: res.message,
            type: 'success',
            duration: 4 * 1000
          })
        }).catch(() => {})
      }).catch(() => {})
    },
    fetchData () {
      const ToastLoading = this.$toast.loading({ message: '加载中...', position: 'middle', duration: 0 })
      httpGet(getDeviceStatus + this.$store.getters.departmentId, this.listQuery).then(res => {
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
    }
  },
  created () {
    this.fetchData()
  }
}
</script>

<style>

</style>
