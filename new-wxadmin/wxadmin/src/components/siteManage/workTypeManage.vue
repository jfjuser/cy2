<template>
  <div class="computer">
    <NavBar
      title="工种管理"
      left-text="返回"
      right-text="添加工种"
      left-arrow
      @click-left="onClickLeft"
      @click-right="onClickRight"
    />
    <Popup v-model="isAdd" style="width:96vw;height:10rem">
      <Field label="工种名称" placeholder="请输入工种名称" style="margin-top:1rem" v-model="workTypeInsertDto.workName"/>
      <div style="margin-top:25px;display:flex;justify-content:center">
        <Button @click="cancel" style="width:25vw;margin-right:6vw;">取消</Button>
        <Button v-show="select === 1" type="info" @click="update" style="width:25vw;margin-left:6vw">修改</Button>
        <Button v-show="select === 0" :disabled="setloading" @click="addWorkType" type="info" style="width:25vw;margin-left:6vw">确定</Button>
      </div>
    </Popup>
    <Collapse v-model="activeNames">
      <CollapseItem title="工种列表" name="1">
        <CheckboxGroup v-model="checkedType">
          <CellGroup>
            <Cell
              v-for="(item, index) in usefulData"
              clickable
              :key="index"
              :title="`${item.workName}`"
              @click="toggle(index)"
            >
              <Checkbox :name="item.id" ref="checkboxes" />
            </Cell>
          </CellGroup>
          <Button type="primary" @click="goDefault" style="width:50vw;margin:2rem 0 0 22vw;border-radius:8px">保存</Button>
        </CheckboxGroup>
      </CollapseItem>
    </Collapse>
    <div style="margin-top:2rem;border:1px solid #ccc;border-radius:10px" v-show="total!== 0">
      <van-row style="border:1px solid #ccc;">
        <van-col span="16" class="spanTitle" style="font-size:1rem;color:#1199f0">工种名称</van-col>
        <van-col span="8" class="spanTitle" style="font-size:1rem;color:#1199f0">操作</van-col>
      </van-row>
      <van-row style="border:1px solid #ccc;" v-for="(item,index) in tableData" :key=index :total="total">
        <van-col span="16" class="spanTitle">{{item.workName }}</van-col>
        <van-col span="8" class="spanTitle"><Button type="info" @click="setPop(item)" size="small">操作</Button></van-col>
      </van-row>
    </div>
    <Popup v-model="isList" position=bottom>
      <Button size=large :loading="deleteLoading" @click="delOfOne">删除</Button>
      <Button size=large @click="adaptContent">修改</Button>
      <Button size=large @click="isList = false">取消</Button>
    </Popup>
    <!-- <div style="height:60vh" v-show="total == 0">
      <img src='@/assets/no-data.png' style="max-width: 100vw;max-height: auto;"/>
    </div> -->
    <div style="margin:1.5rem 0 1rem 0" v-show="total !== 0">
      <Pagination
        v-model="listQuery.offset"
        :page-count="Math.ceil(total/10)"
        :total-items = 'total'
        mode="simple"
        @change="seePage"
      >
      </Pagination>
    </div>
  </div>
</template>
<script>
// import { isShowColumnFormatter } from '@/utils/formatter.js'
import { httpGet, httpPost, httpDelete } from '@/utils/restful'
import { typeManage, defaultGo, addWorker, delWorkType, adaptWorker } from '@/api/url'
import { Collapse, CollapseItem, Field, NavBar, Popup, Toast, Checkbox, Dialog, CheckboxGroup, CellGroup, Button, Cell, Row, Col, Pagination } from 'vant'
export default {
  name: 'workTypeManage',
  components: {
    Collapse,
    CollapseItem,
    NavBar,
    Checkbox,
    CheckboxGroup,
    CellGroup,
    Cell,
    Button,
    Popup,
    Field,
    Pagination,
    'van-row': Row,
    'van-col': Col
  },
  data () {
    return {
      activeNames: ['1'],
      checkedType: [],
      usefulData: [],
      tableData: [],
      total: null,
      ids: undefined,
      setloading: false,
      isList: false,
      isAdd: false,
      deleteLoading: false,
      select: undefined,
      listQuery: {
        offset: 1,
        limit: 10
      },
      workTypeInsertDto: {
        workName: undefined
      }
    }
  },
  created () {
    this.fetchData()
  },
  methods: {
    onClickLeft () {
      this.$router.push('/siteManage/')
    },
    onClickRight () {
      this.isAdd = true
      this.reset()
      this.select = 0
    },
    setPop (item) {
      this.isList = true
      this.ids = [item.id]
      this.cloneData = item
      console.log(this.ids)
    },
    cancel () {
      this.isAdd = false
      this.isList = false
    },
    update () {
      let workerType = Object.assign(this.workTypeInsertDto, {departmentId: this.$store.getters.departmentId})
      httpPost(adaptWorker, workerType)
        .then((res) => {
          Toast({
            message: res.message,
            type: 'success',
            duration: 4 * 1000
          })
          this.fetchData()
          this.isAdd = false
          this.isList = false
        }).catch((err) => {
          console.log(err)
        })
    },
    adaptContent () {
      this.select = 1
      this.isAdd = true
      this.workTypeInsertDto.workName = this.cloneData.workName
      this.workTypeInsertDto.id = this.cloneData.id
    },
    seePage (val) {
      this.listQuery.offset = val
      this.fetchData()
    },
    // 删除
    delOfOne () {
      // let x = [].push(this)
      Dialog.confirm({message: '确认要删除该工种吗？', title: '提示'})
        .then(() => {
          this.deleteLoading = true
          httpDelete(delWorkType + '/' + this.ids + '/' + this.$store.getters.departmentId).then(res => {
            this.deleteLoading = false
            this.fetchData()
            Toast({
              type: 'success',
              message: res.message,
              duration: 4 * 1000
            })
            this.isList = false
          }).catch(() => {
            this.deleteLoading = false
          })
        }).catch(() => {})
    },
    // 添加工种
    addWorkType () {
      this.setloading = true
      this.workTypeInsertDto = Object.assign(this.workTypeInsertDto, {departmentId: this.$store.getters.departmentId})
      httpPost(addWorker, this.workTypeInsertDto)
        .then((res) => {
          Toast({
            message: res.message,
            type: 'success',
            duration: 4 * 1000
          })
          this.fetchData()
          this.isAdd = false
          this.reset()
          this.setloading = false
        }).catch((err) => {
          console.log(err)
          this.setloading = false
        })
    },
    reset () {
      this.workTypeInsertDto = {
        workName: undefined
      }
    },
    goDefault () {
      Dialog.confirm({message: '确定保存默认工种吗？', title: '提示'})
        .then(() => {
          // if (this.checkedType.length === 0) {
          //   for (let i = 0; i < this.usefulData.length; i++) {
          //     this.checkedType.push(this.usefulData[i].id)
          //   }
          // }
          let arrObj = Object.assign({currentCheckedIds: this.checkedType}, {departmentId: this.$store.getters.departmentId})
          httpPost(defaultGo, arrObj)
            .then((res) => {
              Toast({
                type: 'success',
                message: res.message,
                duration: 4 * 1000
              })
            }).catch((err) => {
              console.log(err)
            })
        }).catch(() => {})
    },
    toggle (index) {
      this.$refs.checkboxes[index].toggle()
    },
    fetchData () {
      httpGet(typeManage + '/' + this.$store.getters.departmentId).then(res => {
        console.log(res)
        if (res.data.ids === null) { this.checkedType = [] } else { this.checkedType = res.data.ids }
        if (res.data.defaultWorkTypeInfoDtos === null) { this.usefulData = [] } else { this.usefulData = res.data.defaultWorkTypeInfoDtos }
        if (res.data.workTypeInfoDtos === null) {
          this.total = 0
          this.tableData = []
        } else {
          this.tableData = res.data.workTypeInfoDtos
          this.total = this.tableData.length
        }
        this.listLoading = false
      }).catch(() => {
        this.listLoading = false
        this.total = 0
      })
    }
  }
}
</script>
<style lang="scss" scoped>
  .spanTitle{
    display: table-cell;
    vertical-align: middle;
    text-align:center;
    line-height:3rem;
    font-size: 0.85rem;
    height: 3rem;
    overflow: hidden;
  }
</style>
