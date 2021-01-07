<template>
    <div class="contDiv">
      <NavBar title="小区模块管理" left-text="返回" right-text="创建" left-arrow @click-left="onClickLeft" @click-right="goCellModel"/>
      <Search
        v-model="listQuery.templateName"
        placeholder="请输入模板名"
        show-action
        style="text-indent:0.5em"
        shape="round"
        background="#6495ED"
        @search="onSearch"
      >
        <div slot="action" @click="onSearch">搜索</div>
      </Search>
      <Cell title="删除所有" style="color:red;margin-top:0.5rem"  @click="delAll">
        <Icon name="delete"  right-icon></Icon>
      </Cell>
      <PullRefresh v-model="isLoading" @refresh="onRefresh" style="min-height:50vh">
        <div>
          <div v-for="(item, index) in tableData" :key="index">
            <CellGroup style="margin: 1rem 0;">
              <Cell :border=false title="模板名" :value="item.templateId"/>
              <Cell :border=false title="详细信息" >
                <div v-for="(roomitem, index) in item.roomsInfo" :key="index">
                  {{roomitem.floorStart + (roomitem.floorEnd == roomitem.floorStart?'':'-'+roomitem.floorEnd) + '层，' + roomitem.roomStart + (roomitem.roomEnd == roomitem.roomStart?'':'-'+roomitem.roomEnd) + '号房；'}}
                </div>
              </Cell>
              <span style="display:block;line-height:2.5rem;color:#1E90FF;margin-left:86%;" @click="showin(item,index)">操作</span>
            </CellGroup>
          </div>
        </div>
        <div style="width:100%;height:22rem;text-align:center" v-show="imgShow">
            <img src="@/assets/noData (2).png" style="max-width:300px;max-height:300px"/>
        </div>
      </PullRefresh>
      <div style="width:100vw" id="asd" v-show="!imgShow">
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
          <Button size="large" @click="delOne">删除</Button>
          <Button size="large" @click="showdialog = true, buildingval = ''">应用</Button>
          <!-- <Button size="large" @click="lookModel">查看模板</Button> -->
          <Button size="large" @click="show = false">取消</Button>
      </Popup>
      <van-dialog
        v-model="showdialog"
        title="应用"
        show-cancel-button
        :before-close="dialogclose"
      >
        <Field required v-model="buildingval" placeholder="请输入具体栋号" label="楼栋"  />
      </van-dialog>
      <Popup v-model="showModel" position="right">
        <div class="lookmodelbox">
          <div class="close"><Button type="default" @click="showModel = false">关闭</Button></div>
          <PlanModel :planData="lookPlanData"></PlanModel>
        </div>
      </Popup>
    </div>
</template>

<script>
import { NavBar, Search, Pagination, Popup, PullRefresh, Toast, Cell, CellGroup, Icon, Dialog, Button, Field } from 'vant'
import { showModel, deleteModel, deleteAllModel, userTemplateReplaceRooms } from '@/api/url'
import { httpPost, httpGet, httpDelete } from '@/utils/restful'
import PlanModel from './components/PlanModel'

export default {
  components: {
    NavBar,
    Search,
    Pagination,
    Popup,
    PullRefresh,
    Cell,
    CellGroup,
    Icon,
    Button,
    Field,
    PlanModel
  },
  data () {
    return {
      value: '',
      listQuery: {
        offset: 1,
        limit: 5,
        leader: undefined,
        templateName: undefined
      },
      total: null,
      imgShow: false,
      isLoading: false,
      tableData: [],
      show: false,
      rowItem: [],
      itemIndex: undefined,
      showdialog: false,
      buildingval: '',
      showModel: false,
      lookPlanData: []
    }
  },
  created () {
    this.fetchData()
  },
  methods: {
    onClickLeft () {
      this.$router.push('/staffManage/')
    },
    goCellModel () {
      this.$router.push('/cellModel/')
    },
    onSearch () {
      this.listQuery.offset = 1
      this.fetchData()
    },
    seePage (val) {
      this.listQuery.offset = val
      this.fetchData()
    },
    onRefresh () {
      setTimeout(() => {
        this.fetchData()
        Toast('刷新成功')
        this.isLoading = false
      }, 500)
    },
    // 获取数据
    fetchData () {
      this.listQuery = Object.assign(this.listQuery, {departmentId: this.$store.getters.departmentId})
      httpGet(showModel, this.listQuery).then(res => {
        if (res.data.rows.length === 0) {
          this.imgShow = true
        }
        if (res.data === null || res.data.rows === null) {
          this.tableData = []
          this.total = 0
        } else {
          this.tableData = res.data.rows
          this.total = res.data.total
        }
      }).catch(() => {
      })
    },
    // 删除所有
    delAll () {
      Dialog.confirm({
        message: '确认删除所有的模板吗？',
        title: '提示'
      })
        .then(() => {
          this.memberId = this.$store.getters.departmentId
          httpDelete(deleteAllModel + '/' + this.memberId).then(res => {
            this.fetchData()
            Toast({
              type: 'success',
              message: res.message,
              duration: 4 * 1000
            })
          }).catch(() => {
          })
        }).catch(() => {})
    },
    delOne () {
      httpDelete(deleteModel, {selectArrayId: [this.rowItem.templateId], departmentId: Number(this.$store.getters.departmentId)}).then(res => {
        this.fetchData()
        Toast({
          type: 'success',
          message: res.message,
          duration: 4 * 1000
        })
      }).catch(() => {
      })
      this.show = false
    },
    // 操作
    showin (item, index) {
      this.show = !this.show
      this.rowItem = item
      this.itemIndex = index
    },
    // 应用
    dialogclose (action, done) {
      if (action === 'confirm') {
        let value = this.buildingval
        let row = this.rowItem
        if (!value || value === '') {
          done(false)
          return
        }
        httpPost(userTemplateReplaceRooms, {
          departmentId: this.$store.getters.departmentId,
          templateName: row.templateId,
          buildingName: value,
          templateRooms: row.templateRooms
        }).then((res) => {
          this.show = false
          done()
          Toast.success(res.message)
        }).catch(() => {
          done()
          Toast.fail('操作失败')
        })
      }
      done()
    },
    lookModel () {
      let row = this.rowItem
      this.lookPlanData = row.templateRooms
      this.showModel = true
    }
  }
}
</script>

<style lang="scss" scoped>
.contDiv{
  background-color: rgb(245,245,245)
}
.close {
  text-align: right;
  padding: .5rem;
}
.lookmodelbox {
  width:100vw;
  height:100vh;
}
</style>
<style scoped>
#asd >>> .van-pagination__item--disabled, .van-pagination__item--disabled:active {
  color:red;
}
</style>
