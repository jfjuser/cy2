<template>
    <NewMap class="map" :data="data.departmentInfoList"></NewMap>
</template>

<script>
import NewMap from './components/NewMap'
import { timeFormatterSort } from '@/utils/formatter.js'
import { cloudData } from '@/api/url'
import { httpGet } from '@/utils/restful.js'
export default {
  components: {
    NewMap
  },
  data () {
    return {
      data: {
        departmentInfoList: []
      },
      listQuery: {
        beginTime: undefined,
        endTime: undefined
      }
    }
  },
  created () {
    // 单独请求地图数据
    this.handleFilter()
  },
  methods: {
    handleFilter () {
      const ToastLoading = this.$toast.loading({ message: '加载中...', position: 'middle', duration: 0 })
      this.listQuery.beginTime = timeFormatterSort(new Date() - 3600 * 1000 * 24) + ' 00:00:00'
      this.listQuery.endTime = timeFormatterSort(new Date() - 3600 * 1000 * 24) + ' 23:59:59'
      this.listQuery = Object.assign(this.listQuery, {departmentId: this.$store.getters.departmentId})
      httpGet(cloudData, this.listQuery)
        .then(res => {
          ToastLoading.clear()
          if (res.data !== null) {
            this.data.departmentInfoList = res.data.departmentInfoList
          }
        }).catch(() => { ToastLoading.clear() })
    }
  }
}
</script>

<style lang="scss" scoped>
.map {
    width: 100%;
    height: 100vh;
}
</style>
