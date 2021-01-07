<template>
  <div class="container2">
    <NavBar
      title="班次管理"
      left-text="返回"
      right-text="添加"
      left-arrow
      @click-left="onClickLeft"
      @click-right="onClickRight"
      />
      <van-tabs v-model="active" @click="clickTab">
        <van-tab title="班次管理"></van-tab>
        <van-tab title="考勤组管理"></van-tab>
      </van-tabs>
      <Search
        v-model="listQuery.name"
        placeholder="班次名称"
        show-action
        @search="onSearch"
      >
        <Button slot="action" @click="onSearch" type="info" size="small">搜索</Button>
      </Search>
      <!-- <Button size="large" @click="checkAttend">查看考勤组管理</Button>
      <Button size="large" type="info">班次管理</Button> -->
      <div>
        <PullRefresh v-model="isLoading" @refresh="onRefresh" style="min-height:50vh">
          <van-row>
            <van-col span="6" class="listCss">班次名称</van-col>
            <van-col span="13" class="listCss">考勤时间</van-col>
            <van-col span="5" class="listCss">操作</van-col>
          </van-row>
          <van-row v-for="(item, index) in tableData" :key=index>
            <van-col span="6" class="listCss">{{item.name}}</van-col>
            <van-col span="13" class="listCss">{{item.workTimeAt}}</van-col>
            <van-col span="5" class="listCss"><Button type="info" plain size="small" @click="operate(item)">选项</Button></van-col>
          </van-row>
          <van-row v-show="isHasData">
            <van-col span="24" class="notData">暂无数据</van-col>
          </van-row>
        </PullRefresh>
        <!-- <PullRefresh v-model="isLoading" @refresh="onRefresh">
          <div style="width:90vw;margin:0.5rem 0 0 5vw;">
            <div v-for="(item, index) in tableData" :key="index">
              <CellGroup style="border:1px solid #ccc;margin-top: 1.5rem;">
                <Cell title="班次名称" :value="item.name"/>
                <Cell title="考勤时间" :value="item.workTimeAt"/>
                <span style="display:block;line-height:2.5rem;color:#1E90FF;margin-left:86%;" @click="operate(item)">操作</span>
              </CellGroup>
            </div>
          </div>
          <div style="width:100%;height:22rem;text-align:center" v-show="total == ''">
            <img src='@/assets/noData.png' style="max-width: 300px;max-height: 300px;"/>
          </div>
        </PullRefresh> -->
        <div style="margin-top:1rem" v-show="total > 5" id="asd">
        <Pagination
          v-model="listQuery.offset"
          :page-count="Math.ceil(total/10)"
          :total-items = 'total'
          mode="simple"
          @change="seePage"
        >
        </Pagination>
        </div>
        <Popup v-model="show" position="bottom">
          <Button size="large" v-if="share.includes('删除')" @click="delInfo">删除</Button>
          <Button size="large" v-if="share.includes('编辑')" @click="editContent">编辑</Button>
          <Button size="large" @click="cancel">取消</Button>
        </Popup>
      </div>
  </div>
</template>
<script>
import { NavBar, Toast, Search, Pagination, Icon, Button, Row, Cell, Col, Popup, PullRefresh, Field, Dialog, CellGroup, Tab, Tabs } from 'vant'
import { httpGet, httpDelete } from '@/utils/restful'
import { getAIShifts, AIShifts } from '@/api/url'
export default {
  name: 'attendManage',
  data () {
    return {
      show: false,
      message: {
        err: ''
      },
      isLoading: false,
      selectArrayId: [],
      share: [],
      info: undefined,
      isHasData: false,
      isAdd: false,
      addform: {
        name: undefined
      },
      listQuery: {
        name: undefined,
        offset: 1,
        limit: 10
      },
      tableData: undefined,
      total: undefined,
      active: 0
    }
  },
  components: {
    NavBar,
    Icon,
    Search,
    Button,
    Cell,
    PullRefresh,
    'van-row': Row,
    'van-col': Col,
    Popup,
    Field,
    Pagination,
    CellGroup,
    'van-tabs': Tabs,
    'van-tab': Tab
  },
  methods: {
    onClickLeft () {
      this.$router.push('/indexPage/')
    },
    filterArr () {
      // this.$store.getters.permissionFun
      JSON.parse(window.sessionStorage.getItem('list')).map(item => {
        if (item.name === '考勤管理') {
          item.children.map(it => {
            if (it.name === '班次管理') {
              this.share = it.roles
            }
          })
        }
      })
    },
    onClickRight () {
      this.$router.push('/classes/')
    },
    // 查看考勤组管理
    checkAttend () {
      this.$router.push('/attendGroup/')
    },
    seePage (val) {
      this.listQuery.offset = val
      this.fetchData()
    },
    // 刷新
    onRefresh () {
      setTimeout(() => {
        this.listQuery = {
          name: undefined,
          limit: 10,
          offset: 1
        }
        this.fetchData()
        this.$toast('刷新成功')
        this.isLoading = false
      }, 500)
    },
    // 搜索
    onSearch () {
      this.listQuery.offset = 1
      this.fetchData()
    },
    cancel () {
      this.show = false
    },
    // 获取数据
    fetchData () {
      this.listQuery = Object.assign(this.listQuery, {departmentId: this.$store.getters.departmentId})
      httpGet(getAIShifts, this.listQuery).then(res => {
        if (res.data === null || res.data.rows.length === 0) {
          this.tableData = []
          this.total = 0
          this.isHasData = true
        } else {
          this.tableData = res.data.rows
          this.total = res.data.total
        }
        console.log(res)
      }).catch(() => {})
    },
    // 操作选项
    operate (item) {
      this.show = true
      this.selectArrayId[0] = item.id
      this.info = item
    },
    // 编辑
    editContent () {
      this.$router.push({path: '/attemdManage/', name: 'classes', params: {dataObj: this.info}})
    },
    // 删除
    delInfo () {
      Dialog.confirm({message: '确认删除吗？', title: '提示'})
        .then(() => {
          httpDelete(AIShifts, {ids: this.selectArrayId}).then(res => {
            this.fetchData()
            Toast({
              type: 'success',
              message: res.message,
              duration: 4 * 1000
            })
            this.show = false
          }).catch(() => {
          })
        }).catch(() => {})
    },
    clickTab (index, title) {
      if (index === 1) {
        this.checkAttend()
      }
    }
  },
  created () {
    this.fetchData()
    this.filterArr()
  }
}
</script>
<style lang="scss" scoped>
.container2{
  height: 100vh;
  font-size:0.75rem
}
.listCss{
  text-align:center;
  border:1px solid #ccc;
  line-height: 3rem;
  // padding-top:3%
}
.notData{
  text-align: center;
  line-height: 7rem;
  width:92vw;
  border-radius:8px;
  box-shadow:0 0 12px #ccc;
  margin-left:4vw;
  // position:absolute;
  // top:4rem;
  margin-top:4rem;
  height:7rem;
  background:#fff;
  font-size: 1.1rem;
  letter-spacing: 0.1rem;
  border:1px solid #ccc;
}
.card{
  width:92vw;
  border-radius:8px;
  box-shadow:0 0 12px #ccc;
  margin-left:4vw;
  // position:absolute;
  // top:4rem;
  margin-top:5rem;
  height:7rem;
  background:#fff
}
</style>

<style scoped>
.container2 >>> .van-tabs__line {
  background-color: #1989fa
}
#asd >>> .van-pagination__item--disabled, .van-pagination__item--disabled:active {
  color:rgb(14,105,254)
}
</style>
