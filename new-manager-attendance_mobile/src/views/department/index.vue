<template>
    <div class="bgc-grey full-height">
        <form action="/"><van-search placeholder="请输入部门" v-model.trim="listQuery.leader" @search="onSearch" /></form>
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
              <van-cell :title="item.leader" is-link @click="goDepaInfo(item.id, item)" :key="index" />
            </template>
          </van-cell-group>
        </van-list>
        <div class="height"></div>
        <div class="btnbox box-sizing"><van-button type="info" block  round to="/addDepa/">添加</van-button></div>
    </div>
</template>

<script>
import { Search } from 'vant'
import { checkDataArr, toNull } from '@/utils/formatter'
import { getAllDepartment } from '@/api/url'
export default {
  components: {
    'van-search': Search
  },
  data () {
    return {
      listData: [],
      listQuery: {
        leader: '',
        offset: 1,
        limit: 10,
        departmentId: this.$store.getters.departmentId
      },
      finished: false,
      listLoading: false,
      error: false
      // addLoading: false
    }
  },
  computed: {
    isData () {
      return checkDataArr(this.listData)
    }
  },
  methods: {
    goDepaInfo (id, data) {
      this.$router.push(`/depaInfo/?data=${encodeURI(JSON.stringify(data))}`)
    },
    fetchData () {
      this.listQuery.userName = toNull(this.listQuery.userName)
      this.$http.get(getAllDepartment, {params: this.listQuery}).then(res => {
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
    }
  }
}
</script>

<style lang="scss" scoped>
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
</style>
