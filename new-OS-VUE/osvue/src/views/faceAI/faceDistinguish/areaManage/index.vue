<template>
  <div class="app-container">
    <transition name="el-fade-in-linear">
      <CellModel v-if="createDialog" @saveafter="saveAfter"><el-button icon="el-icon-close" type="text" circle @click="createDialog=false"></el-button></CellModel>
    </transition>
    <div class="table-main">
      <div class="filter-container">
        <el-input  class="filter-item" style="width:150px;" v-model="listQuery.templateName" clearable placeholder="请输入模板名"></el-input>
        <el-button class="filter-item" type="primary"  icon="el-icon-search" @click="searchData">搜索</el-button>
        <el-button class="filter-item" type="primary" @click="reloadGet" icon="el-icon-refresh">刷新</el-button>
        <el-button class="filter-item" type="primary"  icon="el-icon-add" @click="createDialog=true" >创建模板</el-button>
        <el-button class="filter-item" type="primary" @click="handleh"  icon="el-icon-download" v-has="['导出']" >导出</el-button>
        <el-button class="filter-item" type="danger" :disabled="disabled" @click="delOne" icon="el-icon-close">删除所选</el-button>
        <el-button class="filter-item" type="danger" plain @click="deleteAll"  icon="el-icon-delete">删除所有</el-button>
      </div>
      <!-- <el-dialog
        title=""
        :visible.sync="lookDialogVisible">
        <PlanModel :planData="lookPlanData"></PlanModel>
      </el-dialog> -->
      <el-table stripe :header-cell-style="{background:'#f3f4f6'}" style="width: 100%;" max-height="600" :data="tableData"  v-loading.body="listLoading" @selection-change="handleSelectionChange" element-loading-text="加载中..." border fit highlight-current-row>
        <el-table-column type="selection" width="40" fixed="left" ></el-table-column>
        <el-table-column label="模板名" align="center" prop="templateId"></el-table-column>
        <el-table-column label="详细信息" align="center">
          <template slot-scope="scope">
            <span v-for="(item, index) in scope.row.roomsInfo" :key="index">
              {{item.floorStart + (item.floorEnd == item.floorStart?'':'-'+item.floorEnd) + (themeType === 2 ? '层，' : '年级，') + item.roomStart + (item.roomEnd == item.roomStart?'':'-'+item.roomEnd) + (themeType === 2 ? '号房；' : '班；')}}
            </span>
          </template>
        </el-table-column>
        <el-table-column fixed="right" label="操作" align="center" class-name="small-padding fixed-width" width="200">
          <template slot-scope="scope">
            <el-button type="primary" @click.native.prevent="useModel(scope.row)" size="mini">应用</el-button>
            <el-button type="success" @click.native.prevent="doUnit(scope.row)" size="mini">查看</el-button>
            <!-- 查看模板 后台暂无法实现 -->
            <!-- <el-button type="primary" @click.native.prevent="lookModel(scope.row)" size="mini">查看模板</el-button> -->
          </template>
        </el-table-column>
      </el-table>
       <el-dialog
        :modal="false"
        title="查看楼栋/单元"
        :visible.sync="delVisible"
        width="30%">
        <div style="display:flex;justify-content: space-around;margin-bottom:1rem" v-for="item in buildArr" :key=item>
          <el-tag type="warning" style="width:4rem;color:#000;text-align:center">{{item}}</el-tag>
          <el-button plain type="danger" @click="delUnit(item)">删除</el-button>
        </div>
      </el-dialog>
      <div class="pagination-container">
        <el-pagination background  :page-sizes="[5, 10, 20]" @size-change="handleSizeChange" @current-change="handleCurrentChange" :current-page="listQuery.offset " :page-size="listQuery.limit" :total="total" layout="total, sizes, prev, pager, next, jumper"></el-pagination>
      </div>
    </div>
  </div>
</template>
<script>
import { showModel, delUnit, getUnit, deleteModel, deleteAllModel, userTemplateReplaceRooms } from '@/api/url'
import { httpPost, httpGet, httpDelete } from '@/utils/restful'
// import PlanModel from '@/components/PlanModel'
import CellModel from './components/cellModel'
export default {
  components: {
    // PlanModel
    CellModel
  },
  data () {
    return {
      title: '',
      buildArr: [],
      delVisible: false,
      initLoading: false,
      lookDialogVisible: false,
      disabled: true,
      listLoading: false,
      tableData: [],
      total: 0,
      listQuery: {
        templateName: '',
        limit: 5,
        offset: 1
      },
      selectArrayId: [],
      lookPlanData: [],
      createDialog: false,
      jsonData: [
        {
          title: '模板名',
          key: 'templateId',
          type: 'text'
        },
        {
          title: '详细信息',
          key: 'roomsInfo',
          type: 'text'
        }
        // ,
        // {
        //   title: 'Pic',
        //   key: 'pic',
        //   type: 'image',
        //   width: 80,
        //   height: 50
        // }
      ]
    }
  },
  created () {
    this.fetchData()
    this.themeType = this.$store.getters.themeType
  },
  methods: {
    handleh () {
      let obj = JSON.parse(JSON.stringify(this.tableData))
      obj.forEach((item1, index1) => {
        if (item1.roomsInfo) {
          let str = ''
          item1.roomsInfo.forEach((item, index) => {
            str += (item.floorStart + (item.floorEnd === item.floorStart ? '' : '-' + item.floorEnd) + (parseInt(this.themeType) === 2 ? '层，' : '年级，') + item.roomStart + (item.roomEnd === item.roomStart ? '' : '-' + item.roomEnd) + (parseInt(this.themeType) === 2 ? '号房；' : '班；'))
          })
          item1.roomsInfo = str
        }
      })
      this.table2excel(this.jsonData, obj, 'excel.xlsx')
    },
    saveAfter () {
      this.fetchData()
    },
    // 删除单元
    delUnit (name) {
      httpDelete(delUnit, {
        buildingName: name,
        departmentId: this.$store.getters.departmentId
      }).then((res) => {
        this.$message({
          type: 'success',
          duration: 3000,
          message: res.message
        })
        this.delVisible = false
      }).catch(() => {
        this.delVisible = false
      })
    },
    doUnit (row) {
      // 根据部门id跟模板名获取应用到的楼栋
      httpGet(getUnit, {
        departmentId: this.$store.getters.departmentId,
        templateName: row.templateId
      }).then((res) => {
        console.log(res)
        if (res.data.length === 0) {
          this.$message({
            type: 'warning',
            duration: 3000,
            message: '暂无应用到任何楼栋/单元'
          })
        } else {
          this.delVisible = true
          this.buildArr = res.data
        }
      }).catch(() => {})
    },
    searchData () {
      this.listQuery.offset = 1
      this.fetchData()
    },
    // lookModel (row) {
    //   this.lookPlanData = row.templateRooms
    //   this.lookDialogVisible = true
    // },
    useModel (row) {
      if (this.themeType === 2) {
        this.$prompt('楼栋', '应用', {
          confirmButtonText: '确定',
          cancelButtonText: '取消',
          inputPlaceholder: '请输入具体栋号',
          inputValidator (val) {
            if (!val || val === '') {
              return '不能为空'
            }
          }
        }).then(({ value }) => {
          httpPost(userTemplateReplaceRooms, {
            departmentId: this.$store.getters.departmentId,
            templateName: row.templateId,
            buildingName: value,
            templateRooms: row.templateRooms
          }).then((res) => {
            this.$message({
              message: res.message,
              type: 'success',
              duration: 3000
            })
          }).catch((err) => {
            this.$message.error(err)
          })
        }).catch(() => {})
      } else {
        this.$prompt('校区', '应用', {
          confirmButtonText: '确定',
          cancelButtonText: '取消',
          inputPlaceholder: '请输入具体校区名',
          inputValidator (val) {
            if (!val || val === '') {
              return '不能为空'
            }
          }
        }).then(({ value }) => {
          httpPost(userTemplateReplaceRooms, {
            departmentId: this.$store.getters.departmentId,
            templateName: row.templateId,
            buildingName: value,
            templateRooms: row.templateRooms
          }).then((res) => {
            this.$message({
              message: res.message,
              type: 'success',
              duration: 3000
            })
          }).catch((err) => {
            this.$message.error(err)
          })
        }).catch(() => {})
      }
    },
    handleSizeChange (val) {
      this.listQuery.limit = val
      this.fetchData()
    },
    handleCurrentChange (val) {
      this.listQuery.offset = val
      this.fetchData()
    },
    deleteAll () {
      this.$confirm('确认删除所有的模板吗？', '提示', {})
        .then(() => {
          httpDelete(deleteAllModel + '/' + this.$store.getters.departmentId)
            .then((res) => {
              this.$message({
                message: res.message,
                type: 'success',
                duration: 4000
              })
              this.fetchData()
            }).catch(() => {
            })
        }).catch(() => {})
    },
    delOne () {
      httpDelete(deleteModel, {selectArrayId: this.selectArrayId, departmentId: Number(this.$store.getters.departmentId)}).then((res) => {
        this.$message({
          type: 'success',
          message: res.message,
          duration: 4000
        })
        this.fetchData()
      }).catch((err) => {
        console.log(err)
      })
    },
    reloadGet () {
      this.listQuery = {
        departmentId: this.$store.getters.departmentId,
        limit: 5,
        offset: 1
      }
      this.fetchData()
    },
    fetchData () {
      httpGet(showModel, Object.assign({departmentId: this.$store.getters.departmentId}, this.listQuery)).then((res) => {
        if (res.data.rows !== null) {
          this.tableData = res.data.rows
          this.total = res.data.total
        } else {
          this.tableData = []
          this.total = 0
        }
      })
    },
    // 选中
    handleSelectionChange (val) {
      this.selectArrayId = []
      val.map(item => {
        this.selectArrayId.push(item.templateId)
      })
      if (this.selectArrayId.length !== 0) {
        this.disabled = false
      } else {
        this.disabled = true
      }
    }
  }
}
</script>

<style lang="scss" scoped>
.table-main {
  z-index: 2;
  position: relative;
}
</style>
